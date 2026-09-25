import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type AlertTone = "info" | "success" | "warning" | "caution"

export type AlertVariant = "inline-info" | "inline-warning" | "inline-caution"

export interface AlertProps {
  /** Borderless inline presentation, matching the Web Alert variants. Overrides tone. */
  variant?: AlertVariant
  tone?: AlertTone
  title?: string
  description?: string
  children?: React.ReactNode
}

export function Alert({ tone = "info", variant, title, description, children }: AlertProps) {
  const { theme, scales } = useTheme()
  const effectiveTone = variant ? variant.replace("inline-", "") as AlertTone : tone
  const palette = {
    info: { bg: theme.surface.info, fg: theme.text.info, border: theme.border.info },
    success: { bg: theme.surface.success, fg: theme.text.success, border: theme.border.success },
    warning: { bg: theme.surface.warning, fg: theme.text.warning, border: theme.border.warning },
    caution: { bg: theme.surface.caution, fg: theme.text.caution, border: theme.border.caution },
  }[effectiveTone]
  const inlineInfo = variant === "inline-info"

  return (
    <View
      style={{
        backgroundColor: inlineInfo ? theme.surface.tertiary : palette.bg,
        borderColor: palette.border,
        borderLeftWidth: variant ? 0 : 4,
        borderRadius: variant ? scales.borderRadius.sm : scales.borderRadius.md,
        paddingHorizontal: scales.spacing.scale[3],
        paddingVertical: scales.spacing.scale[variant ? 2 : 3],
        gap: scales.spacing.scale[1],
      }}
    >
      {title && (
        <RNText style={[resolveTypo("label.md"), { color: inlineInfo ? theme.text["high-emphasis"] : palette.fg }]}>{title}</RNText>
      )}
      {description && (
        <RNText style={[resolveTypo("body.sm"), { color: variant ? (inlineInfo ? theme.text["medium-emphasis"] : palette.fg) : theme.text["high-emphasis"] }]}>
          {description}
        </RNText>
      )}
      {children}
    </View>
  )
}
