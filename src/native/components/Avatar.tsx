import React from "react"
import {
  View,
  Image,
  Text as RNText,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type AvatarSize = "sm" | "md" | "lg" | "xl"
export type AvatarShape = "circle" | "rounded"
/** 角丸の強さ（`shape="rounded"` のときだけ効く）。native Card の radius と同じ語彙。 */
export type AvatarRadius = "lg" | "xl" | "2xl"

export interface AvatarProps {
  /**
   * 画像。`require(...)` / `{ uri }` に加え、リモート URL の文字列も受け付ける
   * （内部で `{ uri }` に正規化する / issue #449）。
   */
  source?: ImageSourcePropType | string
  /**
   * 画像が無いときの表示。文字列なら DS のラベル書体で中央に描画する（従来どおり）。
   * ReactNode を渡すと、その要素をそのまま枠の中に描画する（決定論グラデ + 絵文字など）。
   * 枠は `overflow: "hidden"` + 中央寄せなので、面いっぱいに敷きたい要素は
   * `StyleSheet.absoluteFill` 等で広げる。
   */
  fallback?: React.ReactNode
  /**
   * サイズ。プリセット（sm=32 / md=40 / lg=56 / xl=80）に加えて pt の数値も渡せる。
   * 既定は "md"。
   */
  size?: AvatarSize | number
  /** 形状。既定 "circle"（従来どおり）。"rounded" は角丸の四角。 */
  shape?: AvatarShape
  /** `shape="rounded"` のときの角丸。既定 "xl"（12pt）。 */
  radius?: AvatarRadius
  /** 枠のスタイル上書き（背景色など）。 */
  style?: StyleProp<ViewStyle>
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

export function Avatar({
  source,
  fallback,
  size = "md",
  shape = "circle",
  radius = "xl",
  style,
}: AvatarProps) {
  const { theme, scales } = useTheme()
  const dim = typeof size === "number" ? size : sizeMap[size]
  const borderRadius = shape === "circle" ? dim / 2 : scales.borderRadius[radius]
  // View / Image どちらにも渡すため ViewStyle 注釈を付けず、両者に代入可能な
  // 推論結果のまま扱う（ViewStyle は overflow:"scroll" を含み ImageStyle と非互換）。
  const base = {
    width: dim,
    height: dim,
    borderRadius,
    backgroundColor: theme.surface.tertiary,
  }

  if (source) {
    const resolved: ImageSourcePropType = typeof source === "string" ? { uri: source } : source
    return <Image source={resolved} style={[base, style as StyleProp<ImageStyle>]} />
  }

  return (
    <View
      style={[
        base,
        { alignItems: "center", justifyContent: "center" },
        // overflow: hidden は枠を超えうるカスタム fallback のときだけ付ける
        // （文字列/未指定の従来経路は変更前とスタイル完全一致を保つ）。
        typeof fallback !== "string" && fallback != null ? { overflow: "hidden" as const } : null,
        style,
      ]}
    >
      {typeof fallback === "string" || fallback == null ? (
        <RNText style={[resolveTypo("label.sm"), { color: theme.text["medium-emphasis"] }]}>
          {fallback ?? "?"}
        </RNText>
      ) : (
        fallback
      )}
    </View>
  )
}
