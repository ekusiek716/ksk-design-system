#!/usr/bin/env node
// =============================================================
// KSK Design System — 未定義 CSS 変数の参照検査
//
// src/ 配下の CSS / TS / TSX が参照する CSS 変数（`var(--X)`、Tailwind v4 の
// `bg-(--X)`）が、どこかで定義されているかを機械チェックする。
//
// 背景: Tailwind の任意値 `bg-[var(--Border-Mediun-Emphasis)]` のようなタイプミスは
// ビルドも型検査も通り、ブラウザ上で「その宣言が黙って無効になる」だけで気付けない。
// check-docs-drift.mjs は Markdown 内の記述を照合するだけで、実コードの参照は
// 見ていない（重複ではなく補完の関係）。
//
// 定義元（いずれかにあれば定義済み）:
//   - src/**/*.css の宣言（`--X:`）。src/styles / src/themes / preset*.css を含む
//   - TS/TSX 内の宣言: style={{ "--X": v }} / setProperty("--X") / Tailwind 任意プロパティ `[--X:v]`
//     （コンポーネントが自分で定義して自分で参照する局所変数）
//   - tokens.json（semantic / primitive / brand / shadows から組み立てる名前）
//
// 変数名をテンプレートリテラルで組み立てている箇所（`--Border-${tone}`）は名前が確定しないため対象外。
//
// 定義元が見つからない変数は ALLOWLIST に理由付きで載せる。載っていない未定義参照はエラー、
// 参照が無くなった許可リスト項目もエラー（棚卸しを促す）。
// .stories.tsx / テストはデモ・検証用で配布物に含まれないため対象外。
//
// 実行: node scripts/check-css-vars.mjs [ルートディレクトリ]
// 例外追加: 下の ALLOWLIST に { name | prefix, reason } を足す。理由は必須。
// =============================================================
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { stripComments } from "./lib/strip-comments.mjs"

// 第 1 引数でルートを差し替えられる（テストが一時ディレクトリの src/ を検査するため）
const ROOT = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "..")
const SRC = join(ROOT, "src")

/**
 * 定義元がリポジトリ内に無い（実行時に注入される / フォールバック前提の）変数。
 * name / names は完全一致、prefix は前方一致（実行時注入で名前が列挙できないものだけ）。reason は必須。
 */
export const ALLOWLIST = [
  {
    names: [
      "--radix-dropdown-menu-content-available-height",
      "--radix-dropdown-menu-content-available-width",
      "--radix-dropdown-menu-content-transform-origin",
      "--radix-hover-card-content-transform-origin",
      "--radix-popover-content-available-width",
      "--radix-popover-trigger-width",
      "--radix-select-content-available-width",
      "--radix-select-trigger-height",
      "--radix-select-trigger-width",
    ],
    reason: "Radix UI が Popper / Select / Dropdown 等のコンテンツ要素へ実行時に注入する変数。DS 側に定義は無い。前方一致にするとタイプミスが素通りするので完全一致で列挙する",
  },
  {
    name: "--kb-h",
    reason: "消費側アプリが visualViewport 等から書き込む「キーボードが覆っている高さ」。sheet-keyboard.css は var(--kb-h, 0px) で未設定でも無害（#487）",
  },
  {
    name: "--glass-hl-x",
    reason: "pointer 追従スペキュラのハイライト中心。消費側が JS で setProperty する任意フック。未設定は 25% のフォールバック（glass.css）",
  },
  {
    name: "--glass-hl-y",
    reason: "--glass-hl-x と対。未設定は -20% のフォールバック（glass.css）",
  },
  {
    name: "--font-display-serif",
    reason: "消費側が差し替えられるディスプレイ用セリフ体。countdown-hero.tsx が Georgia 等のフォールバック付きで参照する任意フック",
  },
  {
    names: [
      "--Nav-Pill-Surface",
      "--Nav-Pill-Backdrop",
      "--Nav-Pill-Border",
      "--Nav-Pill-Shadow",
      "--Nav-Pill-Specular",
      "--Nav-Selected-Surface",
      "--Nav-Selected-Shadow",
      "--Nav-Center-Action-Surface",
      "--Nav-Center-Action-Border",
      "--Nav-Center-Action-Shadow",
    ],
    reason: "BottomTabBar の面の公開カスタマイズ契約（issue #471）。bottom-nav.css は var(--Nav-*, <DS 既定>) の形で、消費側が宣言したときだけ上書きされるよう既定値を :root に置かない。寸法の --Nav-* は product-theme.css で定義済み",
  },
]

