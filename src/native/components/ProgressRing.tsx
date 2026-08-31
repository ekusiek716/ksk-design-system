import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

/**
 * 開発ビルド判定。DS は node の型を持たないので globalThis 経由で参照する。
 * `proc` の存在を先に必須にする（ChipSelector / QuickActionGrid と同じ形）。
 * 省略すると process 自体が無い環境で undefined との比較が true になり、
 * 本番でも警告が出続ける。
 */
function isDev() {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}

export interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  /**
   * リングの線の太さ（px）。Web の `strokeWidth` と同じ意味・同じ名前。
   *
   * @default 6
   */
  strokeWidth?: number
  /**
   * リングの線の太さ（px）。
   *
   * @deprecated issue #495。`strokeWidth` を使うこと（Web の同名 prop と語彙を揃えた）。
   * 後方互換のため型からは消していない。両方渡した場合は `strokeWidth` が優先される。
   *
   * @default 6
   */
  thickness?: number
  showLabel?: boolean
}

/**
 * SVG非依存の簡易ProgressRing。
 * 半円を2枚使った clip 風表現で React Native のViewのみで完結させる。
 */
export function ProgressRing({
  value,
  max = 100,
  size = 64,
  strokeWidth,
  thickness,
  showLabel = true,
}: ProgressRingProps) {
  const { theme } = useTheme()
  // 非推奨の `thickness` は後方互換で読み続けるが、両方来たら新しい方を採る。
  const resolvedStrokeWidth = strokeWidth ?? thickness ?? 6

  if (isDev() && thickness !== undefined) {
    console.warn(
      "[ProgressRing] `thickness` は非推奨です（issue #495）。Web と語彙を揃えた `strokeWidth` を使ってください。"
    )
  }
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const angle = (pct / 100) * 360

  const trackColor = theme.surface.tertiary
  const fillColor = theme.brand.primary

  const half = size / 2

  const renderHalfFill = (rotation: number) => (
    <View
      style={{
        position: "absolute",
        width: size,
        height: size,
        transform: [{ rotate: `${rotation}deg` }],
      }}
    >
      <View
        style={{
          position: "absolute",
          width: half,
          height: size,
          backgroundColor: fillColor,
          borderTopLeftRadius: half,
          borderBottomLeftRadius: half,
        }}
      />
    </View>
  )

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: trackColor,
        }}
      />
      {angle > 0 && renderHalfFill(0)}
      {angle > 180 && renderHalfFill(180)}
      {angle > 0 && angle < 180 && (
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            transform: [{ rotate: `${angle - 180}deg` }],
          }}
        >
          <View
            style={{
              position: "absolute",
              right: 0,
              width: half,
              height: size,
              backgroundColor: trackColor,
              borderTopRightRadius: half,
              borderBottomRightRadius: half,
            }}
          />
        </View>
      )}
      {angle >= 180 && angle < 360 && (
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            transform: [{ rotate: `${angle}deg` }],
          }}
        >
          <View
            style={{
              position: "absolute",
              right: 0,
              width: half,
              height: size,
              backgroundColor: trackColor,
              borderTopRightRadius: half,
              borderBottomRightRadius: half,
            }}
          />
        </View>
      )}
      <View
        style={{
          width: size - resolvedStrokeWidth * 2,
          height: size - resolvedStrokeWidth * 2,
          borderRadius: (size - resolvedStrokeWidth * 2) / 2,
          backgroundColor: theme.surface.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showLabel && (
          <RNText style={[resolveTypo("label.sm"), { color: theme.text["high-emphasis"] }]}>
            {Math.round(pct)}%
          </RNText>
        )}
      </View>
    </View>
  )
}
