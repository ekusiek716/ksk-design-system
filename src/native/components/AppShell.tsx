import React from "react"
import { View, ScrollView } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface AppShellProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  bottomNav?: React.ReactNode
  scrollable?: boolean
  children: React.ReactNode
}

/**
 * モバイルアプリの基本シェル。Header / Body / BottomNav の三段重ね。
 * 上下のSafeAreaは AppHeader / NavigationBar 側で取っている前提。
 */
export function AppShell({
  header,
  footer,
  bottomNav,
  scrollable = true,
  children,
}: AppShellProps) {
  const { theme } = useTheme()
  const body = scrollable ? (
    <ScrollView style={{ flex: 1, backgroundColor: theme.surface.secondary }}>
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, backgroundColor: theme.surface.secondary }}>{children}</View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface.primary }}>
      {header}
      {body}
      {footer}
      {bottomNav}
    </View>
  )
}
