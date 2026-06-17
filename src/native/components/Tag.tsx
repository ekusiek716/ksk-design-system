import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type TagTone = "neutral" | "accent" | "success" | "caution" | "warning" | "info"
export type TagVariant = "filled" | "outline"

export interface TagProps {
  tone?: TagTone
  variant?: TagVariant
  children: React.ReactNode
}

/** 表示専用ラベル。Chip と違いインタラクション無し。 */
export function Tag({ tone = "neutral", variant = "filled", children }: TagProps) {
  const { theme, scales } = useTheme()

  const fills: Record<TagTone, { bg: string; fg: string }> = {
    neutral: { bg: theme.surface.tertiary, fg: theme.text["medium-emphasis"] },
    accent: { bg: theme.surface["accent-primary-light"], fg: theme.text["accent-primary"] },
    success: { bg: theme.surface.success, fg: theme.text.success },
    caution: { bg: theme.surface.caution, fg: theme.text.caution },
    warning: { bg: theme.surface.warning, fg: theme.text.warning },
    info: { bg: theme.surface.info, fg: theme.text.info },
  }
  const outlines: Record<TagTone, { fg: string; border: string }> = {
    neutral: { fg: theme.text["medium-emphasis"], border: theme.border["medium-emphasis"] },
    accent: { fg: theme.text["accent-primary"], border: theme.border["accent-primary"] },
    success: { fg: theme.text.success, border: theme.border.success },
    caution: { fg: theme.text.caution, border: theme.border.caution },
    warning: { fg: theme.text.warning, border: theme.border.warning },
    info: { fg: theme.text.info, border: theme.border.info },
  }

  const c = variant === "filled" ? fills[tone] : null
  const o = variant === "outline" ? outlines[tone] : null

  return (
    <View
      style={{
        backgroundColor: c?.bg ?? "transparent",
        borderColor: o?.border,
        borderWidth: variant === "outline" ? 1 : 0,
        borderRadius: scales.borderRadius.sm,
        paddingVertical: scales.spacing.scale[1],
        paddingHorizontal: scales.spacing.scale[2],
        alignSelf: "flex-start",
      }}
    >
      <RNText style={[resolveTypo("label.xs"), { color: c?.fg ?? o?.fg ?? theme.text["medium-emphasis"] }]}>
        {children}
      </RNText>
    </View>
  )
}
