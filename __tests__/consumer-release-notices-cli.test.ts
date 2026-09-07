import { afterEach, expect, it, vi } from "vitest"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { runConsumerReleaseNoticesCli, validateConsumerRequests } from "../bin/consumer-release-notices.js"
import { validateContract } from "../templates/consumer-release-notices/check-ds-release.mjs"

const root = process.cwd()
const dirs: string[] = []
const url = "https://github.com/ekusiek716/trip-todo/issues/168"
const path = (dir: string) => join(dir, "contracts/consumer-requests.json")
const registry = (dir: string) => JSON.parse(readFileSync(path(dir), "utf8"))
function fixture(name = "ksk-design-system") {
  const dir = mkdtempSync(join(tmpdir(), "ksk-notice-cli-"))
  dirs.push(dir)
  mkdirSync(join(dir, "contracts"))
  writeFileSync(join(dir, ".git"), "gitdir: /fixture/worktree")
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name }))
  return dir
}
type State = { closed?: boolean; released?: boolean; waiting?: boolean; pr?: string; fail?: boolean; failPost?: boolean; labelExists?: boolean }
function mockGh(state: State = {}) {
  return vi.fn((_command: string, args: string[]) => {
    const endpoint = args[3], method = args[5]
    if (state.fail || (state.failPost && method === "POST")) return { status: 1, stderr: "SECRET" }
    if (method === "POST") {
      if (endpoint.endsWith("/issues/168/labels")) state.waiting = true
      else state.labelExists = true
      return { status: 0, stdout: JSON.stringify({ name: "ds:waiting" }) }
    }
    if (endpoint.endsWith("labels/ds%3Awaiting")) return state.labelExists ? { status: 0, stdout: '{"name":"ds:waiting"}' } : { status: 1 }
    if (endpoint.includes("/labels?")) return { status: 0, stdout: JSON.stringify([[], state.released ? [{ name: "ds:released" }] : state.waiting ? [{ name: "ds:waiting" }] : []]) }
    const ds = endpoint.includes("ksk-design-system")
    return { status: 0, stdout: JSON.stringify({ number: ds ? 531 : 168, html_url: ds ? "https://github.com/ekusiek716/ksk-design-system/issues/531" : url, state: !ds && state.closed ? "closed" : "open", ...(state.pr === (ds ? "ds" : "app") ? { pull_request: {} } : {}) }) }
  })
}
function run(dir: string, gh: ReturnType<typeof mockGh>, extra: string[] = [], target = url) {
  return runConsumerReleaseNoticesCli("register-consumer-request", ["--ds-issue", "531", "--consumer-issue", target, ...extra], { cwd: dir, runGh: gh })
}
afterEach(() => { vi.restoreAllMocks(); for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true }) })

