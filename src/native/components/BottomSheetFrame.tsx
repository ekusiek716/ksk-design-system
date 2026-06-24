import React from "react"
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export type BottomSheetFramePreset = "mobile-full" | "mobile-form" | "desktop-floating"

export interface BottomSheetFrameProps {
  preset?: BottomSheetFramePreset
  header?: React.ReactNode
  footer?: React.ReactNode
  scrollable?: boolean
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  bodyStyle?: StyleProp<ViewStyle>
}

export function BottomSheetFrame({
  preset = "mobile-full",
  header,
  footer,
  scrollable = true,
  children,
  style,
  bodyStyle,
}: BottomSheetFrameProps) {
  const { theme, scales } = useTheme()
  const maxHeight = preset === "mobile-form" ? 520 : preset === "desktop-floating" ? 620 : 720
  const body = scrollable ? (
    <ScrollView style={[{ flex: 1 }, bodyStyle]}>
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, bodyStyle]}>{children}</View>
  )

  return (
    <View
      style={[
        {
          maxHeight,
          minHeight: preset === "mobile-full" ? 360 : undefined,
          overflow: "hidden",
          borderRadius: preset === "mobile-full" ? scales.borderRadius["2xl"] : scales.borderRadius.xl,
          backgroundColor: theme.surface.primary,
        },
        style,
      ]}
    >
      {header}
      {body}
      {footer}
    </View>
  )
}
