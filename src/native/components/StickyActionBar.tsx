import React from "react"
import { View, Platform } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { useSafeAreaInsets } from "../theme/SafeAreaInsetsProvider"
import { resolveBottomBarPaddingBottom } from "../safe-area"

/** inset 未供給の iOS で使ってきた下余白（既存 consumer の見た目を変えないための後方互換値）。 */
const IOS_FALLBACK_PADDING_BOTTOM = 32

export interface StickyActionBarProps {
  children: React.ReactNode
  /**
   * 下端の safe-area（ホームインジケータ・Android のナビゲーションバー）を避けるか。既定 true（issue #804）。
   * `SafeAreaInsetsProvider` で下端 inset が供給されていれば、下余白を「通常余白（16）+ inset」にする。
   * 未供給なら従来の決め打ち（iOS 32 / Android 16）。SafeAreaView や自前の余白で既に避けている画面は
   * 二重取りになるので `false` にする（inset を無視して従来値）。
   */
  safeArea?: boolean
}

/**
 * 画面下に固定する CTA バー。
 * 下端 inset が `SafeAreaInsetsProvider` で供給されていればそれを下余白に加算し、未供給なら従来値（issue #804）。
 */
export function StickyActionBar({ children, safeArea = true }: StickyActionBarProps) {
  const { theme, scales } = useTheme()
  const insets = useSafeAreaInsets()
  const paddingBottom = resolveBottomBarPaddingBottom({
    insets,
    safeArea,
    isIOS: Platform.OS === "ios",
    base: scales.spacing.scale[4],
    iosFallback: IOS_FALLBACK_PADDING_BOTTOM,
    androidFallback: scales.spacing.scale[4],
  })
  return (
    <View
      style={{
        flexDirection: "row",
        gap: scales.spacing.scale[2],
        padding: scales.spacing.scale[4],
        paddingBottom,
        backgroundColor: theme.surface.primary,
        borderTopWidth: 1,
        borderTopColor: theme.border["low-emphasis"],
      }}
    >
      {children}
    </View>
  )
}
