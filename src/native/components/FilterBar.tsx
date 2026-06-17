import React from "react"
import { Pressable, ScrollView, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface FilterBarFilter {
  key: string
  label: string
  value?: string
  active?: boolean
  onPress?: () => void
}

export interface FilterBarProps {
  filters: FilterBarFilter[]
  sortLabel?: string
  onPressSort?: () => void
}

export function FilterBar({ filters, sortLabel = "並び替え", onPressSort }: FilterBarProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[2],
        paddingHorizontal: scales.spacing.scale[3],
        paddingVertical: scales.spacing.scale[2],
        backgroundColor: theme.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border["low-emphasis"],
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: scales.spacing.scale[2] }}
        style={{ flex: 1 }}
      >
        {filters.map((f) => {
          const active = f.active || !!f.value
          return (
            <Pressable
              key={f.key}
              onPress={f.onPress}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: scales.spacing.scale[3],
                height: 32,
                borderRadius: scales.borderRadius.full,
                borderWidth: 1,
                borderColor: active ? theme.border["accent-primary"] : theme.border["medium-emphasis"],
                backgroundColor: active
                  ? theme.surface["accent-primary-light"]
                  : pressed
                  ? theme.surface.secondary
                  : theme.surface.primary,
              })}
            >
              <RNText
                style={[
                  resolveTypo("label.sm"),
                  { color: active ? theme.text["accent-primary"] : theme.text["high-emphasis"] },
                ]}
              >
                {f.label}
                {f.value ? `: ${f.value}` : ""}
              </RNText>
              <RNText
                style={[
                  resolveTypo("label.xs"),
                  { color: active ? theme.text["accent-primary"] : theme.text["low-emphasis"] },
                ]}
              >
                ▾
              </RNText>
            </Pressable>
          )
        })}
      </ScrollView>
      <Pressable
        onPress={onPressSort}
        style={({ pressed }) => ({
          paddingHorizontal: scales.spacing.scale[2],
          height: 32,
          justifyContent: "center",
          borderRadius: scales.borderRadius.full,
          backgroundColor: pressed ? theme.active["tertiary-button"] : "transparent",
        })}
      >
        <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>
          {sortLabel}
        </RNText>
      </Pressable>
    </View>
  )
}
