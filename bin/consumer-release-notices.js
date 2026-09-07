import { existsSync, lstatSync, readFileSync, writeFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { spawnSync } from "node:child_process"
import { parseConsumerIssue, validateContract } from "../templates/consumer-release-notices/check-ds-release.mjs"

function positiveInt(value, name) {
  if (!/^[1-9]\d*$/.test(String(value)) || !Number.isSafeInteger(Number(value))) {
    throw new Error(`${name} must be a positive safe integer`)
  }
  return Number(value)
}

function issueUrl(value) {
  if (typeof value !== "string" || /\s/.test(value)) throw new Error("consumer-issue must be a GitHub issue URL without whitespace")
  const canonical = value.toLowerCase()
  parseConsumerIssue(canonical)
  return canonical
}

function statOrNull(path) {
  try { return lstatSync(path) } catch (error) {
    if (error.code === "ENOENT") return null
    throw error
  }
}

function safePath(root, path) {
  let current = root
  const parts = relative(root, path).split(/[\\/]/)
  for (const [index, part] of parts.entries()) {
    current = join(current, part)
    const stat = statOrNull(current)
    if (stat?.isSymbolicLink()) throw new Error(`Symlink is not allowed: ${current}`)
    if (stat && index < parts.length - 1 && !stat.isDirectory()) throw new Error(`Not a directory: ${current}`)
  }
}

export function validateConsumerRequests(registry) {
  validateContract(registry)
  for (const request of registry.requests) issueUrl(request.consumerIssue)
  return registry
}

function github(runGh) {
  return (endpoint, method = "GET", fields = {}, paginate = false) => {
    const args = ["api", "--hostname", "github.com", endpoint, "--method", method]
    if (paginate) args.push("--paginate", "--slurp")
    for (const [key, value] of Object.entries(fields)) args.push("-f", `${key}=${value}`)
    const result = runGh("gh", args, { encoding: "utf8", timeout: 30000, maxBuffer: 8 * 1024 * 1024 })
    // Do not echo gh stderr: it may include credentials or private response details.
    if (result.error || result.status !== 0) throw new Error(`GitHub ${method} failed: ${endpoint}. Check gh authentication/permissions and retry the same command.`)
    try { return JSON.parse(result.stdout) } catch { throw new Error(`Invalid GitHub response: ${endpoint}`) }
  }
}

function readIssue(api, repo, number) {
  const issue = api(`repos/${repo}/issues/${number}`)
  if (!issue || issue.pull_request || issue.number !== number ||
      typeof issue.html_url !== "string" || issueUrl(issue.html_url) !== `https://github.com/${repo}/issues/${number}` ||
      !["open", "closed"].includes(issue.state)) throw new Error(`Expected a regular issue: ${repo}#${number}`)
  return issue
}

function ensureWaiting(api, repo, number) {
  // Re-read after writing the registry so a retry cannot downgrade released/closed work.
  const issue = readIssue(api, repo, number)
  if (issue.state === "closed") return
  const pages = api(`repos/${repo}/issues/${number}/labels?per_page=100`, "GET", {}, true)
  if (!Array.isArray(pages) || pages.some((page) => !Array.isArray(page))) throw new Error("Invalid issue label response")
  const labels = pages.flat()
  if (labels.some((label) => typeof label?.name !== "string")) throw new Error("Invalid issue label response")
  if (labels.some((label) => ["ds:released", "ds:waiting"].includes(label.name.toLowerCase()))) return
  const endpoint = `repos/${repo}/labels/ds%3Awaiting`
  try { api(endpoint) } catch {
    try { api(`repos/${repo}/labels`, "POST", { name: "ds:waiting", color: "fbca04", description: "DS修正版の公開待ち" }) }
    catch { api(endpoint) } // Another registration may have created the label concurrently.
  }
  api(`repos/${repo}/issues/${number}/labels`, "POST", { "labels[]": "ds:waiting" })
  console.log(`Ensured ds:waiting on ${repo}#${number}`)
}

function register(args, cwd, runGh) {
  const options = new Map()
  for (let i = 0; i < args.length; i++) {
    const key = args[i]
    if (!["--ds-issue", "--consumer-issue", "--fix-pr", "--dry-run"].includes(key) || options.has(key)) throw new Error(`Unknown or duplicate option: ${key}`)
    if (key === "--dry-run") options.set(key, true)
    else {
      const value = args[++i]
      if (!value || value.startsWith("--")) throw new Error(`Missing value: ${key}`)
      options.set(key, value)
    }
  }
  const dsIssue = positiveInt(options.get("--ds-issue"), "ds-issue")
  const consumerIssue = issueUrl(options.get("--consumer-issue"))
  const fixPr = options.has("--fix-pr") ? positiveInt(options.get("--fix-pr"), "fix-pr") : undefined
  const packagePath = join(cwd, "package.json")
  const contracts = join(cwd, "contracts")
  safePath(cwd, packagePath)
  safePath(cwd, contracts)
  if (!existsSync(join(cwd, ".git")) || !statOrNull(contracts)?.isDirectory() ||
      !existsSync(packagePath) || JSON.parse(readFileSync(packagePath, "utf8")).name !== "ksk-design-system") {
    throw new Error("Run registration at the DS source repo root (ksk-design-system + .git + contracts/), never in a consumer")
  }
  const path = join(contracts, "consumer-requests.json")
  safePath(cwd, path)
  const before = existsSync(path) ? readFileSync(path, "utf8") : null
  const registry = before === null ? { schemaVersion: 1, requests: [] } : JSON.parse(before)
  validateConsumerRequests(registry)
  const existing = registry.requests.find((request) => request.dsIssue === dsIssue && issueUrl(request.consumerIssue) === consumerIssue)
  if (existing) {
    existing.consumerIssue = consumerIssue
    if (fixPr !== undefined) existing.fixPr = fixPr
  } else registry.requests.push({ dsIssue, consumerIssue, fixPr: fixPr ?? null })
  const after = JSON.stringify(registry, null, 2) + "\n"
  if (options.has("--dry-run")) { console.log(after.trimEnd()); return }
  const api = github(runGh)
  const target = parseConsumerIssue(consumerIssue)
  readIssue(api, "ekusiek716/ksk-design-system", dsIssue)
  readIssue(api, target.repo, target.number)
  if (before === null || JSON.stringify(JSON.parse(before)) !== JSON.stringify(registry)) {
    writeFileSync(path, after)
    console.log(`Updated ${path}`)
  } else console.log("Consumer request already registered (no-op)")
  ensureWaiting(api, target.repo, target.number)
}

export function runConsumerReleaseNoticesCli(command, args, { cwd, runGh = spawnSync }) {
  try {
    if (command === "register-consumer-request") register(args, resolve(cwd), runGh)
    else if (command === "init-release-notices") throw new Error("init-release-notices is retired: remove the consumer polling workflow/script. Release notices run only during the DS bulk bump (scripts/update-consumers.sh).")
    else throw new Error(`Unknown command: ${command}`)
    return 0
  } catch (error) {
    console.error(`[ksk-ds ${command}] ${error.message}`)
    return 1
  }
}
