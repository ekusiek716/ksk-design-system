#!/usr/bin/env node
/**
 * PR の差分が「見た目に効く変更」を含むかを判定する（.github/workflows/visual-review-label.yml が呼ぶ）。
 *
 * 由来: VRT（test/visual）は 1px の枠線の色変更や focus ring・影の微差を取りこぼすことがある。
 * 緑の CI をすり抜けた見た目の変更に、レビュアーの目視確認を促すための目印を付ける。
 *
 * ── 判定の対象 ──
 *   border      … 枠線（border / divide、--Border-*、tokens.json の semantic.border）
 *   focus-ring  … focus ring・outline（ring / outline、--Focus-*、tokens.json の semantic.focus）
 *   shadow      … 影（shadow、--Shadow-*、tokens.json の shadows / elevation）
 *   color       … 色トークン（--Text- / --Surface- / --Object- / --Brand- / --Primitive- 等、tokens.json の colors / themes）
 *   radius      … 角丸（rounded、--Radius-*、tokens.json の borderRadius）
 *   spacing     … 余白（p / m / gap / space の数値ユーティリティ、--Space-*、tokens.json の spacing）
 *
 * ── 判定方法 ──
 *   tokens.json … 親キーが差分の行に出るとは限らない（値だけが変わる）ので、行マッチではなく
 *                 葉をフラット化して構造比較し、変わったパスをカテゴリに分類する。
 *   src の差分  … `git diff -U0` の追加/削除行をカテゴリごとの正規表現で判定する。
 *                 コメントだけの行・stories・テストは対象外。
 *
 * 副作用（ラベル付与・コメント投稿）はここでは行わない。呼び出し側の workflow の責務にして、
 * 判定ロジック単体をテストできるようにしている。
 *
 * 使い方:
 *   node scripts/detect-visual-changes.mjs <base-sha> <head-sha> [--json out.json] [--markdown out.md]
 * 標準出力は "true" / "false" の1行。GITHUB_OUTPUT があれば hit=<true|false> も書き出す。
 */
