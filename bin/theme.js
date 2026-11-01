// =============================================================
// ksk-ds theme — ブランド色 1 色から Brand ランプ（50〜900）を生成し、
// コントラストを検査して theme CSS を書き出す。
//
//   npx ksk-ds theme <hex> [--name my-client] [--out path.css] [--json]
//   npx ksk-ds theme --check <file.css> [--json]
//
// 設計の要点
// - `<hex>` は Brand-500 にそのまま置く（src/themes/README.md の規約）。
// - 色は OKLCH で扱う。色相はブランド色のまま、明度は段ごとの目標値へ、
//   彩度は sRGB 色域に収まるまで縮める（gamut clamp）。依存パッケージなし。
// - 検査するペアは src/styles/semantic.css の実際の使われ方から決める
//   （evaluateChecks のコメントに根拠を書いた）。
// - 検査を落とす 600 / 400 は、通る値まで自動で補正して警告を出す。
// =============================================================

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { basename, dirname, extname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

/** このファイル（bin/theme.js）から見たパッケージのルート */
const DEFAULT_PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")

export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

// ─── 色変換（sRGB ⇄ linear ⇄ OKLab ⇄ OKLCH）──────────────────
// OKLab の行列は Björn Ottosson, "A perceptual color space for image processing"
// （https://bottosson.github.io/posts/oklab/）の値。

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const linearToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055)

