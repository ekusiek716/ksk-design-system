import React from "react"
import { View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface ProgressProps {
  value: number
  max?: number
  height?: number
  tone?: "accent" | "success" | "caution" | "warning"
}

export function Progress({ value, max = 100, height = 8, tone = "accent" }: ProgressProps) {
  const { theme, scales } = useTheme()
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  const fill = {
    accent: theme.brand.primary,
    success: theme.success.base,
    caution: theme.caution.base,
    warning: theme.warning.base,
  }[tone]

  return (
    <View
      style={{
        width: "100%",
        height,
        borderRadius: scales.borderRadius.full,
        backgroundColor: theme.surface.tertiary,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${pct}%`,
          height: "100%",
          backgroundColor: fill,
          borderRadius: scales.borderRadius.full,
        }}
      />
    </View>
  )
}
