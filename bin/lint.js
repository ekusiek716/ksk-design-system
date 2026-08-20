import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { extname, join, relative, resolve } from "node:path"
import { spawnSync } from "node:child_process"
import { inspectCardChildSpacing } from "./card-child-spacing.js"
import { inspectProductThemeOverrides, loadProductThemeContract } from "./product-theme-override.js"

const DEFAULT_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"])
/**
 * CSS 専用ルール（P049）の走査対象。TSX 向けの正規表現ルールは CSS には当てず、
 * engine: "product-theme-override" を持つルールだけをここに流す（issue #364）。
 */
const CSS_EXTENSIONS = new Set([".css"])
// ビルド生成物。ここを走査すると、バンドルされた DS 自身の CSS を
// 「consumer が DS 変数を上書きしている」と誤認して P049 が大量に出る（#378）。
// Next.js の `output: "export"` は out/、Nuxt は .output/、Vercel/Turbo は
// それぞれ .vercel/ .turbo/ を既定の出力先にする。
const DEFAULT_IGNORES = [
  ".git",
  ".next",
  ".nuxt",
  ".output",
  ".svelte-kit",
  ".turbo",
  ".vercel",
  "build",
  "coverage",
  "dist",
  ".claude",
  "node_modules",
  "out",
  "storybook-static",
]

// パス単位で除外するもの（セグメント名だけでは絞れないケース）。
// Capacitor は web のビルド成果物をネイティブプロジェクト配下へコピーするので、
// そこも DS 自身の CSS を含む（#378）。`public` をセグメントで除外すると
// Next.js の public/ まで巻き込むため、パス形で限定する。
const DEFAULT_IGNORE_PATHS = [
  "ios/App/App/public",
  "android/app/src/main/assets/public",
]

