import React from "react"
import { Pressable, TextInput, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSubmit?: () => void
  onClear?: () => void
  autoFocus?: boolean
}

export function SearchBar({
  value,
  onChange,
  placeholder = "検索",
  onSubmit,
  onClear,
  autoFocus,
}: SearchBarProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[2],
        paddingHorizontal: scales.spacing.scale[3],
        height: 44,
        backgroundColor: theme.surface.secondary,
        borderRadius: scales.borderRadius.full,
      }}
    >
      <RNText style={[resolveTypo("label.md"), { color: theme.text["low-emphasis"] }]}>🔍</RNText>
      <TextInput
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={theme.text["low-emphasis"]}
        returnKeyType="search"
        autoFocus={autoFocus}
        style={[
          resolveTypo("body.md"),
          { flex: 1, color: theme.text["high-emphasis"], paddingVertical: 0 },
        ]}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => {
            onChange("")
            onClear?.()
          }}
          hitSlop={8}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: theme.surface.tertiary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RNText style={[resolveTypo("label.xs"), { color: theme.text["medium-emphasis"] }]}>×</RNText>
          </View>
        </Pressable>
      )}
    </View>
  )
}
