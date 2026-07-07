import React from "react"
import { View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import {
  resolveProgressPct,
  resolveProgressVariant,
  type ProgressAutoColorConfig,
  type ProgressTone,
  type ProgressVariant,
} from "../progress-logic"

export type { ProgressAutoColorConfig, ProgressTone, ProgressVariant }

export interface ProgressProps {
  value: number
  max?: number
  height?: number
  /** @deprecated Use variant instead. Kept for existing RN consumers. */
  tone?: ProgressTone
  variant?: ProgressVariant
  autoColor?: boolean | ProgressAutoColorConfig
  /**
   * true のとき、実 value に依存しない見た目にする（バー幅を固定表示にする）。
   * 未課金ユーザー向けティザー表示等、value からバー幅経由で実データを逆算されるのを防ぐための表示専用フラグ。
   * masked 時は value/max/autoColor を無視し、常に同じ幅・同じトーンで描画する。
   */
  masked?: boolean
}

export function Progress({
  value,
  max = 100,
  height = 8,
  tone = "accent",
  variant,
  autoColor,
  masked,
}: ProgressProps) {
  const { theme, scales } = useTheme()
  const pct = resolveProgressPct(value, max, masked)
  const resolvedVariant = resolveProgressVariant(pct, tone, variant, autoColor, masked)

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
