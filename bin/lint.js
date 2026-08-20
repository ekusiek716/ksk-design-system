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
  // コメント除去はファイル単位で1回だけ計算し、全ルールで使い回す
  // （ルール数 × 行数で毎回スキャンし直すコストを避ける）。
  // マスク後も文字インデックス・行番号は元の source と完全に一致する
  // （改行はそのまま残し、コメント本文だけを同じ文字数の空白に置換するため）。
  const maskedSource = maskComments(source)
  const maskedLines = maskedSource.split(/\r?\n/)

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
      // コメントでマスク済みの source に対して照合する（issue #390 のレビュー指摘:
      // マスクが行単位の分岐にしか無いと、コメント中の <input placeholder> が
      // P026 に、SheetHeader/KebabMenu を説明する一文が P037 に誤検知していた）。
      for (const match of maskedSource.matchAll(regex)) {
        if (match.index == null) continue
        const lineNumber = lineForIndex(maskedSource, match.index)
        // excludes（ksk-ds-allow-* 等）はコメントに書かれることが多いため、
        // 判定は常にマスク前の生の行に対して行う。
        const rawLine = lines[lineNumber - 1] ?? ""
        if (matchesRuleExclude(rule, rel, rawLine)) continue
        findings.push(toFinding(rule, rel, lineNumber))
      }
      continue
    }
    for (let index = 0; index < lines.length; index++) {
      const rawLine = lines[index]
      if (matchesRuleExclude(rule, rel, rawLine)) continue
      const maskedLine = maskedLines[index] ?? ""
      if (!regex.test(maskedLine)) continue
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

// ソース全体を1文字ずつ走査し、コメント本文だけを同じ文字数の空白に
// 置換したソースを返す（改行はそのまま残すので行番号・文字インデックスは
// 元の source と完全に一致する）。対象は // 行コメント、複数行にまたがる
// /* ... */ ブロックコメント、および JSX の単一行コメント {/* ... */}
// （中身が /* ... */ そのものなので同じ分岐で処理される）。
//
// 文字列リテラル（' " `）の内側は絶対にマスクしない。これが issue #390 の
// レビューで実証された根本原因の修正: 従来の stripLineComment は
// `indexOf("//")` で単純に切り落としていたため、
// `<img src="https://cdn.x/a.png" alt="…" />` のような URL を含む行で
// alt 以降ごと消え、alt があるのに P025 が誤検知していた。
//
// 簡易スキャナのため、テンプレートリテラル内の `${ ... }` 式に現れる
// // や /* までは追跡しない（バッククォート文字列の一部として丸ごと
// 文字列扱いにする）。同様に、JS の正規表現リテラル（/foo\/bar/）も
// 専用には解釈しない。DS の対象ファイル（JSX/TSX コンポーネント）では
// どちらも実質的に稀なため、誤検知を減らすという目的に対しては許容する。
function maskComments(source) {
  let result = ""
  let stringChar = null // 現在文字列リテラルの内側なら区切り文字（' " `）、外側なら null
  const n = source.length
  let i = 0

  while (i < n) {
    const ch = source[i]

    if (stringChar) {
      // 文字列の内側: エスケープはペアで読み飛ばし、区切り文字が来たら閉じる
      if (ch === "\\" && i + 1 < n) {
        result += ch + source[i + 1]
        i += 2
        continue
      }
      if (ch === stringChar) stringChar = null
      result += ch
      i += 1
      continue
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      stringChar = ch
      result += ch
      i += 1
      continue
    }

    if (ch === "/" && source[i + 1] === "/") {
      // 行コメント: 改行の直前まで空白に置換する
      while (i < n && source[i] !== "\n" && source[i] !== "\r") {
        result += " "
        i += 1
      }
      continue
    }

    if (ch === "/" && source[i + 1] === "*") {
      // ブロックコメント（複数行対応）。JSX の {/* ... */} も外側の { } は
      // 通常のコードとして残り、中身の /* ... */ だけがここで処理される。
      while (i < n && !(source[i] === "*" && source[i + 1] === "/")) {
        result += source[i] === "\n" || source[i] === "\r" ? source[i] : " "
        i += 1
      }
      if (i < n) {
        result += "  " // 終端の */ も空白化する
        i += 2
      }
      continue
    }

    result += ch
    i += 1
  }

  return result
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
