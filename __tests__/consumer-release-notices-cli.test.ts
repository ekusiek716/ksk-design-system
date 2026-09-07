import { afterEach, describe, expect, it } from "vitest"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { validateConsumerRequests } from "../bin/consumer-release-notices.js"
import { validateContract } from "../templates/consumer-release-notices/check-ds-release.mjs"

const root = process.cwd()
const dirs: string[] = []
const url = "https://github.com/ekusiek716/trip-todo/issues/168"
function fixture(name = "ksk-design-system", gitFile = false) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-notice-cli-"))
  dirs.push(dir)
  mkdirSync(join(dir, "contracts"))
  if (gitFile) writeFileSync(join(dir, ".git"), "gitdir: /fixture/worktree")
  else mkdirSync(join(dir, ".git"))
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name }))
  return dir
}
const run = (cwd: string, ...args: string[]) => spawnSync(process.execPath, [join(root, "bin/init.js"), ...args], { cwd, encoding: "utf8" })
const register = (cwd: string, ...args: string[]) => run(cwd, "register-consumer-request", "--ds-issue", "531", "--consumer-issue", url, ...args)
const path = (dir: string) => join(dir, "contracts/consumer-requests.json")
const registry = (dir: string) => JSON.parse(readFileSync(path(dir), "utf8"))
afterEach(() => { for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true }) })

describe("consumer request registration", () => {
  it("validates the real shipped registry in npm test, including receiver compatibility", () => {
    const actual = registry(root)
    expect(() => validateConsumerRequests(actual)).not.toThrow()
    expect(() => validateContract(actual)).not.toThrow()
    expect(actual.requests).toContainEqual({ dsIssue: 531, consumerIssue: url, fixPr: 532 })
  })
  it("adds pending requests, links fixes, preserves omitted fixes and accumulates apps", () => {
    const dir = fixture("ksk-design-system", true)
    expect(register(dir).status).toBe(0)
    expect(registry(dir).requests[0].fixPr).toBe(null)
    expect(register(dir, "--fix-pr", "532").status).toBe(0)
    const before = readFileSync(path(dir), "utf8")
    expect(register(dir).stdout).toContain("no-op")
    expect(readFileSync(path(dir), "utf8")).toBe(before)
    expect(run(dir, "register-consumer-request", "--ds-issue", "531", "--consumer-issue", "https://github.com/ekusiek716/another-app/issues/12").status).toBe(0)
    expect(registry(dir).requests).toHaveLength(2)
    expect(register(dir, "--fix-pr", "533").status).toBe(0)
    expect(registry(dir).requests[0].fixPr).toBe(533)
  })
  it("dry-run previews without creating or changing the registry", () => {
    const dir = fixture()
    expect(JSON.parse(register(dir, "--dry-run").stdout).requests[0].fixPr).toBe(null)
    expect(existsSync(path(dir))).toBe(false)
    register(dir, "--fix-pr", "532")
    const before = readFileSync(path(dir), "utf8")
    expect(register(dir, "--fix-pr", "534", "--dry-run").status).toBe(0)
    expect(readFileSync(path(dir), "utf8")).toBe(before)
  })
  it("canonicalizes URL case without duplicating an existing issue and rejects other owners", () => {
    const dir = fixture()
    expect(register(dir, "--fix-pr", "532").status).toBe(0)
    expect(run(dir, "register-consumer-request", "--ds-issue", "531", "--consumer-issue", url.toUpperCase()).status).toBe(0)
    expect(registry(dir).requests).toEqual([{ dsIssue: 531, consumerIssue: url, fixPr: 532 }])
    expect(run(dir, "register-consumer-request", "--ds-issue", "531", "--consumer-issue", url.replace("ekusiek716", "other-owner")).status).toBe(1)
    expect(() => validateConsumerRequests({ schemaVersion: 1, requests: [{ dsIssue: 1, consumerIssue: url, fixPr: null }, { dsIssue: 1, consumerIssue: url.replace("trip-todo", "Trip-Todo"), fixPr: null }] })).toThrow()
  })
  it.each(["0", "-1", "1.5", "1e2", "9007199254740992", "null"])("rejects invalid integers %s", (value) => {
    const dir = fixture()
    expect(register(dir, "--fix-pr", value).status).toBe(1)
    expect(run(dir, "register-consumer-request", "--ds-issue", value, "--consumer-issue", url).status).toBe(1)
    expect(existsSync(path(dir))).toBe(false)
  })
  it.each([url + "?x=1", url + "#comment", url.replace("https:", "http:"), url.replace("github.com", "github.com.evil.test"), url.replace("github.com", "secret@github.com"), url.replace("trip-todo", ".."), url.replace("trip-todo", "%2e%2e"), url + "\n", url.replace("/issues/", "/pull/")])("rejects unsafe URL %s", (value) => {
    expect(run(fixture(), "register-consumer-request", "--ds-issue", "531", "--consumer-issue", value).status).toBe(1)
  })
  it("rejects consumer roots, missing repo markers, unknown flags, duplicates and invalid registries", () => {
    expect(register(fixture("consumer")).status).toBe(1)
    const dir = fixture()
    expect(register(dir, "--force").status).toBe(1)
    expect(register(dir, "--ds-issue", "123").status).toBe(1)
    expect(register(dir, "--fix-pr").status).toBe(1)
    writeFileSync(path(dir), '{"schemaVersion":2,"requests":[]}')
    expect(register(dir).status).toBe(1)
    expect(registry(dir).schemaVersion).toBe(2)
    rmSync(join(dir, ".git"), { recursive: true })
    expect(register(dir).status).toBe(1)
    const noContracts = fixture()
    rmSync(join(noContracts, "contracts"), { recursive: true })
    expect(register(noContracts).status).toBe(1)
  })
  it.each([
    { schemaVersion: 1, requests: [{ dsIssue: 0, consumerIssue: url, fixPr: null }] },
    { schemaVersion: 1, requests: [{ dsIssue: 1, consumerIssue: url }] },
    { schemaVersion: 1, requests: [null] },
    { schemaVersion: 1, requests: Array(2).fill({ dsIssue: 1, consumerIssue: url, fixPr: 2 }) },
  ])("rejects malformed actual-contract shapes", (value) => {
    expect(() => validateConsumerRequests(value)).toThrow()
  })
})

