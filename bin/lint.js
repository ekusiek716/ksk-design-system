import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { extname, join, relative, resolve } from "node:path"
import { spawnSync } from "node:child_process"
import { inspectCardChildSpacing } from "./card-child-spacing.js"

const DEFAULT_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"])
const DEFAULT_IGNORES = [
  ".git",
  ".next",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
]

export async function runLintCli(argv, { cwd = process.cwd(), pkgRoot = resolve(".") } = {}) {
  const options = parseArgs(argv)
  const rulesPath = resolve(pkgRoot, "contracts/rules.json")
  if (!existsSync(rulesPath)) {
    console.error(`contracts/rules.json が見つかりません: ${rulesPath}`)
    return 1
  }

  const rules = loadRules(rulesPath)
  const files = options.changed
    ? getChangedFiles(cwd, options)
    : collectTargetFiles(cwd, options.targets, options)
  const findings = []

  for (const file of files) {
    findings.push(...lintFile(file, cwd, rules, options))
  }

  const summary = summarize(findings)
  if (options.format === "json") {
    console.log(JSON.stringify({ results: findings, summary }, null, 2))
  } else {
    printText(findings, summary)
  }

  return summary.errors > 0 ? 1 : 0
}

function parseArgs(argv) {
  const targets = []
  const excludes = []
  let format = "text"
  let changed = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--format") {
      format = argv[++i] ?? "text"
      continue
    }
    if (arg.startsWith("--format=")) {
      format = arg.slice("--format=".length)
      continue
    }
    if (arg === "--changed") {
      changed = true
      continue
    }
    if (arg === "--exclude") {
      excludes.push(argv[++i])
      continue
    }
    if (arg.startsWith("--exclude=")) {
      excludes.push(arg.slice("--exclude=".length))
      continue
    }
    if (arg === "--help" || arg === "-h") {
      console.log(`ksk-ds lint

使い方:
  ksk-ds lint [path ...]
  ksk-ds lint src --changed
  ksk-ds lint src --format json

オプション:
  --changed       Git の変更ファイルのみ検査
  --format json   JSON 出力
  --exclude TEXT  パスに TEXT を含むファイルを除外

例外:
  // ksk-ds-allow-custom-ui: domain-specific reason
`)
      process.exit(0)
    }
    if (!arg.startsWith("-")) targets.push(arg)
  }

  return {
    changed,
    excludes: excludes.filter(Boolean),
    format: format === "json" ? "json" : "text",
    targets: targets.length > 0 ? targets : ["."],
  }
}

function loadRules(rulesPath) {
  const contract = JSON.parse(readFileSync(rulesPath, "utf8"))
  const prohibited = Array.isArray(contract)
    ? contract
    : Array.isArray(contract.prohibited)
      ? contract.prohibited
      : []
  const aiPatterns = Array.isArray(contract?.aiPatterns?.patterns)
    ? contract.aiPatterns.patterns.map((rule) => ({ ...rule, category: "ai-pattern", severity: "warn" }))
    : []

  return [...prohibited, ...aiPatterns].filter((rule) => typeof rule.pattern === "string" && rule.pattern.length > 0)
}

function collectTargetFiles(cwd, targets, options) {
  const files = []
  for (const target of targets) {
    const abs = resolve(cwd, target)
    if (!existsSync(abs)) continue
    collect(abs, cwd, options, files)
  }
  return files
}

function collect(abs, cwd, options, out) {
  const rel = normalize(relative(cwd, abs))
  if (shouldIgnorePath(rel, options)) return
  const stat = statSync(abs)
  if (stat.isDirectory()) {
    for (const entry of readdirSync(abs)) {
      collect(join(abs, entry), cwd, options, out)
    }
    return
  }
  if (stat.isFile() && DEFAULT_EXTENSIONS.has(extname(abs))) out.push(abs)
}

