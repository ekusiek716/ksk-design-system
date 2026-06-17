import React from "react"
import { Pressable, Text as RNText, View, type PressableProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { GlassView } from "./GlassView"

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive" | "glass"

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  variant?: ButtonVariant
  children: React.ReactNode
}

/** variant を semantic トークン（brand / active / caution / border）で表現するボタン。 */
export function Button({ variant = "primary", children, ...rest }: ButtonProps) {
  const { theme, scales, mode } = useTheme()

  const palette: Record<Exclude<ButtonVariant, "glass">, { bg: string; bgActive: string; fg: string; border: string }> = {
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

  // ── glass variant ──
  // iOS 26 Liquid Glass を消費する装飾系ボタン。背景が暗い画像/ヒーロー上で使う想定。
  if (variant === "glass") {
    const fg = mode === "dark" ? theme.text["high-emphasis"] : theme.text["high-emphasis"]
    return (
      <Pressable
        style={{
          minHeight: scales.touchTargets.buttonCTA.min,
          borderRadius: scales.borderRadius.full,
          overflow: "hidden",
        }}
        {...rest}
      >
        {({ pressed }) => (
          <GlassView
            intensity="regular"
            borderRadius={scales.borderRadius.full}
            style={{
              minHeight: scales.touchTargets.buttonCTA.min,
              paddingHorizontal: scales.spacing.scale[5],
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale: pressed ? 0.96 : 1 }],
            }}
          >
            <RNText style={[resolveTypo("label.md"), { color: fg }]}>{children}</RNText>
          </GlassView>
        )}
      </Pressable>
    )
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
