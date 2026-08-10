import React from "react"
import { ActivityIndicator } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export type SpinnerSize = "sm" | "md" | "lg"

export interface SpinnerProps {
  size?: SpinnerSize
  color?: string
  /**
   * スクリーンリーダー向けローディングラベル。
   * i18n 対応: 英語では "Loading" を渡す。
   * @default "読み込み中"
   */
  label?: string
}

export function Spinner({ size = "md", color, label = "読み込み中" }: SpinnerProps) {
  const { theme } = useTheme()
  return (
    <ActivityIndicator
      size={size === "sm" ? "small" : "large"}
      color={color ?? theme.brand.primary}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      aria-label={label}
    />
  )
}
