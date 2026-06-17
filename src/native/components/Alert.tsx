import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type AlertTone = "info" | "success" | "warning" | "caution"

export interface AlertProps {
  tone?: AlertTone
  title?: string
  description?: string
  children?: React.ReactNode
}

export function Alert({ tone = "info", title, description, children }: AlertProps) {
  const { theme, scales } = useTheme()
  const palette = {
    info: { bg: theme.surface.info, fg: theme.text.info, border: theme.border.info },
    success: { bg: theme.surface.success, fg: theme.text.success, border: theme.border.success },
    warning: { bg: theme.surface.warning, fg: theme.text.warning, border: theme.border.warning },
    caution: { bg: theme.surface.caution, fg: theme.text.caution, border: theme.border.caution },
  }[tone]

  return (
    <View
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        borderLeftWidth: 4,
        borderRadius: scales.borderRadius.md,
        padding: scales.spacing.scale[3],
        gap: scales.spacing.scale[1],
      }}
    >
      {title && (
        <RNText style={[resolveTypo("label.md"), { color: palette.fg }]}>{title}</RNText>
      )}
      {description && (
        <RNText style={[resolveTypo("body.sm"), { color: theme.text["high-emphasis"] }]}>
          {description}
        </RNText>
      )}
      {children}
    </View>
  )
}
