import React, { useMemo, useState } from "react"
import { Pressable, Text as RNText, View, FlatList } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Sheet } from "./Sheet"
import { Input } from "./Input"
import { Checkbox } from "./Checkbox"
import { Button } from "./Button"

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  values?: string[]
  onChange?: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  values = [],
  onChange,
  placeholder = "選択",
  searchPlaceholder = "検索",
  disabled = false,
}: MultiSelectProps) {
  const { theme, scales } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState<string[]>(values)

  const filtered = useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const summary =
    values.length === 0
      ? placeholder
      : values.length === 1
      ? options.find((o) => o.value === values[0])?.label ?? placeholder
      : `${values.length}件選択中`

  return (
    <>
      <Pressable
        onPress={() => {
          if (disabled) return
          setDraft(values)
          setOpen(true)
        }}
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
            { color: values.length > 0 ? theme.text["high-emphasis"] : theme.text["low-emphasis"] },
          ]}
        >
          {summary}
        </RNText>
        <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>▾</RNText>
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} side="bottom" title="複数選択">
        <Input value={query} onChangeText={setQuery} placeholder={searchPlaceholder} />
        <View style={{ height: 320, marginTop: scales.spacing.scale[2] }}>
          <FlatList
            data={filtered}
            keyExtractor={(it) => it.value}
            renderItem={({ item }) => {
              const checked = draft.includes(item.value)
              return (
                <Pressable
                  onPress={() => {
                    setDraft((d) =>
                      d.includes(item.value) ? d.filter((v) => v !== item.value) : [...d, item.value],
                    )
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scales.spacing.scale[2],
                    paddingVertical: scales.spacing.scale[3],
                  }}
                >
                  <Checkbox checked={checked} />
                  <RNText style={[resolveTypo("body.md"), { color: theme.text["high-emphasis"], flex: 1 }]}>
                    {item.label}
                  </RNText>
                </Pressable>
              )
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: scales.spacing.scale[2],
            marginTop: scales.spacing.scale[3],
          }}
        >
          <View style={{ flex: 1 }}>
            <Button variant="tertiary" onPress={() => setOpen(false)}>
              キャンセル
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button
              variant="primary"
              onPress={() => {
                onChange?.(draft)
                setOpen(false)
              }}
            >
              適用
            </Button>
          </View>
        </View>
      </Sheet>
    </>
  )
}
