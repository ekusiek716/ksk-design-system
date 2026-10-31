import React from "react"
import { Pressable, View, Text as RNText, Platform } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { useSafeAreaInsets } from "../theme/SafeAreaInsetsProvider"
import { resolveBottomBarPaddingBottom } from "../safe-area"
import { resolveTypo } from "../typography"

/** inset 未供給の iOS で使ってきた下余白（既存 consumer の見た目を変えないための後方互換値）。 */
const IOS_FALLBACK_PADDING_BOTTOM = 24

export interface NavigationBarItem {
  key: string
  label: string
  icon?: React.ReactNode
  badge?: number
  onPress?: () => void
}

export interface NavigationBarProps {
  items: NavigationBarItem[]
  value?: string
  onChange?: (key: string) => void
  /**
   * 下端の safe-area（ホームインジケータ・Android のナビゲーションバー）を避けるか。既定 true（issue #804）。
   * `SafeAreaInsetsProvider` で下端 inset が供給されていれば、下余白をその inset にする。
   * 未供給なら従来の決め打ち（iOS 24 / Android 0）。SafeAreaView や自前の余白で既に避けている画面は
   * 二重取りになるので `false` にする（inset を無視して従来値）。BottomTabBar からも渡せる。
   */
  safeArea?: boolean
}

/**
 * 読み上げ名。ラベルに件数バッジを「（N）」で足す（100 以上は 99+）。
 * Web の BottomTabBar の accessibleName と同じ組み立て（issue #800）。
 */
function navItemAccessibilityLabel(item: NavigationBarItem): string {
  if (item.badge === undefined || item.badge <= 0) return item.label
  return `${item.label}（${item.badge > 99 ? "99+" : item.badge}）`
}

/**
 * Webの「ヘッダ型ナビゲーション」をRNで意味変換した BottomTabs風 ナビ。
 * 画面下部に固定して使う想定。
 *
 * 外枠は `tablist`、各項目は `tab` で、現在の項目に `selected` を既定で持つ（issue #800。
 * FloatingTabBar と同じ）。読み上げ名はラベル + 件数バッジ。
 * 下余白は下端 inset が供給されていればそれ、未供給なら従来値（issue #804）。
 */
export function NavigationBar({ items, value, onChange, safeArea = true }: NavigationBarProps) {
  const { theme, scales } = useTheme()
  const insets = useSafeAreaInsets()
  const paddingBottom = resolveBottomBarPaddingBottom({
    insets,
    safeArea,
    isIOS: Platform.OS === "ios",
    base: 0,
    iosFallback: IOS_FALLBACK_PADDING_BOTTOM,
    androidFallback: 0,
  })

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        backgroundColor: theme.surface.primary,
        borderTopWidth: 1,
        borderTopColor: theme.border["low-emphasis"],
        paddingBottom,
      }}
    >
      {items.map((it) => {
        const active = value === it.key
        return (
          <Pressable
            key={it.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={navItemAccessibilityLabel(it)}
            onPress={() => {
              it.onPress?.()
              onChange?.(it.key)
            }}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: scales.spacing.scale[2],
              backgroundColor: pressed ? theme.surface.secondary : "transparent",
              gap: 2,
              minHeight: scales.touchTargets.navItem.min,
            })}
          >
            <View style={{ position: "relative" }}>
              {it.icon}
              {it.badge !== undefined && it.badge > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -8,
                    minWidth: 16,
                    paddingHorizontal: 4,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: theme.caution.base,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RNText style={[resolveTypo("label.xs"), { color: theme.text["on-inverse"] }]}>
                    {it.badge > 99 ? "99+" : it.badge}
                  </RNText>
                </View>
              )}
            </View>
            <RNText
              style={[
                resolveTypo("label.xs"),
                { color: active ? theme.text["accent-primary"] : theme.text["medium-emphasis"] },
              ]}
            >
              {it.label}
            </RNText>
          </Pressable>
        )
      })}
    </View>
  )
}
