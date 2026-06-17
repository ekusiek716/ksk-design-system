import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface ProgressRingProps {
  value: number
  max?: number
  size?: number
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
  thickness = 6,
  showLabel = true,
}: ProgressRingProps) {
  const { theme } = useTheme()
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
          width: size - thickness * 2,
          height: size - thickness * 2,
          borderRadius: (size - thickness * 2) / 2,
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
