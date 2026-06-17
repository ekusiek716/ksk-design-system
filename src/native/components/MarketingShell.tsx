import React from "react"
import { View, ScrollView } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface MarketingShellProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  cta?: React.ReactNode
  children: React.ReactNode
}

/** LP/集客系の縦長スクロールシェル。AppShell との違いは BottomNav なし & sticky CTA 領域あり。 */
export function MarketingShell({ header, footer, cta, children }: MarketingShellProps) {
  const { theme } = useTheme()
  return (
    <View style={{ flex: 1, backgroundColor: theme.surface.primary }}>
      {header}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: cta ? 80 : 0 }}>
        {children}
        {footer}
      </ScrollView>
      {cta && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {cta}
        </View>
      )}
    </View>
  )
}
