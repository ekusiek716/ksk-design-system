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

/** appliesTo に書けるプラットフォーム識別子（後方互換のため引き続き解釈する） */
export const PLATFORMS = ["web", "native"]

/**
 * appliesTo に書ける capability（能力）タグ。プラットフォーム二値ではなく
 * 「そのファイルがどの記法を持ちうるか」で表す（issue #391 のレビュー指摘）。
 *
 * - `dom`      … 小文字の HTML 生タグ・href/type 等の DOM 属性が書ける
 * - `tailwind` … className に Tailwind クラスを書く（web / NativeWind の RN）
 * - `web`      … CSS 変数・CSS 単位が効く純 web
 * - `native`   … React Native のファイル
 *
 * これ以外の文字列はファイル名グロブとして解釈する（既存の `["*.css"]`）。
 */
export const CAPABILITIES = ["dom", "tailwind", "web", "native"]

/**
 * React Native のファイルであることを示すシグナル（issue #391）。
 *
 * import / require の**構文形**に絞っている。以前は `\bfrom\s*["']react-native["']`
 * だけで見ていたため、文字列リテラルの中に import 文の見本を持つファイル
 * （ドキュメント生成・コードテンプレート）が native 判定になっていた。
 *
 * 防御の役割分担（レビュー再現ケース）:
 * - 通常クォート（' "）の文字列は**単一行**なので、行頭アンカー `^\s*(?:import|export)`
 *   が防ぐ。`const s = "import { View } from 'react-native'"` は行頭が const なので
 *   マッチしない。ここは温存する必要がある — import 指定子そのものが
 *   `from "react-native"` という通常クォートだから。
 * - 唯一の穴は**複数行を跨げるテンプレートリテラル**で、
 *   `export const snippet = \`\nimport { View } from "react-native"\n\`` のように
 *   行頭から始まる行を内側に持てる。これは maskTemplateLiterals() で潰す。
 */
