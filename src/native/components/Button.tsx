import React from "react"
import {
  Pressable,
  Text as RNText,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { GlassView } from "./GlassView"

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive" | "glass"

/**
 * elevation トークン（scales.elevation）:
 *   - flat   : 標準（border なし、押下時 transform なし）
 *   - raised : 下辺に濃い border + 押下で translateY して沈む 3D 風（Duolingo / Material You で一般的）
 *
 * 下辺色は variant の active-button トークンを自動で使う（ハードコード無し）。
 */
export type ButtonElevation = "flat" | "raised"

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  variant?: ButtonVariant
  /** 立体感。default 'flat'。トークン scales.elevation で量を管理 */
  elevation?: ButtonElevation
  /** コンテナの style を上書きするポイント（DS の標準を保持しつつ微調整したい時） */
  containerStyle?: StyleProp<ViewStyle>
  /** 押下時の style を上書きするポイント */
  pressedContainerStyle?: StyleProp<ViewStyle>
  /** 内部 Text の style を上書きするポイント */
  textStyle?: StyleProp<TextStyle>
  children: React.ReactNode
}

/** variant を semantic トークン（brand / active / caution / border）で表現するボタン。 */
export function Button({
  variant = "primary",
  elevation = "flat",
  containerStyle,
  pressedContainerStyle,
  textStyle,
  children,
  ...rest
}: ButtonProps) {
  const { theme, scales, mode } = useTheme()

  const palette: Record<
    Exclude<ButtonVariant, "glass">,
    { bg: string; bgActive: string; fg: string; border: string; bottomBorder: string }
  > = {
    primary: {
      bg: theme.brand.primary,
      bgActive: theme.active["primary-button"],
      fg: theme.text["on-inverse"],
      border: theme.brand.primary,
      bottomBorder: theme.active["primary-button"],
    },
    secondary: {
      bg: theme.surface["accent-primary-light"],
      bgActive: theme.active["secondary-button"],
      fg: theme.text["accent-primary"],
      border: theme.border["accent-primary"],
      bottomBorder: theme.active["secondary-button"],
    },
    tertiary: {
      bg: theme.surface.secondary,
      bgActive: theme.active["tertiary-button"],
      fg: theme.text["high-emphasis"],
      border: theme.border["low-emphasis"],
      bottomBorder: theme.active["tertiary-button"],
    },
    destructive: {
      bg: theme.caution.base,
      bgActive: theme.caution.action,
      fg: theme.text["on-inverse"],
      border: theme.caution.base,
      bottomBorder: theme.caution.action,
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
            <RNText style={[resolveTypo("label.md"), { color: fg }, textStyle]}>{children}</RNText>
          </GlassView>
        )}
      </Pressable>
    )
  }

  const p = palette[variant]
  const elev = scales.elevation[elevation]

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
          backgroundColor: pressed ? p.bgActive : p.bg,
          borderColor: p.border,
        },
        // raised: 下辺に厚みのある border を載せ、押下時に消して translateY で沈める
        elevation === "raised" && {
          borderBottomWidth: pressed ? 0 : elev.bottomBorderWidth,
          borderBottomColor: p.bottomBorder,
          transform: [{ translateY: pressed ? elev.offset : 0 }],
          // raised 状態は下辺分の余白を本体に補填（押下で寸法が変わらないよう margin で吸収）
          marginBottom: pressed ? elev.bottomBorderWidth : 0,
        },
        containerStyle,
        pressed && pressedContainerStyle,
      ]}
      {...rest}
    >
      <RNText style={[resolveTypo("label.md"), { color: p.fg }, textStyle]}>{children}</RNText>
    </Pressable>
  )
}
