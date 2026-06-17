import React from "react"
import { ActivityIndicator } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export type SpinnerSize = "sm" | "md" | "lg"

export interface SpinnerProps {
  size?: SpinnerSize
  color?: string
}

export function Spinner({ size = "md", color }: SpinnerProps) {
  const { theme } = useTheme()
  return (
    <ActivityIndicator
      size={size === "sm" ? "small" : "large"}
      color={color ?? theme.brand.primary}
    />
  )
}
