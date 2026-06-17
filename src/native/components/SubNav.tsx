import React from "react"
import { Pressable, View, Text as RNText, ScrollView } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface SubNavItem {
  key: string
  label: string
  count?: number
}

export interface SubNavProps {
  items: SubNavItem[]
  value?: string
  onChange?: (key: string) => void
}

/** Webの SubNav を RN の SegmentedTabs 風に意味変換。横スクロール可。 */
export function SubNav({ items, value, onChange }: SubNavProps) {
  const { theme, scales } = useTheme()
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: scales.spacing.scale[3], gap: scales.spacing.scale[2] }}
      style={{
        backgroundColor: theme.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border["low-emphasis"],
      }}
    >
      {items.map((it) => {
        const active = value === it.key
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange?.(it.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scales.spacing.scale[1],
              paddingVertical: scales.spacing.scale[3],
              borderBottomWidth: 2,
              borderBottomColor: active ? theme.brand.primary : "transparent",
            }}
          >
            <RNText
              style={[
                resolveTypo("label.md"),
                {
                  color: active ? theme.text["accent-primary"] : theme.text["medium-emphasis"],
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
                  backgroundColor: active ? theme.surface["accent-primary-light"] : theme.surface.tertiary,
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
