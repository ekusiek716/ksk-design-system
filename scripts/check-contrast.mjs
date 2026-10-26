#!/usr/bin/env node
// =============================================================
// KSK Design System — コントラスト自動チェック
//
// tokens.json のカラートークンを解決し、主要な「文字 × 背景」ペアが
// WCAG AA を満たすか検査する。CI で a11y 回帰（トークン変更でコントラストが
// 落ちる）を防ぐ。categorical の Bold（文字用）と semantic テキストが対象。
//
// 文字以外（WCAG 1.4.11 Non-text Contrast・3:1）として、入力欄・チェック
// ボックス・ラジオ・スイッチの「枠 / 地」と背景の組も検査する。基準未達で
// 見た目の変更を別判断にしているものは test/known-exceptions.json の contrast
// 区分に期限付きで登録し、ここでは [例外] として通す。登録の無い新しい未達・
// 期限切れ・使われていない登録（直った組や消えた組）は失敗にする。
//
// 実行: node scripts/check-contrast.mjs
// =============================================================
import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { loadDefaultBrandRamp, resolveTokenColor } from "./lib/resolve-token-color.mjs"
import { LEDGER_PATH, loadKnownExceptions, validateSection } from "./lib/known-exceptions.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const tokens = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"))
const prim = tokens.colors.primitive
const sem = tokens.colors.semantic
// デフォルトテーマの Brand ランプの正本は src/styles/primitive.css
const brandRamp = loadDefaultBrandRamp(root)

// `var(--Primitive-Gray-900)` / `var(--Primitive-White)` / 生 hex を hex に解決
function resolve(val) {
  return resolveTokenColor(val, prim, brandRamp)
}

// 半透明の primitive（`var(--Primitive-White-Alpha-300)` 等）を背景 hex に合成した実色。
// 不透明な値はそのまま resolve に回す。
function resolveOver(val, bgHex) {
  const solid = resolve(val)
  if (solid) return solid
  const m = typeof val === "string" && val.match(/^var\(--Primitive-(White|Gray)-Alpha-(\d+)\)$/)
  const rgba = m && prim[`${m[1].toLowerCase()}-alpha`]?.[m[2]]
  const parts = rgba && rgba.match(/rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)/)
  if (!parts || !bgHex) return null
  const alpha = Number(parts[4])
  const bg = [1, 3, 5].map((i) => parseInt(bgHex.slice(i, i + 2), 16))
  return "#" + [1, 2, 3].map((i, k) => Math.round(Number(parts[i]) * alpha + bg[k] * (1 - alpha)).toString(16).padStart(2, "0")).join("")
}

