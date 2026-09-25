import React from "react"
import { View, Text as RNText, type StyleProp, type ViewStyle, type TextProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface StatCardProps {
  /** Card surface layout, including stretch within an equal-height row. */
  style?: StyleProp<ViewStyle>
  /** Minimum label slot height; grows naturally when Dynamic Type needs more space. */
  labelMinHeight?: number
  /** Reports natural label layout, independently of the label slot minimum. */
  onLabelLayout?: TextProps["onLayout"]
  label: string
  value: string | number
  delta?: string
  trend?: "up" | "down" | "neutral"
}

export function StatCard({ label, value, delta, trend = "neutral", style, labelMinHeight, onLabelLayout }: StatCardProps) {
  const { theme, scales } = useTheme()
  const trendColor =
    trend === "up" ? theme.text.success : trend === "down" ? theme.text.caution : theme.text["low-emphasis"]

  return (
    <View
      style={[{
        backgroundColor: theme.surface.primary,
        borderColor: theme.border["low-emphasis"],
        borderWidth: 1,
        borderRadius: scales.borderRadius.lg,
        padding: scales.spacing.scale[4],
        gap: scales.spacing.scale[1],
      }, style]}
    >
      <View style={{ minHeight: labelMinHeight }}>
        <RNText onLayout={onLabelLayout} style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>{label}</RNText>
      </View>
      <RNText style={[resolveTypo("heading.2xl"), { color: theme.text["high-emphasis"] }]}>
        {value}
      </RNText>
      {delta && (
        <RNText style={[resolveTypo("label.sm"), { color: trendColor }]}>
          {trend === "up" ? "▲" : trend === "down" ? "▼" : "■"} {delta}
        </RNText>
      )}
    </View>
  )
}
