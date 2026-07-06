#!/usr/bin/env node
// =============================================================
// KSK Design System — border 色指定チェック
//
// Tailwind v4 は色を併記しない border（border / border-t / border-2 等）
// が currentColor に落ちる。消費側の濃色テキスト文脈で枠線が意図せず
// 黒ずむ実害があったため、className 内に border-width 系ユーティリティが
// 現れたら、同一 className 文字列内に色指定（border-[var(--...)] /
// border-transparent / border-current 等）が伴っているかを機械チェックする。
//
// 実行: node scripts/check-border-color.mjs
// =============================================================
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, dirname, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const srcDir = join(root, "src")

const tsxFiles = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      walk(p)
      continue
    }
    // .stories.tsx は Storybook 上のデモ専用コードで配布物に含まれないため対象外。
    if (/\.tsx$/.test(name) && !/\.stories\.tsx$/.test(name)) tsxFiles.push(p)
  }
}
walk(srcDir)

const DIRS = ["t", "r", "b", "l", "x", "y"]

// border-width 系（幅・存在を表す）ユーティリティにマッチする語だけを対象にする。
// border-collapse / border-separate / border-none / border-solid / border-dashed
// / border-dotted / border-double / border-hidden はスタイル/レイアウト系なので除外。
const NON_WIDTH_SUFFIXES = new Set([
  "collapse",
  "separate",
  "none",
  "solid",
  "dashed",
  "dotted",
  "double",
  "hidden",
])

// 1トークン（空白区切り）が border-width 系ユーティリティかどうか判定する。
// variant プレフィックス（disabled: / hover: / dark: / md: 等）は取り除いた上で判定。
// border-*-0（幅ゼロ）は見えない枠線なので色指定不要 = 対象外とする。
function classifyToken(token) {
  const stripped = token.replace(/^([\w-]+:)+/, "")
  const m = stripped.match(/^border(-([trblxy]))?(-(\d+))?$/)
  if (!m) return null
  const widthNum = m[4]
  if (widthNum !== undefined && Number(widthNum) === 0) return null
  return { dir: m[2] ?? null, hasWidthNum: Boolean(m[4]) }
}

// トークンが「色指定」かどうか判定する。
// border-[var(--...)] のほか、border-[#hex] / border-[rgb(...)] / border-[rgba(...)] /
// border-[hsl(...)] のような任意の任意色指定も色指定として認める
// （このプロジェクトの規約では生値は別途 lint 対象だが、本チェックの目的は
// 「色指定が一切ない」ケースの検出であり、生値の是非は別チェックの責務）。
function isColorToken(token) {
  const stripped = token.replace(/^([\w-]+:)+/, "")
  if (/^border(-[trblxy])?-\[.+\](\/\d+)?$/.test(stripped)) return true
  if (/^border(-[trblxy])?-transparent$/.test(stripped)) return true
  if (/^border(-[trblxy])?-current$/.test(stripped)) return true
  return false
}

// 誤検出除外: border-collapse 等の非 width 系は classifyToken 内で弾く
// （suffix が数値でも方向でもない場合は null になる = 対象外）。
// ただし "border-none" 等の語も上の正規表現では拾われないので明示チェック不要。

const hits = []

for (const file of tsxFiles) {
  const text = readFileSync(file, "utf8")
  const lines = text.split("\n")

  // ファイル単位の免除: サイズ用オブジェクトと色用 cn() を意図的に分割し、
  // 呼び出し側で必ず合成されることがコメントで明示されている場合に使う
  // （例: spinner.tsx の sizeClasses）。粒度は粗いが誤検出回避を優先する。
  if (text.includes("check-border-color-ignore-file")) continue

  // 文字列/テンプレートリテラルらしき塊を抜き出す簡易パーサ。
  // className / cn(...) / cva(...) の判定はせず、"..." '...' `...` の
  // リテラル内を一律にトークン走査する（誤検出よりも見逃し防止を優先）。
  const literalRe = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`/g
  let m
  while ((m = literalRe.exec(text)) !== null) {
    const literal = m[0]
    const inner = literal.slice(1, -1)
    if (!/\bborder(-|\b)/.test(inner)) continue

    const tokens = inner.split(/\s+/).filter(Boolean)
    const hasBorderWidthToken = tokens.some((t) => {
      const c = classifyToken(t)
      return c !== null
    })
    if (!hasBorderWidthToken) continue

    const hasColor = tokens.some((t) => isColorToken(t))
    if (hasColor) continue

    // NON_WIDTH_SUFFIXES を含む語（border-none 等）しか border-width 系トークンが
    // 無ければ誤検出なので、classifyToken が拾った語のうち非スタイル語だけを対象に
    // 再確認する（classifyToken は border-none 等にはそもそもマッチしないため
    // ここでの再チェックは保険）。
    const widthTokens = tokens.filter((t) => {
      const stripped = t.replace(/^([\w-]+:)+/, "")
      const suffix = stripped.replace(/^border-?/, "")
      return classifyToken(t) !== null && !NON_WIDTH_SUFFIXES.has(suffix)
    })
    if (widthTokens.length === 0) continue

    const upto = text.slice(0, m.index)
    const line = upto.split("\n").length


    hits.push({
      file: relative(root, file),
      line,
      tokens: widthTokens.join(", "),
      snippet: lines[line - 1]?.trim().slice(0, 160),
    })
  }
}

if (hits.length > 0) {
  console.error(
    "✗ 色指定のない border ユーティリティが見つかりました（Tailwind v4 は currentColor に落ちます）:",
  )
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line} — [${h.tokens}]`)
    if (h.snippet) console.error(`    ${h.snippet}`)
  }
  console.error(
    "\n  修正: border-[var(--Border-Low-Emphasis)] / border-[var(--Border-Medium-Emphasis)] /" +
      "\n  border-transparent など、同一 className 内に色指定を併記してください。詳細は CLAUDE.md 実装前セルフチェック。",
  )
  process.exit(1)
}

console.log(`✓ border 色指定 OK（${tsxFiles.length} .tsx ファイル走査）`)