const srgb2lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
function lum(hex) {
  const h = hex.replace("#", "")
  const [r, g, b] = [0, 2, 4].map((i) => srgb2lin(parseInt(h.slice(i, i + 2), 16)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(a, b) {
  const L1 = lum(a), L2 = lum(b), hi = Math.max(L1, L2), lo = Math.min(L1, L2)
  return (hi + 0.05) / (lo + 0.05)
}

function readThemeBrandShade(theme, shade) {
  // default テーマの Brand は Blue ランプ（colors.brand alias の参照先）。
  if (theme === "default") return prim.blue[shade]
  const css = readFileSync(join(root, "src/themes", `${theme}.css`), "utf8")
  const match = css.match(new RegExp(`--Primitive-Brand-${shade}:\\s*(#[0-9A-Fa-f]{6})`))
  return match?.[1] ?? null
}

const surface = resolve(sem.surface.primary)        // 白
const surfaceSecondary = resolve(sem.surface.secondary) // 薄灰
const brand = resolve(sem.brand.primary)

// 検査ペア [文字, 背景, ラベル, 閾値]
const pairs = []
const text = sem.text
pairs.push([resolve(text["high-emphasis"]), surface, "Text-High / Surface-Primary", 4.5])
pairs.push([resolve(text["medium-emphasis"]), surface, "Text-Medium / Surface-Primary", 4.5])
pairs.push([resolve(text["low-emphasis"]), surface, "Text-Low / Surface-Primary", 4.5])
pairs.push([resolve(text["accent-primary"]), surface, "Text-Accent / Surface-Primary", 4.5])
pairs.push([resolve(text["high-emphasis"]), surfaceSecondary, "Text-High / Surface-Secondary", 4.5])
// プライマリボタン等のラベル。Brand-Primary=Brand-600 にしたことで白文字が AA(4.5) を満たす。
pairs.push([resolve(text["on-inverse"]), brand, "Text-on-Inverse / Brand-Primary", 4.5])

// テーマごとの Brand-600 も確認する。tokens.json の default 値だけでは、
// theme override による CTA コントラスト低下を検出できない。
// 一覧は src/themes/ から動的に導出する（ハードコードだと新テーマが検証から漏れる）。
const themes = readdirSync(join(root, "src/themes"))
  .filter((f) => f.endsWith(".css") && f !== "default.css")
  .map((f) => f.replace(/\.css$/, ""))
for (const theme of themes) {
  pairs.push([
    resolve(text["on-inverse"]),
    readThemeBrandShade(theme, "600"),
    `Text-on-Inverse / ${theme} Brand-Primary`,
    4.5,
  ])
}

// 状態色ボタン（Button variant info / warning / success・issue #598）。
// 文字は Text-on-Inverse。背景・hover・active の全段を light / dark の両方で検査する
// （dark は Text-on-Inverse が濃色になるので、背景を濃くする方向だと AA を割る）。
const semDark = tokens.colors.semanticDark
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  const fg = resolve(s.text["on-inverse"])
  for (const kind of ["info", "warning", "success"]) {
    pairs.push([fg, resolve(s[kind].base), `${mode}: Text-on-Inverse / ${kind}-Base`, 4.5])
    pairs.push([fg, resolve(s.hover[`${kind}-button`]), `${mode}: Text-on-Inverse / Hover-${kind}-Button`, 4.5])
    pairs.push([fg, resolve(s.active[`${kind}-button`]), `${mode}: Text-on-Inverse / Active-${kind}-Button`, 4.5])
  }
}

// destructive ボタン（Button variant destructive。背景は Caution-Base、文字は
// Text-on-Inverse・issue #618）。hover/active キーは `destructive-button`
// （caution-button ではない）なので info/warning/success とは別ループにする。
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  const fg = resolve(s.text["on-inverse"])
  pairs.push([fg, resolve(s.caution.base), `${mode}: Text-on-Inverse / Caution-Base (destructive)`, 4.5])
  pairs.push([fg, resolve(s.hover["destructive-button"]), `${mode}: Text-on-Inverse / Hover-Destructive-Button`, 4.5])
  pairs.push([fg, resolve(s.active["destructive-button"]), `${mode}: Text-on-Inverse / Active-Destructive-Button`, 4.5])
}

// 文字だけの弱いボタン（Button variant ghost-neutral / ghost-destructive / ghost-success・
// issue #664 / #671）。背景は無く Surface-Primary の上に乗る。hover の面（Hover-Ghost-Button /
// Surface-Caution / Surface-Success は淡い単色）は Surface-Primary に合成した実色で、文字も dark の White-Alpha は
// その上に合成して比べる。light / dark の両方で AA。
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  const bg = resolve(s.surface.primary)
  const ghostTones = [
    ["ghost-neutral", s.text["medium-emphasis"], s.hover["ghost-button"]],
    ["ghost-destructive", s.text.caution, s.surface.caution],
    ["ghost-success", s.text.success, s.surface.success],
  ]
  for (const [variant, fgVal, hoverVal] of ghostTones) {
    pairs.push([resolveOver(fgVal, bg), bg, `${mode}: Button ${variant} の文字 / Surface-Primary`, 4.5])
    const hoverBg = resolveOver(hoverVal, bg)
    pairs.push([resolveOver(fgVal, hoverBg), hoverBg, `${mode}: Button ${variant} の文字 / hover の面`, 4.5])
  }
}

