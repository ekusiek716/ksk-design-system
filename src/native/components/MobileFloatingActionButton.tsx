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

export type MobileFloatingActionButtonPlacement = "end" | "start" | "center"
export type MobileFloatingActionButtonKeyboardBehavior = "hide" | "lift" | "stay"
export type MobileFloatingActionButtonBottomOffset = "none" | "bottom-nav" | "bottom-nav-pill"

export interface MobileFloatingActionButtonProps extends Omit<PressableProps, "children" | "style"> {
  label: string
  icon?: React.ReactNode
  showLabel?: boolean
  placement?: MobileFloatingActionButtonPlacement
  bottomOffset?: MobileFloatingActionButtonBottomOffset
  keyboardBehavior?: MobileFloatingActionButtonKeyboardBehavior
  style?: StyleProp<ViewStyle>
}

export function MobileFloatingActionButton({
  label,
  icon,
  showLabel = false,
  placement = "end",
  bottomOffset = "bottom-nav",
  keyboardBehavior = "hide",
  style,
  ...rest
}: MobileFloatingActionButtonProps) {
  const { theme, scales } = useTheme()
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
    "bottom-nav": 80,
    "bottom-nav-pill": 96,
  }
  const horizontal =
    placement === "center"
      ? { alignSelf: "center" as const }
      : placement === "start"
        ? { left: scales.spacing.scale[4] }
        : { right: scales.spacing.scale[4] }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        {
          position: "absolute",
          bottom: bottomMap[bottomOffset] + (keyboardBehavior === "lift" && keyboardOpen ? 160 : 0),
          minHeight: 48,
          minWidth: showLabel ? 112 : 48,
          paddingHorizontal: showLabel ? scales.spacing.scale[4] : 0,
          borderRadius: scales.borderRadius.full,
          backgroundColor: theme.brand.primary,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: scales.spacing.scale[2],
          opacity: pressed ? 0.85 : 1,
          ...horizontal,
        },
        style,
      ]}
      {...rest}
    >
      <View>{icon ?? <RNText style={[resolveTypo("heading.lg"), { color: theme.text["on-inverse"] }]}>+</RNText>}</View>
      {showLabel && (
        <RNText style={[resolveTypo("label.md"), { color: theme.text["on-inverse"] }]}>
          {label}
        </RNText>
      )}
    </Pressable>
  )
}