const NATIVE_SOURCE_SIGNALS = [
  // import / export ... from "react-native"（複数行 import も [^;] が改行を跨ぐ）
  /^\s*(?:import|export)\b[^;]*\bfrom\s*["']react-native(?:\/[^"']*)?["']/m,
  // 副作用 import: import "react-native"
  /^\s*import\s*["']react-native(?:\/[^"']*)?["']/m,
  /\brequire\(\s*["']react-native(?:\/[^"']*)?["']\s*\)/,
  // DS の native エントリ
  /^\s*(?:import|export)\b[^;]*\bfrom\s*["']ksk-design-system\/native(?:\/[^"']*)?["']/m,
  /\brequire\(\s*["']ksk-design-system\/native(?:\/[^"']*)?["']\s*\)/,
  // RN のスタイル定義。import 経由でなくても RN 判定に足る
  /\bStyleSheet\s*\.\s*create\s*\(/,
]

/** `Foo.native.tsx` のようなプラットフォーム別サフィックス */
const NATIVE_FILENAME_RE = /\.native\.[cm]?[jt]sx?$/

/** .css ファイルの capability。CSS は純 web にしか存在しない */
const CSS_CAPABILITIES = new Set(["dom", "tailwind", "web"])

/**
 * NativeWind（RN で className に Tailwind クラスを書く）の使用シグナル。
 * exam-kit 系 11 アプリはこれを使っており、RN だからと Tailwind 系ルールを
 * 一律に外すと lint がほぼ無効化される（ap-app で 858 件 → 66 件）。
 *
 * 判定は**文字列を全部マスクしたソース**に対して行う。JSX 属性の className= は
 * 文字列の外側にあるので実 NativeWind は検出でき、
 * `<WebView source={{ html: '<div className="legend-item">' }} />` のように
 * 文字列の中に HTML を持つ StyleSheet ファイルは tailwind 扱いにならない
 * （これを取りこぼすと P032 の 76 件誤検知が復活する）。
 */
const CLASSNAME_RE = /\bclassName\s*=/

/**
 * ファイル 1 つのプラットフォームを判定する（issue #391）。
 *
 * 優先順位は CLI の `--platform` > ファイル名サフィックス > ソース内シグナル。
 * どのシグナルも無ければ従来どおり web 扱いにフォールバックする。
 * コメント・テンプレートリテラルのマスクは内部で行うので、生ソースを渡してよい。
 *
 * @param {string} filePath 判定対象のパス（相対・絶対どちらでもよい）
 * @param {string} source   ソース本文（生でよい）
 * @param {"web"|"native"|null|undefined} override CLI の --platform
 * @returns {"web"|"native"}
 */
export function detectPlatform(filePath, source = "", override = null) {
  if (override === "native" || override === "web") return override
  if (NATIVE_FILENAME_RE.test(normalize(filePath))) return "native"
  // 通常クォートは残す（import 指定子の "react-native" を読む必要があるため）。
  // 詳細は NATIVE_SOURCE_SIGNALS のコメントを参照。
  const scanned = maskTemplateLiterals(maskComments(source))
  if (NATIVE_SOURCE_SIGNALS.some((signal) => signal.test(scanned))) return "native"
  return "web"
}

/**
 * ファイル 1 つが持つ capability の集合を返す（issue #391 のレビュー指摘）。
 *
 * - web ファイル              → { dom, tailwind, web }
 * - native ＋ className あり  → { native, tailwind }（NativeWind）
 * - native ＋ className なし  → { native }（StyleSheet）
 *
 * `--platform native` を明示しても、Tailwind を持つかどうかはソース側の
 * className 有無で決める。NativeWind の consumer が `--platform native` を
 * 付けた瞬間に Tailwind 系ルールを失う、という事故を避けるため。
 *
 * @returns {Set<string>}
 */
export function detectCapabilities(filePath, source = "", override = null) {
  const platform = detectPlatform(filePath, source, override)
  if (platform === "web") return new Set(["dom", "tailwind", "web"])
  const capabilities = new Set(["native"])
  // className= は文字列の外側（JSX 属性）にあるものだけを数える
  if (CLASSNAME_RE.test(maskStrings(maskComments(source)))) capabilities.add("tailwind")
  return capabilities
}

/**
 * `appliesTo` のエントリ 1 件をファイル名グロブとして照合する。
 * 相対パス全体と basename の両方に当てる（`*.css` が `src/a.css` にも当たるように）。
 */
function matchesGlob(glob, filePath) {
  const pattern = glob
    .split(/(\*\*|\*|\?)/)
    .map((part) => {
      if (part === "**") return ".*"
      if (part === "*") return "[^/]*"
      if (part === "?") return "[^/]"
      return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    })
    .join("")
  let regex
  try {
    regex = new RegExp(`^${pattern}$`)
  } catch {
    return false
  }
  const rel = normalize(filePath)
  return regex.test(rel) || regex.test(rel.split("/").pop() ?? "")
}

/**
 * `appliesTo` のエントリ 1 件を分類する。
 * グロブ形の判定は「`*` を含む」または「`.` を含む」（`*.css` / `theme.css`）。
 */
function classifyAppliesToEntry(entry) {
  if (typeof entry !== "string" || entry.length === 0) return "invalid"
  if (CAPABILITIES.includes(entry)) return "capability"
  if (entry.includes("*") || entry.includes(".")) return "glob"
  return "invalid"
}

/**
 * ルールを当該ファイルに適用してよいかを `appliesTo` で判定する（issue #391）。
 *
 * `appliesTo` 未指定は全ファイル対象（後方互換）。指定がある場合は
 * capability タグとグロブの OR で、どれか 1 つでも一致すれば適用する。
 * 旧語彙の `"web"` / `"native"` も capability 集合に含まれるのでそのまま動く。
 *
 * 未知の値（capability でもグロブでもない = typo）が 1 つでもあれば
 * **全ファイル対象へ倒す（fail-open）**。閉じる側に倒すと、typo したルールが
 * どのファイルにも当たらないまま静かに無効化される（fail-silent-closed）。
 * 警告は loadRules() が実行ごとに 1 回 stderr へ出す。
 */
export function ruleAppliesTo(rule, { capabilities, filePath }) {
  const appliesTo = rule?.appliesTo
  if (!Array.isArray(appliesTo) || appliesTo.length === 0) return true
  if (appliesTo.some((entry) => classifyAppliesToEntry(entry) === "invalid")) return true
  const caps = capabilities instanceof Set ? capabilities : new Set(capabilities ?? [])
  return appliesTo.some((entry) => {
    if (classifyAppliesToEntry(entry) === "capability") return caps.has(entry)
    return matchesGlob(entry, filePath)
  })
}

export async function runLintCli(argv, { cwd = process.cwd(), pkgRoot = resolve(".") } = {}) {
  const options = parseArgs(argv)
  const rulesPath = resolve(pkgRoot, "contracts/rules.json")
  if (!existsSync(rulesPath)) {
    console.error(`contracts/rules.json が見つかりません: ${rulesPath}`)
    return 1
  }

  if (options.platform && !PLATFORMS.includes(options.platform)) {
    console.error(`--platform には ${PLATFORMS.join(" / ")} のいずれかを指定してください: ${options.platform}`)
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
  let platform = null

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--platform") {
      platform = argv[++i] ?? ""
      continue
    }
    if (arg.startsWith("--platform=")) {
      platform = arg.slice("--platform=".length)
      continue
    }
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
  --platform P    web / native を強制（既定はファイルごとに自動判定）
                  自動判定のシグナル: *.native.tsx / react-native import /
                  ksk-design-system/native import / StyleSheet.create

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
    platform,
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

  const rules = [...prohibited, ...aiPatterns].filter(
    (rule) => typeof rule.pattern === "string" && rule.pattern.length > 0,
  )
  warnUnknownAppliesTo(rules)
  return rules
}

/**
 * appliesTo の typo を実行ごとに 1 回 stderr へ報告する（issue #391）。
 * 適用そのものは ruleAppliesTo が fail-open（全ファイル対象）で扱うので、
 * ここは気づかせるためだけの警告。stdout は --format json が使うので汚さない。
 */
function warnUnknownAppliesTo(rules) {
  for (const rule of rules) {
    if (!Array.isArray(rule.appliesTo)) continue
    const unknown = rule.appliesTo.filter((entry) => classifyAppliesToEntry(entry) === "invalid")
    if (unknown.length === 0) continue
    console.error(
      `[ksk-ds lint] ${rule.id ?? "UNKNOWN"}: appliesTo に未知の値があります: ` +
        `${unknown.map((entry) => JSON.stringify(entry)).join(", ")}。` +
        `指定できるのは capability（${CAPABILITIES.join(" / ")}）かグロブ（*.css 等）です。` +
        `このルールは全ファイル対象として扱います`,
    )
  }
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
    // CSS は web のみに存在する（RN に .css は無い）。glob 指定の appliesTo は
    // capability タグを含まないので、この判定でも従来どおり P049 が当たる。
    if (!ruleAppliesTo(rule, { capabilities: CSS_CAPABILITIES, filePath: rel })) continue
    for (const violation of inspectProductThemeOverrides(source, contract)) {
      if (matchesRuleExclude(rule, rel, violation.name)) continue
      findings.push({
        ...toFinding(rule, rel, violation.line, "web"),
        message: `${rule.message ?? "product theme の許可リスト外の変数を上書きしています"}: ${violation.name}`,
      })
    }
  }
  return findings
}

