import React from "react"
import { Pressable, View, Text as RNText, Platform } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

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
}

/**
 * Webの「ヘッダ型ナビゲーション」をRNで意味変換した BottomTabs風 ナビ。
 * 画面下部に固定して使う想定。
 */
export function NavigationBar({ items, value, onChange }: NavigationBarProps) {
  const { theme, scales } = useTheme()

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.surface.primary,
        borderTopWidth: 1,
        borderTopColor: theme.border["low-emphasis"],
        paddingBottom: Platform.OS === "ios" ? 24 : 0,
      }}
    >
      {items.map((it) => {
        const active = value === it.key
        return (
          <Pressable
            key={it.key}
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
