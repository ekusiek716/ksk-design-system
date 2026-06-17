import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  trend?: "up" | "down" | "neutral"
}

export function StatCard({ label, value, delta, trend = "neutral" }: StatCardProps) {
  const { theme, scales } = useTheme()
  const trendColor =
    trend === "up" ? theme.text.success : trend === "down" ? theme.text.caution : theme.text["low-emphasis"]

  return (
    <View
      style={{
        backgroundColor: theme.surface.primary,
        borderColor: theme.border["low-emphasis"],
        borderWidth: 1,
        borderRadius: scales.borderRadius.lg,
        padding: scales.spacing.scale[4],
        gap: scales.spacing.scale[1],
      }}
    >
      <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>{label}</RNText>
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
