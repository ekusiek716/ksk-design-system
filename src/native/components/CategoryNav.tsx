import React from "react"
import { Pressable, ScrollView, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface CategoryNavItem {
  key: string
  label: string
  icon?: React.ReactNode
}

export interface CategoryNavProps {
  items: CategoryNavItem[]
  value?: string
  onChange?: (key: string) => void
}

/** 横並び・固定で表示するカテゴリナビ。スクロール可能。 */
export function CategoryNav({ items, value, onChange }: CategoryNavProps) {
  const { theme, scales } = useTheme()
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: scales.spacing.scale[3],
        paddingHorizontal: scales.spacing.scale[4],
        paddingVertical: scales.spacing.scale[2],
      }}
    >
      {items.map((it) => {
        const active = value === it.key
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange?.(it.key)}
            style={{ alignItems: "center", gap: scales.spacing.scale[1], width: 64 }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: active ? theme.brand.primary : theme.surface.secondary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {it.icon}
            </View>
            <RNText
              numberOfLines={1}
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
    </ScrollView>
  )
}