function getChangedFiles(cwd, options) {
  const names = new Set()
  for (const args of [
    ["diff", "--name-only", "--diff-filter=ACMR", "origin/main...HEAD"],
    ["diff", "--name-only", "--diff-filter=ACMR"],
    ["diff", "--name-only", "--diff-filter=ACMR", "--cached"],
  ]) {
    const result = spawnSync("git", args, { cwd, encoding: "utf8" })
    if (result.status !== 0) continue
    for (const line of result.stdout.split(/\r?\n/)) {
      if (line.trim()) names.add(line.trim())
    }
  }
  return [...names]
    .map((name) => resolve(cwd, name))
    .filter((abs) => existsSync(abs))
    .filter((abs) => !shouldIgnorePath(normalize(relative(cwd, abs)), options))
    .filter((abs) => DEFAULT_EXTENSIONS.has(extname(abs)))
}

function lintFile(file, cwd, rules) {
  const rel = normalize(relative(cwd, file))
  const source = readFileSync(file, "utf8")
  const escape = findEscape(source, rel)
  if (escape.valid) return []

  const findings = []
  if (escape.invalid) findings.push(escape.invalid)
  const lines = source.split(/\r?\n/)

  for (const rule of rules) {
    if (rule.engine === "card-direct-child-spacing") {
      for (const finding of inspectCardChildSpacing(source, file)) {
        const line = lines[finding.line - 1] ?? ""
        if (!matchesRuleExclude(rule, rel, line)) {
          findings.push(toFinding(rule, rel, finding.line))
        }
      }
      continue
    }
    let regex
    try {
      regex = new RegExp(rule.pattern)
    } catch {
      continue
    }
    if (rule.pattern.includes("[\\s\\S]")) {
      const match = source.match(regex)
      if (match && match.index != null) {
        const lineNumber = lineForIndex(source, match.index)
        const line = lines[lineNumber - 1] ?? ""
        if (!matchesRuleExclude(rule, rel, line)) {
          findings.push(toFinding(rule, rel, lineNumber))
        }
      }
      continue
    }
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]
      if (matchesRuleExclude(rule, rel, line)) continue
      if (!regex.test(line)) continue
      findings.push(toFinding(rule, rel, index + 1))
    }
  }

  return findings
}

function toFinding(rule, file, line) {
  return {
    file,
    line,
    ruleId: rule.id ?? "UNKNOWN",
    severity: rule.severity === "error" ? "error" : "warn",
    category: rule.category ?? "pattern",
    message: rule.message ?? rule.name ?? "DS rule violation",
    fix: rule.fix ?? "",
  }
}

function findEscape(source, file) {
  const match = source.match(/ksk-ds-allow-custom-ui(?::\s*(.+))?/)
  if (!match) return { valid: false }
  const reason = match[1]?.trim()
  if (reason) return { valid: true }
  return {
    valid: false,
    invalid: {
      file,
      line: lineForIndex(source, match.index ?? 0),
      ruleId: "ESCAPE001",
      severity: "error",
      category: "escape",
      message: "ksk-ds-allow-custom-ui には理由が必要です",
      fix: "例: // ksk-ds-allow-custom-ui: domain-specific reason",
    },
  }
}

function lineForIndex(source, index) {
  return source.slice(0, index).split(/\r?\n/).length
}

function matchesRuleExclude(rule, file, line) {
  const excludes = Array.isArray(rule.excludes) ? rule.excludes : []
  return excludes.some((exclude) => file.includes(exclude) || line.includes(exclude))
}

function shouldIgnorePath(relPath, options) {
  if (!relPath || relPath === ".") return false
  const parts = relPath.split("/")
  if (parts.some((part) => DEFAULT_IGNORES.includes(part))) return true
  return options.excludes.some((exclude) => relPath.includes(exclude))
}

function summarize(findings) {
  return {
    files: new Set(findings.map((finding) => finding.file)).size,
    errors: findings.filter((finding) => finding.severity === "error").length,
    warnings: findings.filter((finding) => finding.severity !== "error").length,
  }
}

function printText(findings, summary) {
  if (findings.length === 0) {
    console.log("ksk-ds lint: 違反は見つかりませんでした")
    return
  }
  for (const finding of findings) {
    console.log(`${finding.file}:${finding.line} ${finding.severity} ${finding.ruleId} ${finding.message}`)
    if (finding.fix) console.log(`  fix: ${finding.fix}`)
  }
  console.log(`\nksk-ds lint: ${summary.errors} error / ${summary.warnings} warn in ${summary.files} files`)
}

function normalize(path) {
  return path.replaceAll("\\", "/")
}
