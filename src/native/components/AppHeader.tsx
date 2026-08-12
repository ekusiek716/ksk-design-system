import React from "react"
import { Pressable, View, Text as RNText, Platform } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { useSafeAreaInsets } from "../theme/SafeAreaInsetsProvider"
import { resolveAppHeaderPaddingTop } from "../safe-area"
import { resolveTypo } from "../typography"

export interface AppHeaderProps {
  title?: string
  subtitle?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
  onBack?: () => void
  centered?: boolean
  /**
   * safe-area（ステータスバー・ノッチ）の回避を有効にするか。既定 true。
   * `SafeAreaInsetsProvider` で実測 inset が供給されていればその値を、無ければ
   * 従来の決め打ち（iOS 48 / それ以外は通常余白）を使う。
   * false にすると回避せず通常余白だけになる（消費側が自前でヘッダー上の
   * 余白を管理する場合のオプトアウト）。
   */
  safeArea?: boolean
}

export function AppHeader({
  title,
  subtitle,
  leading,
  trailing,
  onBack,
  centered = true,
  safeArea = true,
}: AppHeaderProps) {
  const { theme, scales } = useTheme()
  const insets = useSafeAreaInsets()
  const left =
    leading ??
    (onBack ? (
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => ({
          padding: scales.spacing.scale[1],
          borderRadius: scales.borderRadius.md,
          backgroundColor: pressed ? theme.surface.secondary : "transparent",
        })}
      >
        <RNText style={[resolveTypo("heading.lg"), { color: theme.text["high-emphasis"] }]}>‹</RNText>
      </Pressable>
    ) : null)

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[2],
        paddingHorizontal: scales.spacing.scale[3],
        paddingTop: resolveAppHeaderPaddingTop({
          insets,
          safeArea,
          isIOS: Platform.OS === "ios",
          fallbackSpacing: scales.spacing.scale[3],
        }),
        paddingBottom: scales.spacing.scale[3],
        backgroundColor: theme.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border["low-emphasis"],
      }}
    >
      <View style={{ width: 44, alignItems: "flex-start" }}>{left}</View>
      <View style={{ flex: 1, alignItems: centered ? "center" : "flex-start" }}>
        {title && (
          <RNText
            numberOfLines={1}
            style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"] }]}
          >
            {title}
          </RNText>
        )}
        {subtitle && (
          <RNText
            numberOfLines={1}
            style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"] }]}
          >
            {subtitle}
          </RNText>
        )}
      </View>
      <View style={{ minWidth: 44, alignItems: "flex-end" }}>{trailing}</View>
    </View>
  )
}
