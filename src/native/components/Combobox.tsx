import React, { useMemo, useState } from "react"
import { Pressable, Text as RNText, View, FlatList } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Sheet } from "./Sheet"
import { Input } from "./Input"

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "選択",
  searchPlaceholder = "検索",
  emptyMessage = "該当なし",
  disabled = false,
}: ComboboxProps) {
  const { theme, scales } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  return (
    <>
      <Pressable
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: scales.touchTargets.textInput.min,
          paddingHorizontal: scales.spacing.scale[3],
          borderRadius: scales.borderRadius.md,
          borderWidth: 1,
          borderColor: theme.border["medium-emphasis"],
          backgroundColor: disabled ? theme.surface.disable : theme.surface.primary,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <RNText
          style={[
            resolveTypo("body.md"),
            { color: selected ? theme.text["high-emphasis"] : theme.text["low-emphasis"] },
          ]}
        >
          {selected ? selected.label : placeholder}
        </RNText>
        <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>▾</RNText>
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} side="bottom" title="選択">
        <Input value={query} onChangeText={setQuery} placeholder={searchPlaceholder} />
        <View style={{ height: 360, marginTop: scales.spacing.scale[2] }}>
          {filtered.length === 0 ? (
            <RNText
              style={[
                resolveTypo("body.md"),
                {
                  color: theme.text["low-emphasis"],
                  textAlign: "center",
                  paddingVertical: scales.spacing.scale[6],
                },
              ]}
            >
              {emptyMessage}
            </RNText>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(it) => it.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange?.(item.value)
                    setQuery("")
                    setOpen(false)
                  }}
                  style={({ pressed }) => ({
                    paddingVertical: scales.spacing.scale[3],
                    paddingHorizontal: scales.spacing.scale[2],
                    backgroundColor: pressed ? theme.surface.secondary : "transparent",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  })}
                >
                  <RNText style={[resolveTypo("body.md"), { color: theme.text["high-emphasis"] }]}>
                    {item.label}
                  </RNText>
                  {value === item.value && (
                    <RNText style={[resolveTypo("label.md"), { color: theme.text["accent-primary"] }]}>
                      ✓
                    </RNText>
                  )}
                </Pressable>
              )}
            />
          )}
        </View>
      </Sheet>
    </>
  )
}
