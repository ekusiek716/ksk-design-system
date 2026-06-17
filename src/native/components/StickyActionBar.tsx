import React from "react"
import { View, Platform } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface StickyActionBarProps {
  children: React.ReactNode
}

/** 画面下に固定する CTA バー。SafeArea 配慮済み。 */
export function StickyActionBar({ children }: StickyActionBarProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        flexDirection: "row",
        gap: scales.spacing.scale[2],
        padding: scales.spacing.scale[4],
        paddingBottom: Platform.OS === "ios" ? 32 : scales.spacing.scale[4],
        backgroundColor: theme.surface.primary,
        borderTopWidth: 1,
        borderTopColor: theme.border["low-emphasis"],
      }}
    >
      {children}
    </View>
  )
}