export async function runLintCli(argv, { cwd = process.cwd(), pkgRoot = resolve(".") } = {}) {
  const options = parseArgs(argv)
  const rulesPath = resolve(pkgRoot, "contracts/rules.json")
  if (!existsSync(rulesPath)) {
    console.error(`contracts/rules.json が見つかりません: ${rulesPath}`)
    return 1
  }

  const rules = loadRules(rulesPath)
  const cssRules = rules.filter((rule) => rule.engine === "product-theme-override")
  const sourceRules = rules.filter((rule) => rule.engine !== "product-theme-override")
  const productThemeContract = cssRules.length > 0 ? readProductThemeContract(pkgRoot) : null

  const files = options.changed
    ? getChangedFiles(cwd, options)
    : collectTargetFiles(cwd, options.targets, options)
  const findings = []

  for (const file of files) {
    if (CSS_EXTENSIONS.has(extname(file))) {
      if (productThemeContract) {
        findings.push(...lintCssFile(file, cwd, cssRules, productThemeContract))
      }
      continue
    }
    findings.push(...lintFile(file, cwd, sourceRules, options))
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
  if (stat.isFile() && isLintableFile(abs)) out.push(abs)
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
    .filter((abs) => isLintableFile(abs))
}

function isLintableFile(abs) {
  const ext = extname(abs)
  return DEFAULT_EXTENSIONS.has(ext) || CSS_EXTENSIONS.has(ext)
}

/** contracts/product-theme-overrides.json（P049 の許可リスト）を読む */
function readProductThemeContract(pkgRoot) {
  const path = resolve(pkgRoot, "contracts/product-theme-overrides.json")
  if (!existsSync(path)) return null
  try {
    // pkgRoot を渡すと「DS に実在する変数」だけを違反にする（issue #377）。
    // DS の CSS が読めない環境では接頭辞一致だけの従来判定へフォールバックする。
    return loadProductThemeContract(JSON.parse(readFileSync(path, "utf8")), { pkgRoot })
  } catch {
    return null
  }
}

/**
 * CSS ファイルには product theme の許可リスト検査（P049）だけを当てる。
 * TSX 向けの正規表現ルールを CSS に流すと誤検知しかしない。
 */
function lintCssFile(file, cwd, cssRules, contract) {
  const rel = normalize(relative(cwd, file))
  const source = readFileSync(file, "utf8")
  const escape = findEscape(source, rel)
  if (escape.valid) return []

  const findings = escape.invalid ? [escape.invalid] : []
  for (const rule of cssRules) {
    for (const violation of inspectProductThemeOverrides(source, contract)) {
      if (matchesRuleExclude(rule, rel, violation.name)) continue
      findings.push({
        ...toFinding(rule, rel, violation.line),
        message: `${rule.message ?? "product theme の許可リスト外の変数を上書きしています"}: ${violation.name}`,
      })
    }
  }
  return findings
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
    const isFullFileRule = rule.pattern.includes("[\\s\\S]")
    let regex
    try {
      // 全ファイル横断ルールは matchAll で複数件拾うため g フラグを必須にする
      // （issue #389: source.match() は最初の1件しか返さず取りこぼしていた）。
      regex = new RegExp(rule.pattern, isFullFileRule ? "g" : undefined)
    } catch {
      continue
    }
    if (isFullFileRule) {
      for (const match of source.matchAll(regex)) {
        if (match.index == null) continue
        const lineNumber = lineForIndex(source, match.index)
        const line = lines[lineNumber - 1] ?? ""
        if (matchesRuleExclude(rule, rel, line)) continue
        findings.push(toFinding(rule, rel, lineNumber))
      }
      continue
    }
    for (let index = 0; index < lines.length; index++) {
      let line = lines[index]
      if (matchesRuleExclude(rule, rel, line)) continue
      // コメント行はスキップ、行末コメント / JSX の {/* ... */} 単一行コメントは
      // 除去してから照合する（issue #390: 従来 P047 限定だった除去処理を全ルールへ
      // 引き上げ。コメントで要素名を説明しただけの行が誤検知されるのを防ぐ）。
      if (isCommentOnlyLine(line)) continue
      line = stripLineComment(line)
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

// 行単位ルール共通: コメント行 / JSDoc 継続行を判定対象から除外する。
// 例: 「// Recomputing per request is ~300-500ms on the current working set,」の
// ようなコメント中の記述が誤検知されるのを防ぐ（行頭 // ・行頭 * ・行頭 /* を持つ行、
// および行全体が JSX の {/* ... */} 単一行コメントである行）。
// 全ルール共通で適用する（issue #390: 従来は P047 限定だった）。
function isCommentOnlyLine(line) {
  if (/^\s*(\/\/|\/\*|\*)/.test(line)) return true
  return /^\s*\{\s*\/\*[\s\S]*\*\/\s*\}\s*$/.test(line)
}

// 行内コメントを判定対象から除外する。
// - JSX の単一行コメント {/* ... */}（`<div>{/* TODO */}</div>` のような行中の断片）
// - 通常の /* ... */ ブロックコメント（同一行で閉じているもの）
// - // 以降の行コメント
// を順に取り除く。素朴な実装のため文字列リテラル内の `//` や `/*`（URL 等）も
// 削る可能性はあるが、対象ルールの誤検知回避が優先のため許容する。
function stripLineComment(line) {
  let result = line.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")
  result = result.replace(/\/\*[\s\S]*?\*\//g, "")
  const index = result.indexOf("//")
  return index === -1 ? result : result.slice(0, index)
}

function matchesRuleExclude(rule, file, line) {
  const excludes = Array.isArray(rule.excludes) ? rule.excludes : []
  return excludes.some((exclude) => file.includes(exclude) || line.includes(exclude))
}

function shouldIgnorePath(relPath, options) {
  if (!relPath || relPath === ".") return false
  const parts = relPath.split("/")
  if (parts.some((part) => DEFAULT_IGNORES.includes(part))) return true
  if (DEFAULT_IGNORE_PATHS.some((ignored) => relPath.includes(ignored))) return true
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