// 暗色サイドバー（SidebarNav tone="inverse"・issue #680）。面は Surface-Inverse、hover / 選択中は
// Object-on-Inverse を 10% / 15% 重ねた色（Tailwind の /10・/15 = color-mix と同じ線形合成）。
// 文字: 通常 Text-on-Inverse-Secondary、hover / 選択中 Text-on-Inverse。light / dark で AA。
const mixHex = (fgHex, bgHex, alpha) => {
  const f = [1, 3, 5].map((i) => parseInt(fgHex.slice(i, i + 2), 16))
  const b = [1, 3, 5].map((i) => parseInt(bgHex.slice(i, i + 2), 16))
  return "#" + f.map((c, k) => Math.round(c * alpha + b[k] * (1 - alpha)).toString(16).padStart(2, "0")).join("")
}
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  const surfaceInverse = resolve(s.surface.inverse)
  const objectOnInverse = resolve(s.object["on-inverse"])
  const hoverBg = mixHex(objectOnInverse, surfaceInverse, 0.1)
  const selectedBg = mixHex(objectOnInverse, surfaceInverse, 0.15)
  const secondaryOn = (bg) => resolveOver(s.text["on-inverse-secondary"], bg)
  pairs.push([secondaryOn(surfaceInverse), surfaceInverse, `${mode}: SidebarNav inverse の文字 / Surface-Inverse`, 4.5])
  pairs.push([resolve(s.text["on-inverse"]), hoverBg, `${mode}: SidebarNav inverse の hover 文字 / hover の面`, 4.5])
  pairs.push([resolve(s.text["on-inverse"]), selectedBg, `${mode}: SidebarNav inverse の選択中の文字 / 選択の面`, 4.5])
}

// IconBadge の tone（issue #684）: アイコン色と淡い面の非テキストコントラスト 3:1（WCAG 1.4.11）。light / dark。
// success / warning は Object-*（Green-500 / Orange-500）だと淡い面で 3:1 を割るため Text-* を使う（icon-badge.tsx と同じ対応）。
const iconBadgeTones = [
  ["accent", "object", "accent-primary", "accent-primary-light"],
  ["info", "object", "info", "info"],
  ["success", "text", "success", "success"],
  ["warning", "text", "warning", "warning"],
  ["caution", "object", "caution", "caution"],
]
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  for (const [tone, group, fg, surf] of iconBadgeTones) {
    pairs.push([resolve(s[group][fg]), resolve(s.surface[surf]), `${mode}: IconBadge tone=${tone} のアイコン / 面（非テキスト）`, 3])
  }
}

// 暗色サイドバー（SidebarNav tone="inverse"）のフォーカスリング。issue #680 当時、既定の Focus-High-Emphasis/50 は
// Surface-Inverse 上で 3:1 を割った（light 2.7 / dark 1.6）ため、inverse では Object-on-Inverse の不透明リングを使う。
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  const surfaceInverse = resolve(s.surface.inverse)
  pairs.push([resolve(s.object["on-inverse"]), surfaceInverse, `${mode}: SidebarNav inverse のフォーカスリング / Surface-Inverse（非テキスト）`, 3])
}

