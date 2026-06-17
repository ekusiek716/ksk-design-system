import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface ErrorStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function ErrorState({
  title = "エラーが発生しました",
  description = "時間をおいて再度お試しください。",
  icon,
  action,
}: ErrorStateProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: scales.spacing.scale[8],
        gap: scales.spacing.scale[3],
      }}
    >
      {icon ?? (
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.surface.caution,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RNText style={{ fontSize: 28, color: theme.text.caution }}>!</RNText>
        </View>
      )}
      <RNText
        style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"], textAlign: "center" }]}
      >
        {title}
      </RNText>
      <RNText
        style={[resolveTypo("body.md"), { color: theme.text["medium-emphasis"], textAlign: "center" }]}
      >
        {description}
      </RNText>
      {action}
    </View>
  )
}
