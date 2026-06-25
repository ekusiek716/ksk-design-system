import React from "react"
import {
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export type ScreenPadding = "none" | "page"

export interface ScreenProps {
  children: React.ReactNode
  footer?: React.ReactNode
  header?: React.ReactNode
  scroll?: boolean
  padding?: ScreenPadding
  style?: StyleProp<ViewStyle>
  bodyStyle?: StyleProp<ViewStyle>
  headerStyle?: StyleProp<ViewStyle>
  footerStyle?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}

function bodyPadding(padding: ScreenPadding, spacing: ReturnType<typeof useTheme>["scales"]["spacing"]) {
  if (padding === "none") return undefined
  return {
    paddingHorizontal: spacing.scale[6],
    paddingVertical: spacing.scale[6],
  }
}

export function Screen({
  children,
  footer,
  header,
  scroll = true,
  padding = "page",
  style,
  bodyStyle,
  headerStyle,
  footerStyle,
  contentContainerStyle,
}: ScreenProps) {
  const { theme, scales } = useTheme()
  const baseBodyStyle = [
    {
      flex: 1,
      minHeight: 0,
      backgroundColor: theme.surface.primary,
    },
    bodyStyle,
  ]
  const paddedContentStyle = [
    bodyPadding(padding, scales.spacing),
    contentContainerStyle,
  ]

  return (
    <View
      style={[
        {
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          backgroundColor: theme.surface.primary,
        },
        style,
      ]}
    >
      {header && <View style={[{ flexShrink: 0 }, headerStyle]}>{header}</View>}
      {scroll ? (
        <ScrollView
          style={baseBodyStyle}
          contentContainerStyle={paddedContentStyle}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[baseBodyStyle, bodyPadding(padding, scales.spacing), contentContainerStyle]}>
          {children}
        </View>
      )}
      {footer && (
        <View
          style={[
            {
              flexShrink: 0,
              backgroundColor: theme.surface.primary,
              paddingHorizontal: scales.spacing.scale[6],
              paddingTop: scales.spacing.scale[3],
              paddingBottom: scales.spacing.scale[4],
            },
            footerStyle,
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  )
}
