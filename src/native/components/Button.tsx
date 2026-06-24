import React from "react"
import {
  ActivityIndicator,
  Pressable,
  Text as RNText,
  View,
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
  /** leading icon slot. children は text または ReactNode のどちらでも可 */
  leadingIcon?: React.ReactNode
  /** trailing icon slot. children は text または ReactNode のどちらでも可 */
  trailingIcon?: React.ReactNode
  /** loading=true で spinner を表示し、button を busy/disabled として扱う */
  loading?: boolean
  /** loading 中も読み上げ/表示したい label。未指定なら spinner のみ */
  loadingLabel?: string
  children?: React.ReactNode
}

/** variant を semantic トークン（brand / active / caution / border）で表現するボタン。 */
export function Button({
  variant = "primary",
  elevation = "flat",
  containerStyle,
  pressedContainerStyle,
  textStyle,
  leadingIcon,
  trailingIcon,
  loading = false,
  loadingLabel,
  children,
  disabled,
  accessibilityState,
  ...rest
}: ButtonProps) {
  const { theme, scales, mode } = useTheme()
  const effectiveDisabled = disabled || loading

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
        disabled={effectiveDisabled}
        accessibilityState={{ ...accessibilityState, disabled: effectiveDisabled, busy: loading || undefined }}
        style={{
          minHeight: scales.touchTargets.buttonCTA.min,
          borderRadius: scales.borderRadius.full,
          overflow: "hidden",
          opacity: effectiveDisabled ? 0.56 : 1,
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
              flexDirection: "row",
              gap: scales.spacing.scale[2],
              transform: [{ scale: pressed ? 0.96 : 1 }],
            }}
          >
            <ButtonContent
              color={fg}
              textStyle={textStyle}
              loading={loading}
              loadingLabel={loadingLabel}
              leadingIcon={leadingIcon}
              trailingIcon={trailingIcon}
              gap={scales.spacing.scale[2]}
            >
              {children}
            </ButtonContent>
          </GlassView>
        )}
      </Pressable>
    )
  }

  const p = palette[variant]
  const elev = scales.elevation[elevation]

  return (
    <Pressable
      disabled={effectiveDisabled}
      accessibilityState={{ ...accessibilityState, disabled: effectiveDisabled, busy: loading || undefined }}
      style={({ pressed }) => [
        {
          minHeight: scales.touchTargets.buttonCTA.min,
          paddingHorizontal: scales.spacing.scale[5],
          justifyContent: "center",
          alignItems: "center",
          borderRadius: scales.borderRadius.lg,
          borderWidth: 1,
          backgroundColor: pressed && !effectiveDisabled ? p.bgActive : p.bg,
          borderColor: p.border,
          opacity: effectiveDisabled ? 0.56 : 1,
        },
        // raised: 下辺に厚みのある border を載せ、押下時に消して translateY で沈める
        elevation === "raised" && {
          borderBottomWidth: pressed && !effectiveDisabled ? 0 : elev.bottomBorderWidth,
          borderBottomColor: p.bottomBorder,
          transform: [{ translateY: pressed && !effectiveDisabled ? elev.offset : 0 }],
          // raised 状態は下辺分の余白を本体に補填（押下で寸法が変わらないよう margin で吸収）
          marginBottom: pressed && !effectiveDisabled ? elev.bottomBorderWidth : 0,
        },
        containerStyle,
        pressed && !effectiveDisabled && pressedContainerStyle,
      ]}
      {...rest}
    >
      <ButtonContent
        color={p.fg}
        textStyle={textStyle}
        loading={loading}
        loadingLabel={loadingLabel}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        gap={scales.spacing.scale[2]}
      >
        {children}
      </ButtonContent>
    </Pressable>
  )
}

function ButtonContent({
  color,
  textStyle,
  loading,
  loadingLabel,
  leadingIcon,
  trailingIcon,
  gap,
  children,
}: {
  color: string
  textStyle?: StyleProp<TextStyle>
  loading: boolean
  loadingLabel?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  gap: number
  children?: React.ReactNode
}) {
  const labelStyle = [resolveTypo("label.md"), { color }, textStyle]

  if (loading) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap }}>
        <ActivityIndicator size="small" color={color} />
        {loadingLabel ? <RNText style={labelStyle}>{loadingLabel}</RNText> : null}
      </View>
    )
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap }}>
      {leadingIcon}
      {renderButtonChildren(children, labelStyle)}
      {trailingIcon}
    </View>
  )
}

function renderButtonChildren(children: React.ReactNode, labelStyle: StyleProp<TextStyle>) {
  return React.Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <RNText style={labelStyle}>{child}</RNText>
    }
    return child
  })
}