it("validates the real contract through the runtime validator", () => {
  expect(() => validateConsumerRequests(registry(root))).not.toThrow()
  expect(() => validateContract(registry(root))).not.toThrow()
})
it("registers pending, creates waiting, links fixes, canonicalizes and retries idempotently", () => {
  const dir = fixture(), gh = mockGh()
  expect(run(dir, gh)).toBe(0)
  expect(registry(dir).requests[0]).toEqual({ dsIssue: 531, consumerIssue: url, fixPr: null })
  expect(gh.mock.calls.some(([, args]) => args.includes("labels[]=ds:waiting"))).toBe(true)
  expect(run(dir, gh, ["--fix-pr", "532"])).toBe(0)
  const before = readFileSync(path(dir), "utf8")
  gh.mockClear()
  expect(run(dir, gh, [], url.toUpperCase())).toBe(0)
  expect(readFileSync(path(dir), "utf8")).toBe(before)
  expect(gh.mock.calls.every(([, args]) => args[5] === "GET")).toBe(true)
})
it("preserves other app entries", () => {
  const dir = fixture()
  const other = { dsIssue: 531, consumerIssue: "https://github.com/ekusiek716/other/issues/12", fixPr: 532 }
  writeFileSync(path(dir), JSON.stringify({ schemaVersion: 1, requests: [other] }))
  expect(run(dir, mockGh())).toBe(0)
  expect(registry(dir).requests).toHaveLength(2)
  expect(registry(dir).requests[0]).toEqual(other)
})
it.each([{ closed: true }, { released: true }])("never downgrades closed/released: %j", (state) => {
  const gh = mockGh(state)
  expect(run(fixture(), gh)).toBe(0)
  expect(gh.mock.calls.every(([, args]) => args[5] === "GET")).toBe(true)
})
it.each(["ds", "app"])("rejects %s PR before saving or writing", (pr) => {
  const dir = fixture(), gh = mockGh({ pr })
  expect(run(dir, gh)).toBe(1)
  expect(existsSync(path(dir))).toBe(false)
  expect(gh.mock.calls.every(([, args]) => args[5] === "GET")).toBe(true)
})
it("fails auth without saving or leaking stderr", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {})
  const dir = fixture()
  expect(run(dir, mockGh({ fail: true }))).toBe(1)
  expect(existsSync(path(dir))).toBe(false)
  expect(JSON.stringify(error.mock.calls)).not.toContain("SECRET")
})
it("keeps saved registration on label failure and repairs on retry", () => {
  const dir = fixture(), state = { failPost: true, labelExists: true }, gh = mockGh(state)
  expect(run(dir, gh)).toBe(1)
  expect(registry(dir).requests).toHaveLength(1)
  state.failPost = false
  expect(run(dir, gh)).toBe(0)
  expect(registry(dir).requests).toHaveLength(1)
})
it("dry-run does not call gh or write files, including CLI dispatch", () => {
  const dir = fixture(), gh = mockGh({ fail: true })
  expect(run(dir, gh, ["--dry-run"])).toBe(0)
  expect(gh).not.toHaveBeenCalled()
  expect(existsSync(path(dir))).toBe(false)
  const result = spawnSync(process.execPath, [join(root, "bin/init.js"), "register-consumer-request", "--ds-issue", "531", "--consumer-issue", url, "--dry-run"], { cwd: dir, encoding: "utf8" })
  expect(result.status).toBe(0)
  expect(JSON.parse(result.stdout).requests).toHaveLength(1)
})
it.each(["0", "-1", "1.5", "1e2", "9007199254740992", "null"])("rejects invalid fix integer %s", (value) => {
  const gh = mockGh()
  expect(run(fixture(), gh, ["--fix-pr", value])).toBe(1)
  expect(gh).not.toHaveBeenCalled()
})
it.each([url + "?x=1", url + "#x", url + "\n", url.replace("https:", "http:"), url.replace("github.com", "secret@github.com"), url.replace("trip-todo", ".."), url.replace("ekusiek716", "other-owner")])("rejects invalid URL %s", (target) => {
  const gh = mockGh()
  expect(run(fixture(), gh, [], target)).toBe(1)
  expect(gh).not.toHaveBeenCalled()
})
it("rejects consumer root, invalid contract and flags before network", () => {
  const gh = mockGh(), dir = fixture()
  expect(run(fixture("consumer"), gh)).toBe(1)
  expect(run(dir, gh, ["--force"])).toBe(1)
  expect(run(dir, gh, ["--ds-issue", "123"])).toBe(1)
  writeFileSync(path(dir), '{"schemaVersion":2,"requests":[]}')
  expect(run(dir, gh)).toBe(1)
  expect(gh).not.toHaveBeenCalled()
})
it("rejects duplicate app URLs differing only by case", () => {
  expect(() => validateConsumerRequests({ schemaVersion: 1, requests: [url, url.replace("trip-todo", "Trip-Todo")].map((consumerIssue) => ({ dsIssue: 531, consumerIssue, fixPr: null })) })).toThrow()
})
it("retired installer stops with migration guidance without creating files", () => {
  const dir = fixture("consumer")
  const result = spawnSync(process.execPath, [join(root, "bin/init.js"), "init-release-notices"], { cwd: dir, encoding: "utf8" })
  expect(result.status).toBe(1)
  expect(result.stderr).toContain("retired")
  expect(existsSync(join(dir, ".github"))).toBe(false)
  expect(existsSync(join(root, "templates/consumer-release-notices/workflow.yml"))).toBe(false)
})
