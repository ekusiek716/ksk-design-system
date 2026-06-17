import React, { useState } from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Sheet } from "./Sheet"
import { Calendar } from "./Calendar"
import { Button } from "./Button"

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  formatter?: (d: Date) => string
}

function defaultFormat(d: Date) {
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
}

export function DatePicker({
  value,
  onChange,
  placeholder = "日付を選択",
  minDate,
  maxDate,
  disabled = false,
  formatter = defaultFormat,
}: DatePickerProps) {
  const { theme, scales } = useTheme()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Date | undefined>(value)

  return (
    <>
      <Pressable
        onPress={() => {
          if (disabled) return
          setDraft(value)
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
            { color: value ? theme.text["high-emphasis"] : theme.text["low-emphasis"] },
          ]}
        >
          {value ? formatter(value) : placeholder}
        </RNText>
        <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>📅</RNText>
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} side="bottom" title="日付を選択">
        <Calendar value={draft} onChange={setDraft} minDate={minDate} maxDate={maxDate} />
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
              disabled={!draft}
              onPress={() => {
                if (draft) onChange?.(draft)
                setOpen(false)
              }}
            >
              決定
            </Button>
          </View>
        </View>
      </Sheet>
    </>
  )
}
