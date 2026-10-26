/**
 * Button variant="glass" の containerStyle / pressedContainerStyle の解決（issue #754）。
 *
 * glass は「外側の Pressable（押せる範囲・角丸のクリップ）」と「内側の GlassView（ぼかし面 + 余白）」
 * の 2 層で、非 glass のように 1 つの Pressable に style を重ねるだけでは余白と角丸が合わない。
 * そこで consumer の style を次のとおり振り分ける。
 *   - 内側: padding 系（paddingHorizontal 等）。ぼかし面の中の余白だから。
 *   - 外側: それ以外すべて（width / height / minHeight / margin / alignSelf / borderRadius ...）。
 *   - borderRadius は外側のクリップと GlassView の角丸（rim・highlight の丸み）を揃えるため両方へ渡す。
 * こうすると丸く小さい補助ボタン（例: width/height 40・paddingHorizontal 0・borderRadius 20）が
 * ブラーを四角くはみ出させずに作れる。
 */
import type { StyleProp, ViewStyle } from "react-native"

const PADDING_KEYS = new Set([
  "padding",
  "paddingHorizontal",
  "paddingVertical",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingStart",
  "paddingEnd",
])

type StyleInput = StyleProp<ViewStyle> | readonly StyleInput[]

/** StyleSheet.flatten と同じ結果を、react-native に依存せず返す（false / null / undefined は無視）。 */
export function flattenViewStyle(style: StyleInput): ViewStyle {
  if (!style) return {}
  if (Array.isArray(style)) {
    return (style as readonly StyleInput[]).reduce<ViewStyle>((acc, s) => ({ ...acc, ...flattenViewStyle(s) }), {})
  }
  return style as ViewStyle
}

/** consumer の style を、外側 Pressable に当てる分と内側 GlassView に当てる分に分ける。 */
export function splitGlassContainerStyle(style: StyleInput): { outer: ViewStyle; inner: ViewStyle } {
  const flat = flattenViewStyle(style) as Record<string, unknown>
  const outer: Record<string, unknown> = {}
  const inner: Record<string, unknown> = {}
  for (const key of Object.keys(flat)) {
    if (PADDING_KEYS.has(key)) inner[key] = flat[key]
    else outer[key] = flat[key]
  }
  return { outer: outer as ViewStyle, inner: inner as ViewStyle }
}

/**
 * 見た目が最小タップ寸法（既定 44pt）に満たない数値の width / height を hitSlop で補う。
 * IconButton と同じ考え方（見た目は小さくてもタップ領域は 44pt 以上・WCAG 2.5.5）。
 * 数値で指定されていない寸法（内容なりの幅・%）は見積もれないので補わない。
 */
export function resolveGlassHitSlop(
  outer: ViewStyle,
  minTarget: number,
): { top: number; bottom: number; left: number; right: number } | undefined {
  const slop = (size: unknown) => (typeof size === "number" && size < minTarget ? Math.ceil((minTarget - size) / 2) : 0)
  const vertical = slop(outer.height)
  const horizontal = slop(outer.width)
  if (vertical === 0 && horizontal === 0) return undefined
  return { top: vertical, bottom: vertical, left: horizontal, right: horizontal }
}