// ---------- ファイル収集 ----------
const SKIP_FILE = /\.(stories|test|spec)\.(ts|tsx)$/
// source-safelist.css は他ファイルのクラスを写した自動生成物（`--Categorical-N` のような
// プレースホルダを含む）。写し元を検査すれば足りるので対象外。
const SKIP_GENERATED = new Set([join(SRC, "styles", "source-safelist.css")])
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(css|ts|tsx)$/.test(name) && !SKIP_FILE.test(name) && !name.endsWith(".d.ts") && !SKIP_GENERATED.has(p)) out.push(p)
  }
  return out
}

/** CSS のコメントを、行番号を保ったまま空白に潰す。 */
function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
}

function lineOf(text, index) {
  let line = 1
  for (let i = 0; i < index; i += 1) if (text.charCodeAt(i) === 10) line += 1
  return line
}

// ---------- 定義の収集 ----------
const NAME = "--[A-Za-z][A-Za-z0-9_-]*"
// CSS 宣言: ブロック先頭・`;`・`{` の直後に `--X:`
const CSS_DECL_RE = new RegExp(`(?:^|[{;])\\s*(${NAME})\\s*:`, "gm")
// TS/TSX の宣言: オブジェクトキー "--X": / '--X': / `--X`: 、setProperty("--X")、Tailwind 任意プロパティ [--X:v]
const TS_DECL_RES = [
  new RegExp(`["'\`](${NAME})["'\`]\\s*:`, "g"),
  new RegExp(`setProperty\\(\\s*["'\`](${NAME})["'\`]`, "g"),
  new RegExp(`\\[(${NAME}):`, "g"),
  // 名前を定数に束ねて style に渡す書き方（const X_VAR = "--Y"）
  new RegExp(`=\\s*["'\`](${NAME})["'\`]`, "g"),
]

function collectTokensJsonVars(defined) {
  const file = join(ROOT, "tokens.json")
  if (!existsSync(file)) return
  const t = JSON.parse(readFileSync(file, "utf8"))
  const pd = (k) => k.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("-")
  for (const [fam, val] of Object.entries(t.colors?.primitive ?? {})) {
    if (typeof val === "string") defined.add(`--Primitive-${pd(fam)}`)
    else for (const shade of Object.keys(val)) defined.add(`--Primitive-${pd(fam)}-${shade}`)
  }
  for (const shade of Object.keys(t.colors?.brand ?? {})) defined.add(`--Primitive-Brand-${shade}`)
  for (const sem of [t.colors?.semantic, t.colors?.semanticDark]) {
    if (!sem) continue
    for (const [cat, roles] of Object.entries(sem)) {
      if (cat.startsWith("_") || typeof roles !== "object" || roles == null) continue
      for (const role of Object.keys(roles)) if (!role.startsWith("_")) defined.add(`--${pd(cat)}-${pd(role)}`)
    }
  }
  for (const k of Object.keys(t.shadows ?? {})) if (!k.startsWith("_")) defined.add(`--shadow-${k}`)
}

// ---------- 参照の収集 ----------
// var(--X) / var(--X, fallback)。Tailwind v4 の括弧記法 `bg-(--X)` / `bg-(color:--X)` も拾う。
const VAR_REF_RE = new RegExp(`var\\(\\s*(${NAME})\\s*(,)?`, "g")
// 直前が `-` のときだけ（`bg-(--X)`）。`var(--X)` の `r(--X)` や `Math.max(--n)` には当てない
const TW_PAREN_REF_RE = new RegExp(`-\\((?:[a-z-]+:)?(${NAME})\\)`, "g")

