import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type SocialProvider = "google" | "apple" | "line" | "amazon" | "github" | "x"

export interface SocialLoginButtonProps {
  provider: SocialProvider
  label?: string
  onPress?: () => void
  disabled?: boolean
}

const defaultLabels: Record<SocialProvider, string> = {
  google: "Google でログイン",
  apple: "Apple でログイン",
  line: "LINE でログイン",
  amazon: "Amazon でログイン",
  github: "GitHub でログイン",
  x: "X でログイン",
}

export function SocialLoginButton({
  provider,
  label,
  onPress,
  disabled = false,
}: SocialLoginButtonProps) {
  const { theme, scales } = useTheme()
  const external = scales.brandExternal

  // 固定のブランド色面（line / amazon）の上の文字は mode に関わらず白にする。
  // text["on-inverse"] は dark で黒系に反転するため、固定面と組むと読めなくなる（issue #595）。
  // apple は Apple HIG に従い dark で白ボタンへ反転する専用トークンを使う。
  const onFixedBrand = theme.text["on-media"]

  const styleMap = {
    google: {
      bg: theme.surface.primary,
      fg: theme.text["high-emphasis"],
      border: external.googleBorder,
    },
    apple: {
      bg: theme.brand["apple-surface"],
      fg: theme.brand["on-apple"],
      border: theme.brand["apple-surface"],
    },
    line: {
      bg: external.line,
      fg: onFixedBrand,
      border: external.line,
    },
    amazon: {
      bg: external.amazon,
      fg: onFixedBrand,
      border: external.amazon,
    },
    github: {
      bg: theme.surface.inverse,
      fg: theme.text["on-inverse"],
      border: theme.surface.inverse,
    },
    x: {
      bg: theme.surface.inverse,
      fg: theme.text["on-inverse"],
      border: theme.surface.inverse,
    },
  }[provider]

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        minHeight: scales.touchTargets.buttonCTA.min,
        paddingHorizontal: scales.spacing.scale[5],
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scales.borderRadius.lg,
        borderWidth: 1,
        backgroundColor: styleMap.bg,
        borderColor: styleMap.border,
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: scales.spacing.scale[2] }}>
        <RNText style={[resolveTypo("label.md"), { color: styleMap.fg }]}>
          {label ?? defaultLabels[provider]}
        </RNText>
      </View>
    </Pressable>
  )
}
