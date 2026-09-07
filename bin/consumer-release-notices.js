import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
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

function register(args, cwd) {
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
  if (options.has("--dry-run")) console.log(after.trimEnd())
  else if (before === null || JSON.stringify(JSON.parse(before)) !== JSON.stringify(registry)) {
    writeFileSync(path, after)
    console.log(`Updated ${path}`)
  } else console.log("Consumer request already registered (no-op)")
}

function install(args, cwd, pkgRoot) {
  if (args.length) throw new Error(`init-release-notices accepts no options: ${args.join(" ")}`)
  if (!existsSync(join(cwd, ".git"))) throw new Error("Run init-release-notices at the consumer repo root (.git required)")
  const files = [
    ["workflow.yml", ".github/workflows/ds-release-notices.yml"],
    ["check-ds-release.mjs", ".github/scripts/check-ds-release.mjs"],
  ].map(([source, target]) => {
    const path = join(cwd, target)
    safePath(cwd, path)
    const content = readFileSync(join(pkgRoot, "templates/consumer-release-notices", source))
    const stat = statOrNull(path)
    if (stat && (!stat.isFile() || !readFileSync(path).equals(content))) throw new Error(`Existing file differs; resolve manually: ${path}`)
    return { path, content, exists: Boolean(stat) }
  })
  // Preflight both files before creating directories or writing either destination.
  for (const file of files) {
    if (file.exists) { console.log(`Unchanged ${file.path}`); continue }
    mkdirSync(dirname(file.path), { recursive: true })
    writeFileSync(file.path, file.content, { flag: "wx" })
    console.log(`Created ${file.path}`)
  }
}

export function runConsumerReleaseNoticesCli(command, args, { cwd, pkgRoot }) {
  try {
    if (command === "register-consumer-request") register(args, resolve(cwd))
    else if (command === "init-release-notices") install(args, resolve(cwd), resolve(pkgRoot))
    else throw new Error(`Unknown command: ${command}`)
    return 0
  } catch (error) {
    console.error(`[ksk-ds ${command}] ${error.message}`)
    return 1
  }
}
