import React from "react"
import { View, type AccessibilityRole, type AccessibilityValue } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import {
  getProgressAccessibilityValue,
  resolveProgressPct,
  resolveProgressVariant,
  type ProgressAutoColorConfig,
  type ProgressTone,
  type ProgressVariant,
} from "../progress-logic"

export type { ProgressAutoColorConfig, ProgressTone, ProgressVariant }

/**
 * native Progress の読み上げ系 props（issue #796。ProgressRing #564 と同じ方式）。
 * Web は Radix の Root が role="progressbar" と aria-* を持つので、Native だけの受け口。
 */
export interface ProgressAccessibilityProps {
  /**
   * ルート View をひとつの読み上げ要素にまとめる。
   *
   * 既定（未指定）は `true`。Web の `role="progressbar"` と同じく、バー全体をひとつの進捗として読ませる。
   * バーを含むカード側で説明文を組み立てている場合は `accessible={false}` を渡す。
   * このとき役割・値・名前の既定も付かず、#796 以前と同じ（読み上げに何も出さない）結果になる。
   */
  accessible?: boolean
  /** ルート View の読み上げ名。既定は `"進捗"`（Web の既定 aria-label と同じ。issue #796）。 */
  accessibilityLabel?: string
  /** ルート View の役割。既定は `"progressbar"`（issue #796）。明示した値が優先される。 */
  accessibilityRole?: AccessibilityRole
  /**
   * ルート View の読み上げ値。既定は `{ min: 0, max, now: <0〜max にクランプした value> }`（issue #796）。
   * masked 時は `{ min: 0, max: 100 }`（now なし）。明示した値が優先される。
   */
  accessibilityValue?: AccessibilityValue
}

export interface ProgressProps extends ProgressAccessibilityProps {
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
   * 読み上げ値も `now` を含めない（issue #796）。
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
  accessible,
  accessibilityLabel,
  accessibilityRole,
  accessibilityValue,
}: ProgressProps) {
  const { theme, scales } = useTheme()
  const pct = resolveProgressPct(value, max, masked)
  const resolvedVariant = resolveProgressVariant(pct, tone, variant, autoColor, masked)

  // 読み上げの既定（issue #796）。accessible={false} のときは役割・値・名前の既定を付けない。
  const isAccessibleGroup = accessible ?? true
  const resolvedAccessibilityRole = isAccessibleGroup
    ? (accessibilityRole ?? "progressbar")
    : accessibilityRole
  const resolvedAccessibilityValue = isAccessibleGroup
    ? (accessibilityValue ?? getProgressAccessibilityValue(value, max, masked))
    : accessibilityValue
  const resolvedAccessibilityLabel = isAccessibleGroup
    ? (accessibilityLabel ?? "進捗")
    : accessibilityLabel

  const fill = {
    default: theme.brand.primary,
    success: theme.success.base,
    warning: theme.warning.base,
    caution: theme.caution.base,
  }[resolvedVariant]

  return (
    <View
      accessible={isAccessibleGroup}
      accessibilityRole={resolvedAccessibilityRole}
      accessibilityValue={resolvedAccessibilityValue}
      accessibilityLabel={resolvedAccessibilityLabel}
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
