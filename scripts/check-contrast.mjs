#!/usr/bin/env node
// =============================================================
// KSK Design System — コントラスト自動チェック
//
// tokens.json のカラートークンを解決し、主要な「文字 × 背景」ペアが
// WCAG AA を満たすか検査する。CI で a11y 回帰（トークン変更でコントラストが
// 落ちる）を防ぐ。categorical の Bold（文字用）と semantic テキストが対象。
//
// 実行: node scripts/check-contrast.mjs
// =============================================================
import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { resolveTokenColor } from "./lib/resolve-token-color.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const tokens = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"))
const prim = tokens.colors.primitive
const sem = tokens.colors.semantic

// `var(--Primitive-Gray-900)` / `var(--Primitive-White)` / 生 hex を hex に解決
function resolve(val) {
  return resolveTokenColor(val, prim)
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

// Categorical: Bold は文字用 → 白背景 & 自分の Subtle 背景で AA
const cat = sem.categorical || {}
for (const k of Object.keys(cat)) {
  if (k.startsWith("_")) continue
  const c = cat[k]
  if (!c?.bold) continue
  pairs.push([c.bold, "#FFFFFF", `Categorical-${k}-Bold / 白`, 4.5])
  if (c.subtle) pairs.push([c.bold, c.subtle, `Categorical-${k}-Bold / Subtle`, 4.5])
}

let fail = 0, skipped = 0
const rows = []
for (const [fg, bg, label, min] of pairs) {
  if (!fg || !bg) { skipped++; continue }
  const ratio = contrast(fg, bg)
  const ok = ratio >= min
  if (!ok) fail++
  rows.push({ label, ratio: ratio.toFixed(2), min, ok })
}

console.log("🎨 KSK — コントラスト検査 (WCAG AA)")
console.log("=======================================")
for (const r of rows) {
  console.log(`${r.ok ? "\x1b[32m[OK]\x1b[0m  " : "\x1b[31m[NG]\x1b[0m  "} ${r.ratio.padStart(6)} : ${r.min} : ${r.label}`)
}
if (skipped) console.log(`(解決不可で skip: ${skipped} ペア — rgba/color-mix 等)`)
console.log("=======================================")
if (fail) {
  console.error(`\x1b[31m✗ ${fail} ペアが AA 未満\x1b[0m`)
  process.exit(1)
}
console.log(`\x1b[32m✓ 全 ${rows.length} ペア AA 通過\x1b[0m`)
