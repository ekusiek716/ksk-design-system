import React from "react"
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native"
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
  /**
   * 本文（header と bottomNav の間）のスタイル。`scrollable`（既定）のときは
   * ScrollView の `contentContainerStyle` に入るので、padding（広告バナー分の
   * `paddingBottom` など）はスクロール範囲に含まれる。`backgroundColor` だけは
   * 本文全体を塗るよう ScrollView の style に入る（#824）。
   * `scrollable={false}` では本文の View の style にそのまま入る。
   */
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
  let body: React.ReactNode
  if (scrollable) {
    // RN のスクロール範囲は中身（contentContainer）の枠で決まり、ScrollView 自身の
    // padding は入らない。下余白と contentStyle の padding 等は contentContainerStyle
    // に入れ、最後の行を FAB / 浮いたタブバーの上までスクロールできるようにする（#824）。
    // 背景色だけは従来どおり本文全体を塗るよう ScrollView の style に残す。
    const { backgroundColor: contentBackground, ...contentLayout } =
      StyleSheet.flatten(contentStyle) ?? {}
    body = (
      <ScrollView
        style={[
          { flex: 1, backgroundColor: theme.surface.secondary },
          contentBackground !== undefined ? { backgroundColor: contentBackground } : null,
        ]}
        contentContainerStyle={[{ paddingBottom }, contentLayout]}
      >
        {children}
      </ScrollView>
    )
  } else {
    body = (
      <View style={[{ flex: 1, backgroundColor: theme.surface.secondary, paddingBottom }, contentStyle]}>
        {children}
      </View>
    )
  }

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
