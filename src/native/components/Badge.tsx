import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type BadgeTone = "neutral" | "accent" | "success" | "caution" | "warning" | "info"

export interface BadgeProps {
  tone?: BadgeTone
  children: React.ReactNode
}

/** status / accent を surface + text トークンで塗り分けるピル。 */
export function Badge({ tone = "neutral", children }: BadgeProps) {
  const { theme, scales } = useTheme()

  const map: Record<BadgeTone, { bg: string; fg: string }> = {
    neutral: { bg: theme.surface.tertiary, fg: theme.text["medium-emphasis"] },
    accent: { bg: theme.surface["accent-primary-light"], fg: theme.text["accent-primary"] },
    success: { bg: theme.surface.success, fg: theme.text.success },
    caution: { bg: theme.surface.caution, fg: theme.text.caution },
    warning: { bg: theme.surface.warning, fg: theme.text.warning },
    info: { bg: theme.surface.info, fg: theme.text.info },
  }
  const c = map[tone]

  return (
    <View
      style={{
        backgroundColor: c.bg,
        borderRadius: scales.borderRadius.full,
        paddingVertical: scales.spacing.scale[1],
        paddingHorizontal: scales.spacing.scale[3],
        alignSelf: "flex-start",
      }}
    >
      <RNText style={[resolveTypo("label.sm"), { color: c.fg }]}>{children}</RNText>
    </View>
  )
}