// フォーカスリング（Focus-High-Emphasis）。操作部品のフォーカス表示は WCAG 1.4.11（非テキスト 3:1）で、
// 置かれる面（Surface-Primary / Surface-Secondary）に対して light / dark の両方で検査する。
// リングは不透明で使う前提（半透明にすると実効コントラストが落ちる。bin/lint.js の P054 が警告）。
// default 以外のテーマは、Focus が指す Brand の段（semantic.css の割当）を各テーマのランプから読んで同じ組を検査する。
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  const ring = resolve(s.focus["high-emphasis"])
  for (const [surfaceLabel, surfaceVal] of [["Surface-Primary", s.surface.primary], ["Surface-Secondary", s.surface.secondary]]) {
    pairs.push([ring, resolve(surfaceVal), `${mode}: Focus-High-Emphasis / ${surfaceLabel}（フォーカスリング・非テキスト）`, 3])
  }
  const shade = s.focus["high-emphasis"].match(/^var\(--Primitive-Brand-(\d+)\)$/)?.[1]
  for (const theme of shade ? themes : []) {
    for (const [surfaceLabel, surfaceVal] of [["Surface-Primary", s.surface.primary], ["Surface-Secondary", s.surface.secondary]]) {
      pairs.push([readThemeBrandShade(theme, shade), resolve(surfaceVal), `${mode}: ${theme} Focus-High-Emphasis（Brand-${shade}）/ ${surfaceLabel}（フォーカスリング・非テキスト）`, 3])
    }
  }
}

// 検索一致のハイライト（<mark>・Highlight 部品・issue #692）。light / dark で AA。
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  pairs.push([resolve(s.text["on-highlight"]), resolve(s.surface.highlight), `${mode}: Text-on-Highlight / Surface-Highlight`, 4.5])
}

// LINE の塗りボタン（ShareButtons layout="block"・issue #685）。External Brand は tokens.json に
// 無く semantic.css の固定 hex が正本なので、そこから読む。ライト / ダーク共通。
{
  const semanticCss = readFileSync(join(root, "src/styles/semantic.css"), "utf8")
  const brandHex = (name) => semanticCss.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1]
  const onLine = brandHex("Brand-on-Line")
  for (const bgName of ["Brand-Line", "Brand-Line-Hover", "Brand-Line-Pressed"]) {
    pairs.push([onLine, brandHex(bgName), `Brand-on-Line / ${bgName}（ShareButtons block の LINE）`, 4.5])
  }
}

// Categorical: Bold は文字用 → 白背景 & 自分の Subtle 背景で AA
const cat = sem.categorical || {}
for (const k of Object.keys(cat)) {
  if (k.startsWith("_")) continue
  const c = cat[k]
  if (!c?.bold) continue
  pairs.push([c.bold, "#FFFFFF", `Categorical-${k}-Bold / 白`, 4.5])
  if (c.subtle) pairs.push([c.bold, c.subtle, `Categorical-${k}-Bold / Subtle`, 4.5])
}

// 文字以外のコントラスト（WCAG 1.4.11・3:1）。操作部品の境界・状態を示す
// 「枠 / 地」と、その部品が置かれる背景（Surface-Primary）の組。
// dark の枠は White-Alpha（半透明）なので、背景へ合成した実色で比べる。
// 5 番目の要素は台帳（test/known-exceptions.json の contrast）の照合キー。
const nonTextControls = [
  ["input-border", "入力欄の枠（Input / Textarea / SelectTrigger）", s => s.border.control],
  ["checkbox-border", "チェックボックス（未選択）の枠", s => s.border.control],
  ["radio-border", "ラジオ（未選択）の枠", s => s.border.control],
  ["switch-off-track", "スイッチ（オフ）の地 Surface-Switch-Off", s => s.surface["switch-off"]],
  ["switch-off-hover", "スイッチ（オフ・hover）の地", s => s.surface["switch-off-hover"]],
  ["slider-track", "スライダーの溝 Surface-Slider-Track", s => s.surface["slider-track"]],
  ["checkbox-checked-fill", "チェックボックス（選択）の地 Brand-Primary", s => s.brand.primary],
  ["switch-on-track", "スイッチ（オン）の地 Brand-Primary", s => s.brand.primary],
  ["field-focus-border", "入力欄（フォーカス）の枠 Border-Accent-Primary", s => s.border["accent-primary"]],
  ["field-error-border", "入力欄（エラー）の枠 Border-Caution", s => s.border.caution],
]
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  const bg = resolve(s.surface.primary)
  for (const [id, label, pick] of nonTextControls) {
    pairs.push([resolveOver(pick(s), bg), bg, `${mode}: ${label} / Surface-Primary（非テキスト）`, 3, `${mode}:${id}`])
  }
}