describe("explicit release-notice installation", () => {
  const targets = [".github/workflows/ds-release-notices.yml", ".github/scripts/check-ds-release.mjs"]
  it("copies the actual packaged templates exactly and repeats as no-op", () => {
    const dir = fixture("consumer")
    expect(run(dir, "init-release-notices").status).toBe(0)
    for (const [index, source] of ["workflow.yml", "check-ds-release.mjs"].entries()) {
      expect(readFileSync(join(dir, targets[index]))).toEqual(readFileSync(join(root, "templates/consumer-release-notices", source)))
    }
    expect(run(dir, "init-release-notices").stdout.match(/Unchanged/g)).toHaveLength(2)
  })
  it.each(targets)("refuses conflict in %s before writing either file", (target) => {
    const dir = fixture("consumer")
    mkdirSync(join(dir, target, ".."), { recursive: true })
    writeFileSync(join(dir, target), "custom")
    expect(run(dir, "init-release-notices").status).toBe(1)
    expect(readFileSync(join(dir, target), "utf8")).toBe("custom")
    expect(existsSync(join(dir, targets.find((item) => item !== target)!))).toBe(false)
  })
  it("rejects symlink destinations and registry symlinks", () => {
    const dir = fixture("consumer")
    const outside = fixture()
    symlinkSync(outside, join(dir, ".github"))
    expect(run(dir, "init-release-notices").status).toBe(1)
    expect(existsSync(join(outside, "workflows"))).toBe(false)
    symlinkSync(join(outside, "missing.json"), path(outside))
    expect(register(outside).status).toBe(1)
  })
  it("is never run by init and rejects force/non-repo execution", () => {
    const dir = fixture("consumer")
    expect(run(dir, "init").status).toBe(0)
    expect(existsSync(join(dir, ".github"))).toBe(false)
    expect(run(dir, "init-release-notices", "--force").status).toBe(1)
    rmSync(join(dir, ".git"), { recursive: true })
    expect(run(dir, "init-release-notices").status).toBe(1)
  })
  it("uses pinned existing actions and a repo-scoped scheduled receiver without install", () => {
    const workflow = readFileSync(join(root, "templates/consumer-release-notices/workflow.yml"), "utf8")
    const publish = readFileSync(join(root, ".github/workflows/publish.yml"), "utf8")
    for (const action of workflow.matchAll(/uses: (actions\/[\w-]+@[a-f0-9]{40})/g)) expect(publish).toContain(action[1])
    for (const required of ["23 */6 * * *", "workflow_dispatch:", "contents: read", "issues: write", "cancel-in-progress: false", "node-version: 24", "GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}", 'node .github/scripts/check-ds-release.mjs --repo "$GITHUB_REPOSITORY" --apply']) expect(workflow).toContain(required)
    expect(workflow).not.toMatch(/npm (ci|install)|pull_request_target/)
  })
})