import { appendFileSync, writeFileSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

/** カテゴリの定義順 = レポートの表示順 */
export const CATEGORIES = {
  border: "枠線",
  "focus-ring": "フォーカスリング / outline",
  shadow: "影",
  color: "色トークン",
  radius: "角丸",
  spacing: "余白",
}

/** コメントの一意マーカー（二重投稿せず更新するための目印） */
export const COMMENT_MARKER = "<!-- needs-visual-review -->"

/** 1カテゴリあたりコメントに載せる最大件数 */
const MAX_PER_CATEGORY = 5

// Tailwind のクラス名に使える文字（任意値 [..] や分数 / を含む）
const CLS = String.raw`[\w\[\]#%./:()-]`

/** 語の終わり（bordered / shadowRoot / ringBuffer のように続く別語を拾わない） */
const B = String.raw`(?![\w])`

/** CSS 変数の「定義行」（`--Foo-Bar: ...`）。参照 `var(--Foo-` だけでは定義の値変更を拾えない */
const def = (prefix) => String.raw`--(?:${prefix})[\w-]*\s*:`

/**
 * 行のカテゴリ判定。先頭の (?<![\w-]) で別語の一部（string の "ring" 等）を拾わない。
 * 右端の語境界 B は、単語そのものを指す選択肢にだけ付ける（`p-[10px]` のような値込みの選択肢には付けない）。
 * radius は "border-radius" / "borderRadius" を border と誤認しない（border 側は語境界で弾かれる）。
 */
const word = (alts) => new RegExp(String.raw`(?<![\w-])(?:${alts.join("|")})`)
const LINE_PATTERNS = {
  border: word([
    String.raw`(?:border|divide)(?!-radius)(?:-(?!radius)${CLS}+)?${B}`,
    String.raw`border(?:Top|Bottom|Left|Right|Start|End)?(?:Color|Width)${B}`,
    String.raw`var\(--Border-`,
    def("Border-"),
  ]),
  "focus-ring": word([
    String.raw`ring(?:-${CLS}+)?${B}`,
    String.raw`outline(?:-${CLS}+)?${B}`,
    String.raw`outline(?:Color|Width|Offset|Style)${B}`,
    String.raw`var\(--Focus-`,
    def("Focus-"),
  ]),
  shadow: word([
    String.raw`(?:drop-)?shadow(?:-${CLS}+)?${B}`,
    String.raw`boxShadow${B}|box-shadow${B}|shadow(?:Color|Offset|Opacity|Radius)${B}`,
    String.raw`var\(--[Ss]hadow-`,
    def("[Ss]hadow-"),
  ]),
  color: word([
    String.raw`var\(--(?:Text|Surface|Object|Brand|Primitive|Hover|Active|Overlay|Caution|Success|Warning|Info|Categorical)-`,
    def("Text-|Surface-|Object-|Brand-|Primitive-|Hover-|Active-|Overlay-|Caution-|Success-|Warning-|Info-|Categorical-"),
  ]),
  radius: word([
    String.raw`rounded(?:-${CLS}+)?${B}`,
    String.raw`borderRadius${B}|border(?:Top|Bottom)(?:Left|Right|Start|End)Radius${B}`,
    String.raw`border-radius${B}|border-(?:t|b|l|r|s|e|tl|tr|bl|br)-radius${B}|border-(?:top|bottom)-(?:left|right)-radius${B}`,
    String.raw`var\(--Radius-`,
    def("Radius-"),
  ]),
  spacing: word([
    // Tailwind の数値・任意値ユーティリティ（p-4 / gap-x-2 / p-[10px] / -mt-px）
    String.raw`-?(?:p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y)-(?:\d|\[|px${B})`,
    // RN の StyleSheet / CSS の数値指定（paddingHorizontal: 16 / margin-top: 8px / gap: 12）
    String.raw`(?:padding|margin)(?:Top|Bottom|Left|Right|Horizontal|Vertical|Start|End|Inline|Block)?\s*:\s*-?\d`,
    String.raw`(?:padding|margin)-(?:top|bottom|left|right|inline|block)(?:-(?:start|end))?\s*:\s*-?\d`,
    String.raw`(?:gap|rowGap|columnGap|row-gap|column-gap)\s*:\s*\d`,
    String.raw`var\(--(?:Space-|Product-Card-Padding)`,
    def("Space-|Product-Card-Padding"),
  ]),
}

/**
 * コメントだけの行は判定から外す。
 *   - 行コメント・ブロックコメントの開始行、ブロックコメント内の ` * 説明` 行、JSX の波括弧で囲んだ1行コメント。
 *   - `*` で始まるだけの行は CSS のセレクタ（`*, ::before {`）の可能性があるのでコメント扱いにしない。
 */
export function isCommentOnly(text) {
  const t = text.trim()
  if (t === "" || t.startsWith("//") || t.startsWith("/*")) return true
  if (/^\{\s*\/\*.*\*\/\s*\}$/.test(t)) return true
  if (t === "*" || t === "*/") return true
  return t.startsWith("*") && !/^\*\s*[,{:>+~[.]/.test(t)
}

/**
 * TSX の variant 名（`outline: "..."` のキー、`variant="outline"` の値）はクラスではないので、
 * 判定の前に取り除く（CSS ファイルでは `outline: 2px` は本物なので除かない）。
 */
export function stripNonStyleTokens(text, file) {
  if (/\.css$/.test(file)) return text
  return text
    .replace(/\bvariant\w*\s*[=:]\s*["'`][\w-]+["'`]/g, " ")
    .replace(/(?<![\w:-])[A-Za-z][\w-]*\s*:\s+(?=["'`{[])/g, " ")
}

/** 判定対象のファイルか。stories・テスト・型定義は見た目の実装ではない */
export function isScannedFile(file) {
  if (!/^src\/.+\.(tsx?|css)$/.test(file)) return false
  if (/\.(stories|test|spec)\.[tj]sx?$/.test(file)) return false
  if (/\.d\.ts$/.test(file)) return false
  if (file.startsWith("src/stories/") || file.startsWith("src/prototypes/")) return false
  return true
}

/**
 * `git diff -U0` の出力を解析し、見た目に効く追加/削除行を返す。
 * 削除されたファイルは `--- a/` 側のパスで判定する。
 * @returns {{category: string, file: string, line: number|null, sign: "+"|"-", text: string}[]}
 */
export function scanDiffLines(diffText) {
  const hits = []
  let file = null
  let oldFile = null
  let scanned = false
  let newLine = null
  for (const raw of diffText.split("\n")) {
    if (raw.startsWith("--- ")) {
      const m = raw.match(/^--- a\/(.+)$/)
      oldFile = m ? m[1] : null
      continue
    }
    if (raw.startsWith("+++ ")) {
      const m = raw.match(/^\+\+\+ b\/(.+)$/)
      file = m ? m[1] : oldFile // 削除（+++ /dev/null）は旧パスを使う
      scanned = file !== null && isScannedFile(file)
      continue
    }
    if (raw.startsWith("diff ") || raw.startsWith("index ")) continue
    const hunk = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)/)
    if (hunk) {
      newLine = Number(hunk[1])
      continue
    }
    if (!scanned) continue
    const sign = raw[0]
    if (sign !== "+" && sign !== "-") continue
    const text = raw.slice(1)
    if (isCommentOnly(text)) {
      if (sign === "+") newLine += 1
      continue
    }
    const target = stripNonStyleTokens(text, file)
    for (const [category, re] of Object.entries(LINE_PATTERNS)) {
      if (re.test(target)) {
        hits.push({ category, file, line: sign === "+" ? newLine : null, sign, text: text.trim() })
      }
    }
    if (sign === "+") newLine += 1
  }
  return hits
}

/** オブジェクトの葉を {"a.b.c": value} にフラット化する（_doc / meta は無視） */
function flatten(obj, prefix = [], out = {}) {
  if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      if (k === "_doc" || (prefix.length === 0 && k === "meta")) continue
      flatten(v, [...prefix, k], out)
    }
  } else {
    out[prefix.join(".")] = JSON.stringify(obj)
  }
  return out
}

/** tokens.json のパスをカテゴリに分類する。見た目に関係しないパスは null */
export function classifyTokenPath(path) {
  const seg = path.split(".")
  const [top] = seg
  if (top === "shadows" || top === "elevation") return "shadow"
  if (top === "borderRadius" || top === "borderRadiusNative") return "radius"
  if (top === "spacing") return "spacing"
  if (top === "colors") {
    // colors.semantic.border / colors.semanticDark.border は枠線、.focus はフォーカスリング
    if (seg[1] === "semantic" || seg[1] === "semanticDark") {
      if (seg[2] === "border") return "border"
      if (seg[2] === "focus") return "focus-ring"
    }
    return "color"
  }
  if (top === "themes") return "color"
  return null
}

/**
 * tokens.json の before/after を構造比較し、変わった葉のパスをカテゴリ付きで返す。
 * @returns {{category: string, path: string}[]}
 */
export function diffTokens(before, after) {
  const a = flatten(before)
  const b = flatten(after)
  const paths = new Set([...Object.keys(a), ...Object.keys(b)])
  const hits = []
  for (const path of [...paths].sort()) {
    if (a[path] === b[path]) continue
    const category = classifyTokenPath(path)
    if (category) hits.push({ category, path })
  }
  return hits
}

/** トークンとスタイル行の判定結果を1つのレポートにまとめる */
export function buildReport({ tokenHits, lineHits }) {
  const byCategory = {}
  for (const c of Object.keys(CATEGORIES)) byCategory[c] = { tokens: [], lines: [] }
  for (const h of tokenHits) byCategory[h.category].tokens.push(h.path)
  for (const h of lineHits) byCategory[h.category].lines.push(h)
  const categories = Object.keys(CATEGORIES).filter(
    (c) => byCategory[c].tokens.length > 0 || byCategory[c].lines.length > 0,
  )
  return { hit: categories.length > 0, categories, byCategory }
}

/** PR コメント本文（Markdown）。何がどこで変わったかを載せる */
export function renderMarkdown(report) {
  const out = [COMMENT_MARKER]
  if (!report.hit) {
    out.push("見た目に関わる変更（枠線・フォーカスリング・影・色・角丸・余白）は検出されませんでした。`needs-visual-review` ラベルは外しています。")
    return out.join("\n") + "\n"
  }
  out.push(
    "この PR は **見た目に関わる変更** を含みます。VRT は 1px の枠線の色や影の微差を取りこぼすことがあるため、Storybook で該当の部品を目視確認してください。",
    "",
  )
  for (const c of report.categories) {
    const { tokens, lines } = report.byCategory[c]
    out.push(`### ${CATEGORIES[c]}`)
    for (const path of tokens.slice(0, MAX_PER_CATEGORY)) out.push(`- \`tokens.json\`: \`${path}\``)
    if (tokens.length > MAX_PER_CATEGORY) out.push(`- ほか tokens.json の ${tokens.length - MAX_PER_CATEGORY} 件`)
    // 同じファイルの追加行と削除行が並ぶので、追加行（行番号が分かる側）を優先して載せる
    const shown = [...lines].sort((x, y) => (x.sign === y.sign ? 0 : x.sign === "+" ? -1 : 1))
    const seen = new Set()
    let count = 0
    for (const l of shown) {
      const key = `${l.file}:${l.line ?? "-"}:${l.text}`
      if (seen.has(key)) continue
      seen.add(key)
      if (count >= MAX_PER_CATEGORY) break
      count += 1
      const where = l.line ? `${l.file}:${l.line}` : l.file
      out.push(`- \`${where}\` ${l.sign === "+" ? "追加" : "削除"}: \`${l.text.slice(0, 100).replace(/`/g, "'")}\``)
    }
    if (lines.length > count) out.push(`- ほか ${lines.length - count} 行`)
    out.push("")
  }
  return out.join("\n")
}

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
}

function gitShowJson(rev) {
  try {
    return JSON.parse(git(["show", `${rev}:tokens.json`]))
  } catch {
    return {}
  }
}

function main(argv) {
  const args = argv.slice(2)
  const positional = []
  const opts = {}
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--json" || args[i] === "--markdown") opts[args[i].slice(2)] = args[++i]
    else positional.push(args[i])
  }
  if (positional.length !== 2) {
    console.error("usage: detect-visual-changes.mjs <base-sha> <head-sha> [--json out.json] [--markdown out.md]")
    process.exit(2)
  }
  const [base, head] = positional
  // 三点 diff: base と head の共通祖先からの差分（PR 自身の変更だけ）
  const diffText = git(["diff", "-U0", "--no-color", `${base}...${head}`, "--", "src"])
  const tokensChanged = git(["diff", "--name-only", `${base}...${head}`, "--", "tokens.json"]).trim() !== ""
  // 比較起点は三点 diff と同じ merge-base にそろえる（base が先に進んでいても PR 自身の変更だけを見る）
  const mergeBase = git(["merge-base", base, head]).trim() || base
  const tokenHits = tokensChanged ? diffTokens(gitShowJson(mergeBase), gitShowJson(head)) : []
  const report = buildReport({ tokenHits, lineHits: scanDiffLines(diffText) })
  if (opts.json) writeFileSync(opts.json, JSON.stringify(report, null, 2))
  if (opts.markdown) writeFileSync(opts.markdown, renderMarkdown(report))
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `hit=${report.hit}\n`)
  process.stdout.write(`${report.hit}\n`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv)
