import React, { useEffect, useState } from "react"
import { Keyboard, Platform, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { GlassView } from "./GlassView"

export type KeyboardAwareSheetFooterBehavior = "fixed" | "hide" | "scroll"
export type SheetSurface = "default" | "glass"

export interface KeyboardAwareSheetFooterProps {
  behavior?: KeyboardAwareSheetFooterBehavior
  hideWhenInputFocused?: boolean
  surface?: SheetSurface
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function KeyboardAwareSheetFooter({
  behavior = "fixed",
  hideWhenInputFocused = behavior === "hide",
  surface = "default",
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

  const footerStyle: ViewStyle = {
    flexDirection: "row",
    gap: scales.spacing.scale[3],
    paddingHorizontal: scales.spacing.scale[5],
    paddingTop: scales.spacing.scale[3],
    paddingBottom: Platform.OS === "ios" ? 28 : scales.spacing.scale[4],
    backgroundColor: surface === "glass" ? "transparent" : theme.surface.primary,
    borderTopWidth: behavior === "scroll" ? 0 : 1,
    borderTopColor: theme.border["low-emphasis"],
  }

  if (surface === "glass") {
    return (
      <GlassView
        intensity="thick"
        borderRadius={0}
        showRim={false}
        style={[footerStyle, style]}
      >
        {children}
      </GlassView>
    )
  }

  return (
    <View style={[footerStyle, style]}>
      {children}
    </View>
  )
}
