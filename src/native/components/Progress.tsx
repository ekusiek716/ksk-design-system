import React from "react"
import { View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export type ProgressVariant = "default" | "success" | "warning" | "caution"
export type ProgressTone = "accent" | "success" | "caution" | "warning"

export interface ProgressAutoColorConfig {
  successBelow?: number
  warningFrom?: number
  warningBelow?: number
  cautionFrom?: number
}

export interface ProgressProps {
  value: number
  max?: number
  height?: number
  /** @deprecated Use variant instead. Kept for existing RN consumers. */
  tone?: ProgressTone
  variant?: ProgressVariant
  autoColor?: boolean | ProgressAutoColorConfig
}

const DEFAULT_AUTO_COLOR: ProgressAutoColorConfig = {
  warningFrom: 80,
  cautionFrom: 100,
}

function toneToVariant(tone: ProgressTone): ProgressVariant {
  if (tone === "accent") return "default"
  return tone
}

function getAutoProgressVariant(
  value: number,
  fallback: ProgressVariant,
  autoColor: boolean | ProgressAutoColorConfig | undefined
): ProgressVariant {
  if (!autoColor) return fallback
  const config: ProgressAutoColorConfig =
    autoColor === true ? DEFAULT_AUTO_COLOR : { ...DEFAULT_AUTO_COLOR, ...autoColor }

  if (config.successBelow != null && value < config.successBelow) return "success"
  if (config.cautionFrom != null && value >= config.cautionFrom) return "caution"
  if (config.warningFrom != null && value >= config.warningFrom) return "warning"
  if (config.warningBelow != null && value < config.warningBelow) return "warning"
  return fallback
}

export function Progress({
  value,
  max = 100,
  height = 8,
  tone = "accent",
  variant,
  autoColor,
}: ProgressProps) {
  const { theme, scales } = useTheme()
  const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100))
  const resolvedVariant = getAutoProgressVariant(pct, variant ?? toneToVariant(tone), autoColor)

  const fill = {
    default: theme.brand.primary,
    success: theme.success.base,
    warning: theme.warning.base,
    caution: theme.caution.base,
  }[resolvedVariant]

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