export function normalizeHex(input) {
  if (typeof input !== "string") return null
  let h = input.trim().replace(/^#/, "")
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = [...h].map((c) => c + c).join("")
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  return `#${h.toUpperCase()}`
}

export function hexToRgb(hex) {
  const h = hex.replace("#", "")
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

export function rgbToHex(rgb) {
  return (
    "#" +
    rgb
      .map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  )
}

export function linearRgbToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

export function oklabToLinearRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

/** hex → { l, c, h }（h は度。無彩色は 0） */
export function hexToOklch(hex) {
  const lin = hexToRgb(hex).map((v) => srgbToLinear(v / 255))
  const [L, a, b] = linearRgbToOklab(lin)
  const c = Math.hypot(a, b)
  const h = c < 1e-4 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360
  return { l: L, c, h }
}

function oklchToLinearRgb(l, c, h) {
  const rad = (h * Math.PI) / 180
  return oklabToLinearRgb([l, c * Math.cos(rad), c * Math.sin(rad)])
}

const GAMUT_EPS = 1e-6
function inGamut(l, c, h) {
  return oklchToLinearRgb(l, c, h).every((v) => v >= -GAMUT_EPS && v <= 1 + GAMUT_EPS)
}

/** 色相と明度を保ったまま、sRGB に収まる最大の彩度まで c を縮める */
export function clampChroma(l, c, h) {
  if (c <= 0 || inGamut(l, c, h)) return Math.max(0, c)
  let lo = 0
  let hi = c
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (inGamut(l, mid, h)) lo = mid
    else hi = mid
  }
  return lo
}

/** OKLCH → hex。色域外なら彩度を縮める（gamut clamp）。 */
export function oklchToHex(l, c, h) {
  const L = Math.min(1, Math.max(0, l))
  const C = clampChroma(L, c, h)
  const lin = oklchToLinearRgb(L, C, h)
  return rgbToHex(lin.map((v) => linearToSrgb(Math.min(1, Math.max(0, v))) * 255))
}

// ─── WCAG コントラスト ───────────────────────────────────────

export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => srgbToLinear(v / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a, b) {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

// ─── ランプの目標値 ──────────────────────────────────────────
// 出典: 既存テーマ default（primitive.css の Blue）/ green / violet / orange / cobalt の
// Brand-50〜900 を OKLCH に変換して測った平均（2026-10 時点。再測定は scripts 不要:
// 各 css の hex を OKLCH に変換するだけ）。
//   明度 L（500 を除く 5 テーマ平均）:
//     50 .973 / 100 .942 / 200 .889 / 300 .814 / 400 .731 /
//     600 .522 / 700 .461 / 800 .393 / 900 .289
//   500 の明度はテーマごとに .525〜.705 と散る（ブランド色そのものだから）ため、
//   目標値は持たず、入力色の明度を軸に両端（50・900）を固定して残りを比例配分する。
//   500 の平均 .604 は「入力が平均ならこの形になる」基準点として使う。
//   彩度 C（各テーマのピーク彩度に対する比の平均 ÷ 500 の比 = 500 を 1 とした相対値）:
//     50 .08 / 100 .18 / 200 .34 / 300 .57 / 400 .80 / 500 1 /
//     600 .985 / 700 .895 / 800 .725 / 900 .52
//   色相 h: 既存ランプはほぼ一定（±数度）なので入力色の色相を固定する。
const LIGHTNESS_TARGET = {
  50: 0.973,
  100: 0.942,
  200: 0.889,
  300: 0.814,
  400: 0.731,
  500: 0.604,
  600: 0.522,
  700: 0.461,
  800: 0.393,
  900: 0.289,
}
const CHROMA_RELATIVE = {
  50: 0.08,
  100: 0.18,
  200: 0.34,
  300: 0.57,
  400: 0.8,
  500: 1,
  600: 0.985,
  700: 0.895,
  800: 0.725,
  900: 0.52,
}

/** 補正の探索刻み（OKLCH 明度） */
const L_STEP = 0.002

// ─── 検査の前提（semantic.css から読む）────────────────────────

const FALLBACK_CONTEXT = {
  lightSurface: "#FFFFFF",
  lightOnInverse: "#FFFFFF",
  darkSurface: "#18181B",
  darkOnInverse: "#18181B",
  // Focus-High-Emphasis が指す Brand の段（semantic.css の割当）
  lightFocusShade: 600,
  darkFocusShade: 400,
}

function statOrNull(path) {
  try {
    return statSync(path)
  } catch {
    return null
  }
}

function readIfExists(path) {
  try {
    return existsSync(path) ? readFileSync(path, "utf8") : null
  } catch {
    return null
  }
}

function primitiveHex(primitiveCss, name) {
  const m = primitiveCss.match(new RegExp(`--Primitive-${name}:\\s*(#[0-9A-Fa-f]{6})`))
  return m ? normalizeHex(m[1]) : null
}

function focusShade(block, fallback) {
  const m = block.match(/--Focus-High-Emphasis:\s*var\(--Primitive-Brand-(\d+)\)/)
  return m ? Number(m[1]) : fallback
}

function semanticValue(block, token, primitiveCss) {
  const m = block.match(new RegExp(`--${token}:\\s*var\\(--Primitive-([A-Za-z0-9-]+)\\)`))
  return m ? primitiveHex(primitiveCss, m[1]) : null
}

/**
 * 検査で使う面と文字の実値を src/styles/semantic.css（:root と .dark）から読む。
 * 読めなければ現行値の固定値にフォールバックし、source に "fallback" を残す。
 */
export function loadThemeContext(pkgRoot) {
  const semanticCss = readIfExists(join(pkgRoot, "src/styles/semantic.css"))
  const primitiveCss = readIfExists(join(pkgRoot, "src/styles/primitive.css"))
  if (!semanticCss || !primitiveCss) return { ...FALLBACK_CONTEXT, source: "fallback" }
  const light = semanticCss.match(/^:root\s*\{([\s\S]*?)^\}/m)?.[1] ?? ""
  const dark = semanticCss.match(/^\.dark\s*\{([\s\S]*?)^\}/m)?.[1] ?? ""
  const ctx = {
    lightSurface: semanticValue(light, "Surface-Primary", primitiveCss),
    lightOnInverse: semanticValue(light, "Text-on-Inverse", primitiveCss),
    darkSurface: semanticValue(dark, "Surface-Primary", primitiveCss),
    darkOnInverse: semanticValue(dark, "Text-on-Inverse", primitiveCss),
  }
  if (Object.values(ctx).some((v) => !v)) return { ...FALLBACK_CONTEXT, source: "fallback" }
  return {
    ...ctx,
    lightFocusShade: focusShade(light, FALLBACK_CONTEXT.lightFocusShade),
    darkFocusShade: focusShade(dark, FALLBACK_CONTEXT.darkFocusShade),
    source: "semantic.css",
  }
}

// ─── 検査ペア ────────────────────────────────────────────────

/**
 * ランプに対して主要ペアを検査する。根拠は src/styles/semantic.css と
 * src/lib/server-variants/button-variants.ts の実際の使われ方。
 *
 * level: "error"    = 満たさないと exit 1（自動補正できる / 補正すべきペア）
 *        "advisory" = 結果は表示するが exit code には影響しない（理由は note）
 *
 * ライト（:root）
 * - 白文字 / 600: Button default は bg Brand-Primary(=600) + Text-on-Inverse(白)
 * - 600 の文字 / 白: Text-Accent-Primary(=600) を Surface-Primary(白) に載せる。
 *   数値は上と同じだが、役割が別（面と文字）なので別々に出す
 * - 600 の文字 / 50: Text-Accent-Primary を Surface-Accent-Primary-Light(=50)・
 *   Hover-Secondary-Button(=50) に載せる（淡いブランド面の上のリンク・ラベル）
 * - 白文字 / 700, 800: Hover-Primary-Button(=700) / Active-Primary-Button(=800)
 * - 600 / 白（フォーカスリング 3:1）: Focus-High-Emphasis(=600)。非テキスト基準 1.4.11（error）。
 *   ライトのフォーカスリングは Brand-600 の不透明リング（semantic.css）。600 は上の
 *   「600 の文字 / 白」で 4.5:1 以上に補正されるため、通常は必ず通る。段の割当は semantic.css の
 *   `--Focus-High-Emphasis`（:root / .dark）から読むので、割当を変えれば検査対象の段も追従する。
 *
 * ダーク（.dark）
 * - 400 の文字 / ダーク背景: Brand-Primary(=400) / Object・Border-Accent-Primary（Text-Accent-Primary は
 *   issue #830 で 300 に上げたので、この検査を通れば 300 も通る）を
 *   Surface-Primary(Gray-900) に載せる（error）
 * - 400 / ダーク背景（フォーカスリング 3:1）: Focus-High-Emphasis(=400)。非テキスト基準 1.4.11（error）。
 *   上の文字 4.5:1 を満たせば必ず通るが、リングの根拠として別に出す
 * - ダーク文字 / 400（ボタン面）: Brand-Primary(=400) の面に Text-on-Inverse(Gray-900)。
 *   Surface-Primary と Text-on-Inverse が同じ Gray-900 なので数値は上と同じ（error）
 * - ダーク文字 / 500, 600（hover・active の面）: Hover-Primary-Button(=500) /
 *   Active-Primary-Button(=600) に Text-on-Inverse(Gray-900)。advisory:
 *   500 はユーザー指定値なので直せない。600 は「ライトの 600 が白文字 4.5 以上
 *   （輝度 ≦ 0.183）」と「ダークの 600 が Gray-900 文字 4.5 以上（輝度 ≧ 0.216）」が
 *   同時に成り立たない（数式上の矛盾）ため、どちらかを優先する必要があり、
 *   ライトを優先している。押している間だけの状態なので注意表示に留める
 * - 300 の文字 / 900: Text-Accent-Primary(=300) を Surface-Accent-Primary-Light /
 *   Brand-Ultra-Light・Brand-Light(=900) に載せる（issue #830 で 400 から 300 に変更。Brand-Primary(=400)
 *   は淡いブランド面の上に文字として載せない）。advisory: 通らないテーマは
 *   900 をページ背景並みに暗くする必要があり、淡いブランド面として区別できなくなるため自動補正しない
 */
export function evaluateChecks(ramp, ctx) {
  const checks = []
  const add = (id, mode, label, fg, bg, min, level = "error", note) => {
    const ratio = contrastRatio(fg, bg)
    checks.push({ id, mode, label, fg, bg, ratio, min, level, pass: ratio >= min, ...(note ? { note } : {}) })
  }
  const onInverse = ctx.lightOnInverse
  add("light-on-600", "light", "白文字 / Brand-600（ボタン面）", onInverse, ramp[600], 4.5)
  add("light-text-600", "light", "Brand-600 の文字 / 白背景", ramp[600], ctx.lightSurface, 4.5)
  add("light-text-600-on-50", "light", "Brand-600 の文字 / Brand-50（淡いブランド面）", ramp[600], ramp[50], 4.5)
  add("light-on-700", "light", "白文字 / Brand-700（hover）", onInverse, ramp[700], 4.5)
  add("light-on-800", "light", "白文字 / Brand-800（active）", onInverse, ramp[800], 4.5)
  const lightFocus = ctx.lightFocusShade ?? FALLBACK_CONTEXT.lightFocusShade
  const darkFocus = ctx.darkFocusShade ?? FALLBACK_CONTEXT.darkFocusShade
  add("light-focus", "light", `フォーカスリング Brand-${lightFocus} / 白背景（非テキスト）`, ramp[lightFocus], ctx.lightSurface, 3)
  add("dark-text-400", "dark", "Brand-400 の文字 / ダーク背景", ramp[400], ctx.darkSurface, 4.5)
  add("dark-focus", "dark", `フォーカスリング Brand-${darkFocus} / ダーク背景（非テキスト）`, ramp[darkFocus], ctx.darkSurface, 3)
  add("dark-on-400", "dark", "ダーク文字 / Brand-400（ボタン面）", ctx.darkOnInverse, ramp[400], 4.5)
  add(
    "dark-on-500",
    "dark",
    "ダーク文字 / Brand-500（hover の面）",
    ctx.darkOnInverse,
    ramp[500],
    4.5,
    "advisory",
    "500 はブランド色の指定値なので補正しない",
  )
  add(
    "dark-on-600",
    "dark",
    "ダーク文字 / Brand-600（active の面）",
    ctx.darkOnInverse,
    ramp[600],
    4.5,
    "advisory",
    "ライトの 600 が白文字 4.5 以上（輝度 0.183 以下）という条件と同時に満たせない（数式上の矛盾）",
  )
  add(
    "dark-text-300-on-900",
    "dark",
    "Brand-300 の文字 / Brand-900（淡いブランド面）",
    ramp[300],
    ramp[900],
    4.5,
    "advisory",
    "通すには 900 をページ背景並みに暗くする必要があり、面として区別できなくなる",
  )
  return checks
}

// ─── ランプ生成 ──────────────────────────────────────────────

/**
 * 隣接段の明度差（OKLCH L）の下限。
 * - 生成側は MIN_STEP_DESIGN を狙って段を押し広げる（hex の丸めで縮んでも割らないよう余裕を持たせる）
 * - 検査側は MIN_STEP の未満を必須エラー（exit 1）にする
 * hover（700）/ active（800）がボタン面（600）と見分けられる最低限の差として採った。
 * 既存テーマの最小は green の 50→100（0.0195）なので、検査は 0.015 とする。
 * 生成側は 0.025（足りないときでも MIN_STEP + 0.0015）を狙って段を押し広げる。
 */
export const MIN_STEP = 0.015
const MIN_STEP_DESIGN = 0.025
/** 50 の明度の上限の目安（これを超えるなら段差を詰めて白への張り付きを避ける） */
const TOP_LIMIT = 0.99

/**
 * 500 の明度を軸に、50・900 を固定して目標値を比例配分する。
 *
 * 暗い 500（L ≲ 0.4）では 600〜900 を入れる空間が足りなくなるため、900 を
 * 「500 − 0.11」まで下げて空間を確保する（600〜900 の最小の段は全体の約 0.2 倍なので
 * 0.11 あれば 0.02 を超える）。500 の下側に空間が取れない色（ほぼ黒。L ≲ 0.13）や
 * 上側に取れない色（ほぼ白）は、後段の段差検査で必須エラーになる
 * （500 は指定値なので 600 側へ回したり動かしたりしない）。
 */
function lightnessCurve(l500) {
  const top = Math.min(0.995, Math.max(LIGHTNESS_TARGET[50], l500 + 0.05))
  const bottom = Math.max(0.02, Math.min(LIGHTNESS_TARGET[900], l500 - 0.11))
  const t500 = LIGHTNESS_TARGET[500]
  const out = {}
  for (const shade of SHADES) {
    const t = LIGHTNESS_TARGET[shade]
    if (shade === 500) out[shade] = l500
    else if (shade < 500) out[shade] = l500 + ((t - t500) / (LIGHTNESS_TARGET[50] - t500)) * (top - l500)
    else out[shade] = l500 - ((t500 - t) / (t500 - LIGHTNESS_TARGET[900])) * (l500 - bottom)
  }
  return out
}

/** 500 より明るい側（400→50）を、隣の段より MIN_STEP_DESIGN 以上明るくなるよう押し上げる */
function enforceUpper(lightness, from = 400) {
  const order = SHADES.filter((shade) => shade <= from).reverse()
  const apply = (gap) => {
    const next = { ...lightness }
    for (const shade of order) {
      const below = SHADES[SHADES.indexOf(shade) + 1]
      next[shade] = Math.max(lightness[shade], next[below] + gap)
    }
    return next
  }
  // 50 が白（L=1）に張り付くと Surface-Primary と区別できなくなる。上限（0.99）を超えるときだけ、
  // 余裕を削った最小限の段差（MIN_STEP + 丸め分）で詰め直す。
  let result = apply(MIN_STEP_DESIGN)
  if (result[50] > TOP_LIMIT) result = apply(MIN_STEP + 0.0015)
  Object.assign(lightness, result)
}

/** 500 より暗い側（600→900）を、隣の段より MIN_STEP_DESIGN 以上暗くなるよう押し下げる */
function enforceLower(lightness, from = 600) {
  for (const shade of SHADES.filter((s) => s >= from)) {
    const above = SHADES[SHADES.indexOf(shade) - 1]
    lightness[shade] = Math.min(lightness[shade], lightness[above] - MIN_STEP_DESIGN)
  }
}

/**
 * 隣接段（50→100 … 800→900）の明度差を hex の実値で検査する。
 * 明度が下がらない・段差が MIN_STEP 未満（hover / active がボタン面と同色になる等）は NG。
 */
export function evaluateRampSteps(ramp) {
  const steps = []
  for (let i = 1; i < SHADES.length; i++) {
    const from = SHADES[i - 1]
    const to = SHADES[i]
    const diff = hexToOklch(ramp[from]).l - hexToOklch(ramp[to]).l
    steps.push({ from, to, diff, min: MIN_STEP, pass: diff >= MIN_STEP - 1e-9 })
  }
  return steps
}

function stepIssueMessages(steps) {
  return steps
    .filter((st) => !st.pass)
    .map((st) => `Brand-${st.from} → Brand-${st.to} の明度差が ${st.diff.toFixed(3)} で ${st.min} 未満です（明度が下がらない・段差が潰れている）。`)
}

const fmtL = (v) => v.toFixed(3)
const fmtRatio = (v) => v.toFixed(2)

/**
 * ブランド色 hex から Brand ランプを生成し、検査・自動補正する。
 *
 * @param {string} inputHex ブランド色（500 にそのまま置く）
 * @param {{ ctx?: object, pkgRoot?: string }} [options]
 */
export function generateTheme(inputHex, options = {}) {
  const base = normalizeHex(inputHex)
  if (!base) throw new Error(`色の形式が不正です: ${inputHex}（#RRGGBB 形式で指定してください）`)
  const ctx = options.ctx ?? loadThemeContext(options.pkgRoot ?? DEFAULT_PKG_ROOT)
  const { l: l500, c: c500, h } = hexToOklch(base)

  const lightness = lightnessCurve(l500)
  enforceUpper(lightness)
  enforceLower(lightness)
  const colorAt = (shade, l) => oklchToHex(l, c500 * CHROMA_RELATIVE[shade], h)
  const ramp = {}
  for (const shade of SHADES) ramp[shade] = shade === 500 ? base : colorAt(shade, lightness[shade])

  const warnings = []
  const corrections = []

  // 400: ダークの文字/面（4.5・必須。フォーカスリング 3:1 もこれで満たす）を通す明度を探す。
  // ライトのフォーカスリングは 600（下の 600 の補正で白に 4.5:1 以上）なので、400 は白の上の条件を持たない。
  {
    const target = lightness[400]
    const minL = hexToOklch(ramp[500]).l + MIN_STEP_DESIGN
    const dark = (hex) => contrastRatio(hex, ctx.darkSurface) >= 4.5 && contrastRatio(ctx.darkOnInverse, hex) >= 4.5
    const search = (accept) => {
      for (let d = 0; d <= 0.6; d += L_STEP) {
        for (const l of d === 0 ? [target] : [target - d, target + d]) {
          if (l <= minL || l > 0.995) continue
          const hex = colorAt(400, l)
          if (hexToOklch(hex).l > minL - 0.005 && accept(hex)) return { l, hex }
        }
      }
      return null
    }
    const current = ramp[400]
    const found = (dark(current) ? { l: target, hex: current } : null) ?? search(dark)
    if (found && found.hex !== current) {
      corrections.push({ shade: 400, from: current, to: found.hex, reason: "dark" })
      warnings.push(
        `Brand-400 を ${current} → ${found.hex} に補正しました（ダーク背景での文字・フォーカスリング 4.5:1 / 3:1 を満たす明度 L=${fmtL(found.l)}）。`,
      )
      ramp[400] = found.hex
    }
    // 400 が動いたら、その上側（300→50）が詰まらないよう押し上げ直す
    lightness[400] = hexToOklch(ramp[400]).l
    const before = { ...lightness }
    enforceUpper(lightness, 300)
    for (const shade of [300, 200, 100, 50]) if (lightness[shade] !== before[shade]) ramp[shade] = colorAt(shade, lightness[shade])
  }

  // 600: 白文字 4.5（面）・白背景の文字 4.5・Brand-50 上の文字 4.5。通るまで暗くし、700〜900 も連動させる。
  {
    const ok600 = (hex) => contrastRatio(ctx.lightOnInverse, hex) >= 4.5 && contrastRatio(hex, ctx.lightSurface) >= 4.5 && contrastRatio(hex, ramp[50]) >= 4.5
    const original = ramp[600]
    if (!ok600(original)) {
      const l600Old = lightness[600]
      let l = l600Old
      while (l > 0.02 && !ok600(colorAt(600, l))) l -= L_STEP
      const l600New = Math.max(0.02, l)
      ramp[600] = colorAt(600, l600New)
      corrections.push({ shade: 600, from: original, to: ramp[600], reason: "contrast" })
      // 700〜900 は 900 を固定したまま 600 に向かって再配分（単調減少を保つ）
      const l900Old = lightness[900]
      const l900New = Math.max(0.02, Math.min(l900Old, l600New - 0.12))
      const scale = (l600New - l900New) / (l600Old - l900Old)
      const linked = []
      lightness[600] = l600New
      for (const shade of [700, 800, 900]) {
        const lNew = l900New + (lightness[shade] - l900Old) * scale
        lightness[shade] = lNew
      }
      enforceLower(lightness, 700)
      for (const shade of [700, 800, 900]) {
        const lNew = lightness[shade]
        const from = ramp[shade]
        ramp[shade] = colorAt(shade, lNew)
        linked.push(shade)
        corrections.push({ shade, from, to: ramp[shade], reason: "linked-to-600" })
      }
      const onWhite = contrastRatio(ctx.lightOnInverse, original)
      warnings.push(
        `Brand-600 を ${original} → ${ramp[600]} に補正しました（白文字 ${fmtRatio(onWhite)}:1 → ${fmtRatio(contrastRatio(ctx.lightOnInverse, ramp[600]))}:1。AA 4.5 未満だったため）。` +
          `${linked.join("・")} も連動して暗くしました。Brand-500 は指定値のままです。`,
      )
    }
  }

  // 隣接段の明度差。補正後の hex の実値で検査し、足りなければ必須エラー（exit 1）にする。
  const finalL = Object.fromEntries(SHADES.map((s) => [s, hexToOklch(ramp[s]).l]))
  const steps = evaluateRampSteps(ramp)

  const checks = evaluateChecks(ramp, ctx)
  const failing = checks.filter((c) => c.level === "error" && !c.pass)
  return {
    input: base,
    ok: failing.length === 0 && steps.every((st) => st.pass),
    ramp,
    steps,
    oklch: Object.fromEntries(SHADES.map((s) => [s, { l: round(finalL[s], 4), c: round(hexToOklch(ramp[s]).c, 4), h: round(hexToOklch(ramp[s]).h, 1) }])),
    corrections,
    warnings,
    checks,
    context: ctx,
  }
}

const round = (v, digits) => Math.round(v * 10 ** digits) / 10 ** digits

// ─── 既存 CSS の検査（--check）────────────────────────────────

export function parseBrandRampFromCss(css) {
  const ramp = {}
  for (const m of css.matchAll(/--Primitive-Brand-(\d+):\s*(#[0-9A-Fa-f]{3,6})\b/g)) {
    const hex = normalizeHex(m[2])
    if (hex) ramp[m[1]] = hex
  }
  return ramp
}

export function checkThemeCss(css, ctx) {
  const ramp = parseBrandRampFromCss(css)
  const missing = SHADES.filter((s) => !ramp[s])
  if (missing.length > 0) {
    const hint = missing.length === SHADES.length ? "。default テーマのランプは src/styles/primitive.css にあります" : ""
    return { error: `--Primitive-Brand-${missing.join(", ")} が見つかりません（50〜900 の 10 段が必要です）${hint}` }
  }
  const checks = evaluateChecks(ramp, ctx)
  const steps = evaluateRampSteps(ramp)
  return { ok: checks.every((c) => c.level !== "error" || c.pass) && steps.every((st) => st.pass), ramp, steps, checks, context: ctx }
}

// ─── 出力 ────────────────────────────────────────────────────

function statusLabel(c) {
  if (c.pass) return "OK  "
  return c.level === "error" ? "NG  " : "注意"
}

function checkLine(c) {
  const note = !c.pass && c.note ? `  （${c.note}）` : ""
  return `[${statusLabel(c)}] ${fmtRatio(c.ratio).padStart(5)}:1 (>= ${c.min})  ${c.mode === "light" ? "ライト" : "ダーク"}: ${c.label}${note}`
}

function titleCase(name) {
  return name.replace(/(^|[-_.])([a-z])/g, (_, sep, ch) => (sep ? " " : "") + ch.toUpperCase())
}

export function renderThemeCss(result, { name, command }) {
  const lines = [
    "/* =============================================================",
    `   KSK Design System — ${titleCase(name)} Theme（自動生成）`,
    "",
    `   生成元: ${result.input}（Brand-500 = ブランド色）`,
    `   生成コマンド: ${command}`,
    "",
    "   コントラスト検査（WCAG 2.x）:",
    ...result.checks.map((c) => `     ${checkLine(c)}`),
    ...(result.warnings.length > 0 ? ["", "   補正・警告:", ...result.warnings.map((w) => `     - ${w}`)] : []),
    "",
    "   使い方:",
    '   @import "ksk-design-system/preset";',
    `   @import "./themes/${name}.css";`,
    "   ============================================================= */",
    "",
    "@theme {",
    ...SHADES.map((s) => `  ${`--Primitive-Brand-${s}:`.padEnd(23)}${result.ramp[s]};`),
    "}",
    "",
  ]
  return lines.join("\n")
}

function toJson(result, extra = {}) {
  return JSON.stringify(
    {
      ...extra,
      input: result.input,
      ok: result.ok,
      ramp: result.ramp,
      oklch: result.oklch,
      corrections: result.corrections,
      warnings: result.warnings,
      steps: result.steps.map((st) => ({ ...st, diff: round(st.diff, 4) })),
      checks: result.checks.map((c) => ({ ...c, ratio: round(c.ratio, 3) })),
      context: result.context,
    },
    null,
    2,
  )
}

// ─── CLI ─────────────────────────────────────────────────────

const HELP = `ksk-ds theme — ブランド色 1 色から Brand ランプ（50〜900）を生成して検査する

使い方:
  npx ksk-ds theme <hex> [--name my-client] [--out path.css [--force]] [--json]
  npx ksk-ds theme --check <file.css> [--json]

  <hex>             ブランド色（#RRGGBB）。Brand-500 にそのまま置く。
                    シェルでは # がコメント扱いになるので "#0EA5E9" と引用符で囲む（# 省略も可）
  --name <name>     テーマ名（CSS 先頭のコメントと @import 例に使う。既定: --out のファイル名 / custom）
  --out <path.css>  CSS をファイルへ書き出す（省略時は stdout。警告は stderr）。
                    既存ファイルは --force が無ければ上書きせず exit 2。ディレクトリは指定不可
  --force           --out の既存ファイルを上書きする
  --json            ランプ・補正・コントラスト結果を JSON で stdout に出す
  --check <file>    既存テーマ CSS のコントラストだけを検査する（生成しない）。
                    default テーマは src/styles/primitive.css を指定する

検査（src/styles/semantic.css の実際の使われ方に基づく）:
  ライト: 白文字 on 600 / 600 の文字 on 白 / 600 の文字 on 50 / 白文字 on 700・800  >= 4.5
  ダーク: 400 の文字 on ダーク背景 / ダーク文字 on 400  >= 4.5
  参考（注意表示のみ・exit code に影響しない）: フォーカス 400 on 白 >= 3.0、
          ダーク hover/active（500/600 の面）、ダークの 300 on 900

段差: 隣接段の明度差（OKLCH L）が 0.015 未満（明度が下がらない・hover/active がボタン面と同色）は
      必須エラー。生成側は段を押し広げて確保し、それでも足りない色（ほぼ黒・ほぼ白）は exit 1。

補正: 600 が AA 未達なら 600〜900 を暗くし、400 はダークの文字・フォーカスリングが通る明度へ寄せる。
      補正した場合は警告を出す（500 は指定値のまま）。

終了コード: 0 = 通過 / 1 = 必須ペアが未達 / 2 = 使い方の誤り・入力エラー
`

function parseArgs(argv) {
  const opts = { json: false, help: false, force: false }
  const rest = [...argv]
  while (rest.length > 0) {
    const arg = rest.shift()
    const [flag, inline] = arg.startsWith("--") && arg.includes("=") ? [arg.slice(0, arg.indexOf("=")), arg.slice(arg.indexOf("=") + 1)] : [arg, undefined]
    const value = () => {
      const v = inline ?? rest.shift()
      if (v === undefined || (inline === undefined && v.startsWith("--"))) throw new Error(`${flag} には値が必要です`)
      return v
    }
    if (flag === "--help" || flag === "-h") opts.help = true
    else if (flag === "--json") opts.json = true
    else if (flag === "--force") opts.force = true
    else if (flag === "--name") opts.name = value()
    else if (flag === "--out") opts.out = value()
    else if (flag === "--check") opts.check = value()
    else if (flag.startsWith("-")) throw new Error(`未知のオプション: ${flag}`)
    else if (opts.hex === undefined) opts.hex = arg
    else throw new Error(`引数が多すぎます: ${arg}`)
  }
  return opts
}

/**
 * `ksk-ds theme` の本体。終了コードを返す（0 通過 / 1 必須ペア未達 / 2 入力エラー）。
 */
export function runThemeCli(argv, { cwd = process.cwd(), pkgRoot = DEFAULT_PKG_ROOT } = {}) {
  let opts
  try {
    opts = parseArgs(argv)
  } catch (error) {
    console.error(`✗ ${error.message}`)
    console.error("使い方: npx ksk-ds theme <hex> [--name N] [--out F] [--json] / npx ksk-ds theme --check <file.css>")
    return 2
  }
  if (opts.help) {
    console.log(HELP)
    return 0
  }
  const ctx = loadThemeContext(pkgRoot)

  if (opts.check !== undefined) {
    if (opts.hex !== undefined || opts.out !== undefined || opts.name !== undefined || opts.force) {
      console.error("✗ --check は <hex> / --out / --name / --force と併用できません")
      return 2
    }
    const file = resolve(cwd, opts.check)
    const css = readIfExists(file)
    if (css === null) {
      console.error(`✗ ファイルが読めません: ${file}`)
      return 2
    }
    const result = checkThemeCss(css, ctx)
    if (result.error) {
      console.error(`✗ ${opts.check}: ${result.error}`)
      return 2
    }
    if (opts.json) {
      console.log(toJson({ ...result, input: result.ramp[500], oklch: {}, corrections: [], warnings: [] }, { file: opts.check }))
    } else {
      console.log(`${opts.check}（Brand-500 = ${result.ramp[500]}）`)
      for (const c of result.checks) console.log(`  ${checkLine(c)}`)
      for (const message of stepIssueMessages(result.steps)) console.log(`  [NG  ] ${message}`)
      console.log(result.ok ? "✓ 必須ペアと段差は全て通過" : "✗ 必須ペアまたは段差が未達です")
    }
    return result.ok ? 0 : 1
  }

  if (opts.hex === undefined) {
    console.error("✗ ブランド色（hex）を指定してください")
    console.error('  例: npx ksk-ds theme "#0EA5E9" --name sky')
    return 2
  }
  const hex = normalizeHex(opts.hex)
  if (!hex) {
    console.error(`✗ 色の形式が不正です: ${opts.hex}（#RRGGBB 形式で指定してください）`)
    return 2
  }
  const name = opts.name ?? (opts.out ? basename(opts.out, extname(opts.out)) : "custom")
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name)) {
    console.error(`✗ --name は英数字・ . _ - のみ使えます: ${name}`)
    return 2
  }

  // --out の入力エラーは生成の前に止める（ディレクトリ・既存ファイル）
  const outPath = opts.out ? resolve(cwd, opts.out) : null
  if (outPath) {
    const stat = statOrNull(outPath)
    if (stat?.isDirectory()) {
      console.error(`✗ --out にはファイルを指定してください（ディレクトリです）: ${opts.out}`)
      return 2
    }
    if (stat && !opts.force) {
      console.error(`✗ ${opts.out} は既に存在します。上書きするには --force を付けてください`)
      return 2
    }
  }

  const result = generateTheme(hex, { ctx })
  const command = `npx ksk-ds theme "${hex}"${opts.name ? ` --name ${opts.name}` : ""}`

  if (opts.json) {
    console.log(toJson(result, { name }))
  } else {
    for (const w of result.warnings) console.error(`⚠ ${w}`)
    for (const c of result.checks.filter((x) => x.level === "error" && !x.pass)) {
      console.error(`✗ ${checkLine(c)}`)
    }
    for (const message of stepIssueMessages(result.steps)) console.error(`✗ ${message}`)
    // 参考ペア（exit code には影響しない）。CSS の先頭コメントにも同じ表が入る
    for (const c of result.checks.filter((x) => x.level === "advisory" && !x.pass)) {
      console.error(`ℹ ${checkLine(c)}`)
    }
  }
  if (!result.ok) {
    if (!opts.json) console.error("✗ 補正しても通らない必須ペア・段差があるため、CSS は出力しません")
    return 1
  }
  const css = renderThemeCss(result, { name, command })
  if (opts.out) {
    try {
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, css)
    } catch (error) {
      console.error(`✗ ${opts.out} に書き込めません: ${error.code ?? error.message}`)
      return 2
    }
    if (!opts.json) {
      console.log(`✓ ${opts.out} を書き出しました（Brand-500 = ${hex}）`)
      for (const c of result.checks) console.log(`  ${checkLine(c)}`)
    }
  } else if (!opts.json) {
    process.stdout.write(css)
  }
  return 0
}
