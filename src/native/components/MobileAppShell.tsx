import React from "react"
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export type MobileAppShellBottomPadding = "none" | "bottom-nav" | "bottom-nav-fab"

export interface MobileAppShellProps {
  header?: React.ReactNode
  bottomNav?: React.ReactNode
  fab?: React.ReactNode
  desktopSidebar?: React.ReactNode
  scrollable?: boolean
  bottomPadding?: MobileAppShellBottomPadding
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
}

export function MobileAppShell({
  header,
  bottomNav,
  fab,
  desktopSidebar,
  scrollable = true,
  bottomPadding = fab ? "bottom-nav-fab" : bottomNav ? "bottom-nav" : "none",
  children,
  style,
  contentStyle,
}: MobileAppShellProps) {
  const { theme, scales } = useTheme()
  const paddingBottom =
    bottomPadding === "bottom-nav-fab"
      ? scales.spacing.scale[15]
      : bottomPadding === "bottom-nav"
        ? scales.spacing.scale[12]
        : 0
  const bodyStyle = [
    {
      flex: 1,
      backgroundColor: theme.surface.secondary,
      paddingBottom,
    },
    contentStyle,
  ]
  const body = scrollable ? (
    <ScrollView style={bodyStyle}>
      {children}
    </ScrollView>
  ) : (
    <View style={bodyStyle}>{children}</View>
  )

  return (
    <View style={[{ flex: 1, flexDirection: "row", backgroundColor: theme.surface.primary }, style]}>
      {desktopSidebar}
      <View style={{ flex: 1, minWidth: 0, backgroundColor: theme.surface.primary }}>
        {header}
        {body}
        {bottomNav}
        {fab}
      </View>
    </View>
  )
}