export function scan() {
  const files = walk(SRC)
  const defined = new Set()
  collectTokensJsonVars(defined)

  const sources = files.map((file) => {
    const raw = readFileSync(file, "utf8")
    const text = file.endsWith(".css") ? stripCssComments(raw) : stripComments(raw)
    return { file, text, isCss: file.endsWith(".css") }
  })

  for (const { text, isCss } of sources) {
    if (isCss) for (const m of text.matchAll(CSS_DECL_RE)) defined.add(m[1])
    else for (const re of TS_DECL_RES) for (const m of text.matchAll(re)) defined.add(m[1])
  }

  /** @type {Map<string, {file: string, line: number, hasFallback: boolean}[]>} */
  const undefinedRefs = new Map()
  for (const { file, text } of sources) {
    for (const [re, fallbackGroup] of [[VAR_REF_RE, true], [TW_PAREN_REF_RE, false]]) {
      for (const m of text.matchAll(re)) {
        const name = m[1]
        // `var(--Border-${tone})` のような動的合成は末尾が `-` で切れる。名前が確定しないので検査できない
        if (name.endsWith("-")) continue
        // `--Typo-H${x}-Emph` のように名前の途中にテンプレート式がある場合も同様
        const end = (m.index ?? 0) + m[0].indexOf(name) + name.length
        if (text.startsWith("${", end)) continue
        if (defined.has(name)) continue
        const list = undefinedRefs.get(name) ?? []
        list.push({ file: relative(ROOT, file), line: lineOf(text, m.index ?? 0), hasFallback: fallbackGroup && m[2] === "," })
        undefinedRefs.set(name, list)
      }
    }
  }
  return { defined, undefinedRefs }
}

function allowed(name) {
  return ALLOWLIST.find((e) =>
    "prefix" in e ? name.startsWith(e.prefix) : "names" in e ? e.names.includes(name) : e.name === name,
  )
}

// ---------- 実行 ----------
const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const NC = "\x1b[0m"

const isMain = process.argv[1] && join(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  for (const e of ALLOWLIST) {
    if (!e.reason || e.reason.trim().length === 0) {
      console.error(`${RED}✗ ALLOWLIST の項目に reason がありません: ${JSON.stringify(e)}${NC}`)
      process.exit(1)
    }
  }

  const { defined, undefinedRefs } = scan()
  const errors = []
  const usedEntries = new Set()
  for (const [name, refs] of [...undefinedRefs].sort(([a], [b]) => a.localeCompare(b))) {
    const entry = allowed(name)
    if (entry) {
      usedEntries.add(entry)
      continue
    }
    for (const r of refs) {
      errors.push(`${r.file}:${r.line}: 未定義の CSS 変数 ${name}${r.hasFallback ? "（フォールバック付き）" : ""}`)
    }
  }
  // 許可リストの棚卸しは実リポジトリを対象にするときだけ（テスト用の一時ルートでは常に未使用になる）
  const stale = process.argv[2] === undefined ? ALLOWLIST.filter((e) => !usedEntries.has(e)) : []

  if (errors.length === 0 && stale.length === 0) {
    console.log(`${GREEN}✓ CSS 変数参照チェック OK（定義 ${defined.size} 件 / 許可リスト ${ALLOWLIST.length} 件）${NC}`)
    process.exit(0)
  }
  for (const e of errors) console.error(`${RED}✗ ${e}${NC}`)
  for (const e of stale) {
    const label = "prefix" in e ? `${e.prefix}*` : "names" in e ? e.names.join(", ") : e.name
    console.error(`${RED}✗ 許可リストの ${label} はもう参照されていません。項目を削除してください${NC}`)
  }
  if (errors.length > 0) {
    console.error("")
    console.error("  タイプミスなら変数名を直す。実行時に注入される変数・意図的なフォールバック前提なら")
    console.error("  scripts/check-css-vars.mjs の ALLOWLIST に理由付きで追加する。")
  }
  process.exit(1)
}
