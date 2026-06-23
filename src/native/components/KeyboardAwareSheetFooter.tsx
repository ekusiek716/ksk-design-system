import React, { useEffect, useState } from "react"
import { Keyboard, Platform, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export type KeyboardAwareSheetFooterBehavior = "fixed" | "hide" | "scroll"

export interface KeyboardAwareSheetFooterProps {
  behavior?: KeyboardAwareSheetFooterBehavior
  hideWhenInputFocused?: boolean
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function KeyboardAwareSheetFooter({
  behavior = "fixed",
  hideWhenInputFocused = behavior === "hide",
  children,
  style,
}: KeyboardAwareSheetFooterProps) {
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

  if (hideWhenInputFocused && keyboardOpen) return null

  return (
    <View
      style={[
        {
          flexDirection: "row",
          gap: scales.spacing.scale[3],
          paddingHorizontal: scales.spacing.scale[5],
          paddingTop: scales.spacing.scale[3],
          paddingBottom: Platform.OS === "ios" ? 28 : scales.spacing.scale[4],
          backgroundColor: theme.surface.primary,
          borderTopWidth: behavior === "scroll" ? 0 : 1,
          borderTopColor: theme.border["low-emphasis"],
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
