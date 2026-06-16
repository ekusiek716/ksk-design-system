import React from "react"
import { Pressable, Text as RNText, type PressableProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive"

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  variant?: ButtonVariant
  children: React.ReactNode
}

/** variant を semantic トークン（brand / active / caution / border）で表現するボタン。 */
export function Button({ variant = "primary", children, ...rest }: ButtonProps) {
  const { theme, scales } = useTheme()

  const palette: Record<ButtonVariant, { bg: string; bgActive: string; fg: string; border: string }> = {
    primary: {
      bg: theme.brand.primary,
      bgActive: theme.active["primary-button"],
      fg: theme.text["on-inverse"],
      border: theme.brand.primary,
    },
    secondary: {
      bg: theme.surface["accent-primary-light"],
      bgActive: theme.active["secondary-button"],
      fg: theme.text["accent-primary"],
      border: theme.border["accent-primary"],
    },
    tertiary: {
      bg: theme.surface.secondary,
      bgActive: theme.active["tertiary-button"],
      fg: theme.text["high-emphasis"],
      border: theme.border["low-emphasis"],
    },
    destructive: {
      bg: theme.caution.base,
      bgActive: theme.caution.action,
      fg: theme.text["on-inverse"],
      border: theme.caution.base,
    },
  }

  const p = palette[variant]

  return (
    <Pressable
      style={({ pressed }) => [
        {
          minHeight: scales.touchTargets.buttonCTA.min,
          paddingHorizontal: scales.spacing.scale[5],
          justifyContent: "center",
          alignItems: "center",
          borderRadius: scales.borderRadius.lg,
          borderWidth: 1,
        },
        { backgroundColor: pressed ? p.bgActive : p.bg, borderColor: p.border },
      ]}
      {...rest}
    >
      <RNText style={[resolveTypo("label.md"), { color: p.fg }]}>{children}</RNText>
    </Pressable>
  )
}
