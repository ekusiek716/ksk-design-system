import React from "react"
import { Pressable, ScrollView, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface CategoryScrollItem {
  key: string
  label: string
  count?: number
}

export interface CategoryScrollProps {
  items: CategoryScrollItem[]
  value?: string
  onChange?: (key: string) => void
}

/** Pill 形のカテゴリ横スクロール。CategoryNav と違い見た目はテキストチップ。 */
export function CategoryScroll({ items, value, onChange }: CategoryScrollProps) {
  const { theme, scales } = useTheme()
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: scales.spacing.scale[2],
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
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingHorizontal: scales.spacing.scale[3],
              height: 36,
              borderRadius: scales.borderRadius.full,
              backgroundColor: active
                ? theme.brand.primary
                : pressed
                ? theme.surface.tertiary
                : theme.surface.secondary,
            })}
          >
            <RNText
              style={[
                resolveTypo("label.sm"),
                {
                  color: active ? theme.text["on-inverse"] : theme.text["high-emphasis"],
                  fontWeight: active ? "700" : "500",
                },
              ]}
            >
              {it.label}
            </RNText>
            {it.count !== undefined && (
              <View
                style={{
                  paddingHorizontal: 6,
                  borderRadius: 999,
                  backgroundColor: active ? theme.surface.primary : theme.surface.tertiary,
                  minWidth: 20,
                  alignItems: "center",
                }}
              >
                <RNText
                  style={[
                    resolveTypo("label.xs"),
                    { color: active ? theme.text["accent-primary"] : theme.text["medium-emphasis"] },
                  ]}
                >
                  {it.count}
                </RNText>
              </View>
            )}
          </Pressable>
        )
      })}
    </ScrollView>
  )
}