// 高コントラスト指定でも操作部品は3:1以上を維持する。既定値にも例外は不要。
const contrastMore = tokens.colors.semanticContrastMore
for (const [mode, s] of [["light", sem], ["dark", semDark]]) {
  const bg = resolve(s.surface.primary)
  const more = contrastMore[mode]
  const moreControls = [
    ["入力欄・チェックボックス・ラジオの枠 Border-Control", more.border.control],
    ["スイッチ（オフ）の地 Surface-Switch-Off", more.surface["switch-off"]],
    ["スイッチ（オフ・hover）の地 Surface-Switch-Off-Hover", more.surface["switch-off-hover"]],
    ["スライダーの溝 Surface-Slider-Track", more.surface["slider-track"]],
  ]
  for (const [label, value] of moreControls) {
    pairs.push([resolveOver(value, bg), bg, `${mode}: prefers-contrast: more の ${label} / Surface-Primary（非テキスト）`, 3])
  }
}

const ledger = loadKnownExceptions(root)
const ledgerErrors = validateSection("contrast", ledger.contrast)
const exceptionByPair = new Map(ledger.contrast.map((entry) => [entry.pair, entry]))
const usedExceptions = new Set()

let fail = 0, skipped = 0, excepted = 0
const rows = []
for (const [fg, bg, label, min, id] of pairs) {
  if (!fg || !bg) { skipped++; continue }
  const ratio = contrast(fg, bg)
  let ok = ratio >= min
  const exception = id ? exceptionByPair.get(id) : undefined
  if (exception) {
    usedExceptions.add(id)
    // 基準を満たしたのに登録が残っている＝直った。登録の削除を促すため失敗にする。
    if (ok) ledgerErrors.push(`contrast: ${id} は ${ratio.toFixed(2)}:1 で基準を満たしています。${LEDGER_PATH} から登録を削除してください`)
  }
  const isException = !ok && Boolean(exception)
  if (isException) { ok = true; excepted++ }
  if (!ok) fail++
  rows.push({ label, ratio: ratio.toFixed(2), min, ok, isException, exception })
}
for (const entry of ledger.contrast) {
  if (!usedExceptions.has(entry.pair)) ledgerErrors.push(`contrast: ${entry.pair} は検査ペアに存在しません。${LEDGER_PATH} から登録を削除してください`)
}

console.log("🎨 KSK — コントラスト検査 (WCAG AA・文字 4.5 / 非テキスト 3)")
console.log("=======================================")
for (const r of rows) {
  const status = r.isException ? "\x1b[33m[例外]\x1b[0m" : r.ok ? "\x1b[32m[OK]\x1b[0m  " : "\x1b[31m[NG]\x1b[0m  "
  const note = r.isException ? `  → ${r.exception.issue}・見直し ${r.exception.reviewBy}` : ""
  console.log(`${status} ${r.ratio.padStart(6)} : ${r.min} : ${r.label}${note}`)
}
if (skipped) console.log(`(解決不可で skip: ${skipped} ペア — rgba/color-mix 等)`)
console.log("=======================================")
for (const error of ledgerErrors) console.error(`\x1b[31m✗ ${error}\x1b[0m`)
if (fail) console.error(`\x1b[31m✗ ${fail} ペアが基準未満（意図した未達なら ${LEDGER_PATH} に期限付きで登録）\x1b[0m`)
if (fail || ledgerErrors.length) process.exit(1)
console.log(`\x1b[32m✓ 全 ${rows.length} ペア通過（うち台帳の例外 ${excepted}）\x1b[0m`)
