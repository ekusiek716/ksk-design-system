/**
 * Brand ティントの Liquid Glass（web の `.glass-accent`）を RN の色文字列で再現する。
 *
 * web 側は CSS の `color-mix()` で
 *   light: color-mix(in srgb, var(--Brand-Primary) 95%, transparent)
 *   dark : color-mix(in srgb, var(--Brand-Primary) 88%, rgba(20, 20, 30, 0.60))
 * を敷いている。RN には color-mix が無いため、同じ計算をここで純関数として持つ。
 *
 * 「ブランド色をほぼ不透明（95%）で敷く」意図は web と共通で、
 * 低透明度ティントにすると光背景で白前景（text.on-inverse）が読めなくなるため薄くしない。
 * react-native 非依存モジュールなので vitest でそのまま検証できる。
 */

/** light モードでブランド色を敷く比率（= web の 95%） */
const LIGHT_BRAND_RATIO = 0.95
/** dark モードでブランド色を敷く比率（= web の 88%） */
const DARK_BRAND_RATIO = 0.88
/** dark モードで混ぜる暗色ベース（= web の rgba(20, 20, 30, 0.60)） */
const DARK_BASE = { r: 20, g: 20, b: 30, a: 0.6 }

export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

/**
 * `#RGB` / `#RGBA` / `#RRGGBB` / `#RRGGBBAA` を rgba に分解する。
 * 解釈できない文字列は null を返す（呼び出し側でフォールバックさせる）。
 */
export function parseHexColor(hex: string): Rgba | null {
  const raw = hex.trim().replace(/^#/, "")
  if (!/^[0-9a-fA-F]+$/.test(raw)) return null

  const expand = (s: string) => s.split("").map((c) => c + c).join("")
  let body: string
  if (raw.length === 3 || raw.length === 4) body = expand(raw)
  else if (raw.length === 6 || raw.length === 8) body = raw
  else return null

  const int = (i: number) => parseInt(body.slice(i, i + 2), 16)
  return {
    r: int(0),
    g: int(2),
    b: int(4),
    a: body.length === 8 ? int(6) / 255 : 1,
  }
}

/** 小数を最大 3 桁に丸めて末尾の 0 を落とす（"0.95" / "1"） */
function formatAlpha(a: number): string {
  return String(Math.round(Math.min(Math.max(a, 0), 1) * 1000) / 1000)
}

export function formatRgba({ r, g, b, a }: Rgba): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${formatAlpha(a)})`
}

/**
 * CSS `color-mix(in srgb, top {ratio}%, bottom)` 相当。
 * アルファ付きの色を混ぜるため、premultiplied で加重平均してから戻す。
 */
export function mixSrgb(top: Rgba, bottom: Rgba, ratio: number): Rgba {
  const w = Math.min(Math.max(ratio, 0), 1)
  const a = top.a * w + bottom.a * (1 - w)
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 }
  const ch = (t: number, b: number) => (t * top.a * w + b * bottom.a * (1 - w)) / a
  return { r: ch(top.r, bottom.r), g: ch(top.g, bottom.g), b: ch(top.b, bottom.b), a }
}

export interface GlassAccentFillInput {
  /** theme.brand.primary（`#RRGGBB`） */
  brandPrimary: string
  mode: "light" | "dark"
}

/**
 * GlassView の `backgroundFill` に渡すブランドティント。
 * hex を解釈できない場合はブランド色をそのまま返す（不透明・最悪でも読める）。
 */
export function resolveGlassAccentFill({ brandPrimary, mode }: GlassAccentFillInput): string {
  const brand = parseHexColor(brandPrimary)
  if (!brand) return brandPrimary
  if (mode === "light") {
    return formatRgba(mixSrgb(brand, { r: 0, g: 0, b: 0, a: 0 }, LIGHT_BRAND_RATIO))
  }
  return formatRgba(mixSrgb(brand, DARK_BASE, DARK_BRAND_RATIO))
}

/** `.glass-accent` の縁（web: light 0.40 / dark 0.25 の白） */
export function resolveGlassAccentRim(mode: "light" | "dark"): string {
  return mode === "light" ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.25)"
}

/** `.glass-accent` の上辺ハイライト（web: inset 0 2px 1px -1px の白） */
export function resolveGlassAccentHighlight(mode: "light" | "dark"): string {
  return mode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.25)"
}
