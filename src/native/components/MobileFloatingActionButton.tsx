import React, { useEffect, useState } from "react"
import {
  Keyboard,
  Pressable,
  Text as RNText,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { GlassView, isNativeLiquidGlassAvailable } from "./GlassView"
import {
  resolveGlassAccentFill,
  resolveGlassAccentHighlight,
  resolveGlassAccentRim,
} from "../glass-accent-fill"

export type MobileFloatingActionButtonPlacement = "end" | "start" | "center"
export type MobileFloatingActionButtonKeyboardBehavior = "hide" | "lift" | "stay"
export type MobileFloatingActionButtonBottomOffset = "none" | "bottom-nav" | "bottom-nav-pill" | "bottom-nav-pill-inline"
export type MobileFloatingActionButtonVariant = "default" | "glass"

export interface MobileFloatingActionButtonProps extends Omit<PressableProps, "children" | "style"> {
  label: string
  icon?: React.ReactNode
  showLabel?: boolean
  placement?: MobileFloatingActionButtonPlacement
  bottomOffset?: MobileFloatingActionButtonBottomOffset
  keyboardBehavior?: MobileFloatingActionButtonKeyboardBehavior
  /**
   * 見た目。既定は `default`（Brand 塗りのソリッド FAB）。
   * `glass` は Brand ティントの Liquid Glass（web の Button `glass-accent` 相当）で、
   * 背後のコンテンツが透けるフローティング表現になる。
   */
  variant?: MobileFloatingActionButtonVariant
  style?: StyleProp<ViewStyle>
  /**
   * `bottomOffset` プリセット値へ加算する追加オフセット（pt）。
   *
   * 画面下に広告バナー（AdMob 等）を出すアプリで、バナーの高さぶん FAB を
   * 持ち上げる用途を想定。既定は未指定（＝加算なし・既存の挙動を変えない）。
   * web 版（`bottomOffsetExtra?: string`＝CSS length）と異なり、native は
   * 数値の pt で受け取る。
   *
   * @example
   * // AdMob バナー（高さは SDK から取得した値）の分だけ FAB を持ち上げる
   * <MobileFloatingActionButton label="追加する" bottomOffsetExtra={admobBannerHeight} />
   */
  bottomOffsetExtra?: number
}

export function MobileFloatingActionButton({
  label,
  icon,
  showLabel = false,
  placement = "end",
  bottomOffset = "bottom-nav",
  keyboardBehavior = "hide",
  variant = "default",
  style,
  bottomOffsetExtra,
  ...rest
}: MobileFloatingActionButtonProps) {
  const { theme, scales, mode } = useTheme()
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true))
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false))
    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  if (keyboardBehavior === "hide" && keyboardOpen) return null

  const bottomMap = {
    none: scales.spacing.scale[4],
    "bottom-nav-pill-inline": scales.spacing.scale[4],
    "bottom-nav": 80,
    "bottom-nav-pill": 96,
  }
  const horizontal =
    placement === "center"
      ? { alignSelf: "center" as const }
      : placement === "start"
        ? { left: scales.spacing.scale[4] }
        : { right: scales.spacing.scale[4] }

  const bottom =
    bottomMap[bottomOffset] +
    (bottomOffsetExtra ?? 0) +
    (keyboardBehavior === "lift" && keyboardOpen ? 160 : 0)
  const radius = scales.borderRadius.full
  const box = {
    minHeight: 48,
    minWidth: showLabel ? 112 : 48,
    paddingHorizontal: showLabel ? scales.spacing.scale[4] : 0,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: "row" as const,
    gap: scales.spacing.scale[2],
  }

  const content = (
    <>
      <View>{icon ?? <RNText style={[resolveTypo("heading.lg"), { color: theme.text["on-inverse"] }]}>+</RNText>}</View>
      {showLabel && (
        <RNText style={[resolveTypo("label.md"), { color: theme.text["on-inverse"] }]}>
          {label}
        </RNText>
      )}
    </>
  )

  // ── glass variant ──
  // web の Button variant="glass-accent" と同じ「ブランド色をほぼ不透明で敷いた Liquid Glass」。
  // 塗りは薄くしないこと（白前景 text.on-inverse のコントラストが落ちる）。詳細は glass-accent-fill.ts。
  if (variant === "glass") {
    const fill = resolveGlassAccentFill({ brandPrimary: theme.brand.primary, mode })
    // iOS 26 の native Liquid Glass では tintColor がブランド色を担うので塗りを重ねない
    // （重ねると native のマテリアルが完全に隠れる）。それ以外の tier では GlassView の
    // expo-blur 分岐が backgroundColor を transparent で上書きするため、style 側で
    // 明示的に塗り直さないと中立色ガラス＋白前景になりコントラストが落ちる。
    const needsExplicitFill = !isNativeLiquidGlassAvailable()

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          {
            position: "absolute",
            bottom,
            borderRadius: radius,
            overflow: "hidden",
            opacity: pressed ? 0.85 : 1,
            ...horizontal,
          },
          style,
        ]}
        {...rest}
      >
        <GlassView
          intensity="regular"
          borderRadius={radius}
          backgroundFill={fill}
          tintColor={theme.brand.primary}
          rimColor={resolveGlassAccentRim(mode)}
          highlightColor={resolveGlassAccentHighlight(mode)}
          style={[box, needsExplicitFill && { backgroundColor: fill }]}
        >
          {content}
        </GlassView>
      </Pressable>
    )
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        {
          position: "absolute",
          bottom,
          borderRadius: radius,
          backgroundColor: theme.brand.primary,
          opacity: pressed ? 0.85 : 1,
          ...box,
          ...horizontal,
        },
        style,
      ]}
      {...rest}
    >
      {content}
    </Pressable>
  )
}