function lintFile(file, cwd, rules, options = {}) {
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
  // capability 判定に必要なマスク（コメント / 文字列 / テンプレート）は
  // detectPlatform・detectCapabilities の内側で行うので、生の source を渡す。
  // 種類ごとにマスク範囲が違うため、ここで作った maskedSource は流用できない。
  const platform = detectPlatform(rel, source, options.platform)
  const capabilities = detectCapabilities(rel, source, options.platform)

  for (const rule of rules) {
    if (!ruleAppliesTo(rule, { capabilities, filePath: rel })) continue
    if (rule.engine === "card-direct-child-spacing") {
      for (const finding of inspectCardChildSpacing(source, file)) {
        const line = lines[finding.line - 1] ?? ""
        if (!matchesRuleExclude(rule, rel, line)) {
          findings.push(toFinding(rule, rel, finding.line, platform))
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
        findings.push(toFinding(rule, rel, lineNumber, platform))
      }
      continue
    }
    for (let index = 0; index < lines.length; index++) {
      const rawLine = lines[index]
      if (matchesRuleExclude(rule, rel, rawLine)) continue
      const maskedLine = maskedLines[index] ?? ""
      if (!regex.test(maskedLine)) continue
      findings.push(toFinding(rule, rel, index + 1, platform))
    }
  }

  return findings
}

function toFinding(rule, file, line, platform = "web") {
  return {
    file,
    line,
    ruleId: rule.id ?? "UNKNOWN",
    severity: rule.severity === "error" ? "error" : "warn",
    category: rule.category ?? "pattern",
    message: rule.message ?? rule.name ?? "DS rule violation",
    // native ファイルには Web 前提の修正提案（var(--...) 等）が実行不能なので、
    // ルールが fixNative を持つならそちらを出す（issue #391）。
    fix: (platform === "native" ? rule.fixNative : null) ?? rule.fix ?? "",
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

/** 文字数と行番号を保ったまま 1 文字を潰す（改行だけは残す） */
function blankChar(ch) {
  return ch === "\n" || ch === "\r" ? ch : " "
}

const ALL_STRING_DELIMITERS = new Set(["'", '"', "`"])
const TEMPLATE_DELIMITER_ONLY = new Set(["`"])

/**
 * 文字列リテラルの**中身**を同じ文字数の空白へ置換したソースを返す（issue #391）。
 * クォート記号そのものは残し、改行もそのまま残すので、文字インデックス・行番号は
 * 元の source と完全に一致する。
 *
 * `delimiters` でどの種類の文字列を潰すかを選べる。どの場合も ' " ` の 3 種すべてを
 * **追跡**する（通常文字列の中のバッククォートをテンプレート開始と誤認しないため）が、
 * 中身を潰すのは `delimiters` に含まれる区切り文字の文字列だけ。
 *
 * 既知の限界（maskComments と同じ簡易スキャナのため）:
 * - テンプレートリテラルの `${ ... }` 式の内側は追跡せず、テンプレートの一部として
 *   丸ごと文字列扱いにする
 * - JS の正規表現リテラル（/foo\/bar/）は専用に解釈しない
 * - JSX テキスト中のアポストロフィ（`<Text>don't</Text>`）は文字列開始として
 *   扱われる。この場合 className= を見落として tailwind capability が付かない側に
 *   倒れる（＝ルールを外す方向で、誤検知を増やす方向ではない）
 */
function maskStrings(source, delimiters = ALL_STRING_DELIMITERS) {
  let result = ""
  let stringChar = null
  const n = source.length
  let i = 0

  while (i < n) {
    const ch = source[i]

    if (stringChar) {
      const shouldBlank = delimiters.has(stringChar)
      // エスケープはペアで読み飛ばす（\" が文字列を閉じないように）
      if (ch === "\\" && i + 1 < n) {
        result += shouldBlank ? blankChar(ch) + blankChar(source[i + 1]) : ch + source[i + 1]
        i += 2
        continue
      }
      if (ch === stringChar) {
        stringChar = null
        result += ch
        i += 1
        continue
      }
      result += shouldBlank ? blankChar(ch) : ch
      i += 1
      continue
    }

    if (ALL_STRING_DELIMITERS.has(ch)) stringChar = ch
    result += ch
    i += 1
  }

  return result
}

/**
 * テンプレートリテラル（バッククォート）の中身だけを潰す。
 * 通常クォートは温存するので `import { View } from "react-native"` は読めるままになる。
 */
function maskTemplateLiterals(source) {
  return maskStrings(source, TEMPLATE_DELIMITER_ONLY)
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
