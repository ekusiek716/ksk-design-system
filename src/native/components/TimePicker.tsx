import React, { useState } from "react"
import { Pressable, View, Text as RNText, ScrollView } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Sheet } from "./Sheet"
import { Button } from "./Button"

export interface TimeValue {
  hour: number
  minute: number
}

export interface TimePickerProps {
  value?: TimeValue
  onChange?: (time: TimeValue) => void
  placeholder?: string
  minuteStep?: 1 | 5 | 10 | 15 | 30
  disabled?: boolean
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export function TimePicker({
  value,
  onChange,
  placeholder = "時刻を選択",
  minuteStep = 5,
  disabled = false,
}: TimePickerProps) {
  const { theme, scales } = useTheme()
  const [open, setOpen] = useState(false)
  const [hour, setHour] = useState<number>(value?.hour ?? 9)
  const [minute, setMinute] = useState<number>(value?.minute ?? 0)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep)

  return (
    <>
      <Pressable
        onPress={() => {
          if (disabled) return
          setHour(value?.hour ?? 9)
          setMinute(value?.minute ?? 0)
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
          {value ? `${pad(value.hour)}:${pad(value.minute)}` : placeholder}
        </RNText>
        <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>🕐</RNText>
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} side="bottom" title="時刻を選択">
        <View style={{ flexDirection: "row", height: 220, gap: scales.spacing.scale[3] }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {hours.map((h) => (
              <Pressable
                key={h}
                onPress={() => setHour(h)}
                style={{
                  paddingVertical: scales.spacing.scale[2],
                  alignItems: "center",
                  backgroundColor: hour === h ? theme.surface["accent-primary-light"] : "transparent",
                  borderRadius: scales.borderRadius.sm,
                }}
              >
                <RNText
                  style={[
                    resolveTypo("body.lg"),
                    {
                      color: hour === h ? theme.text["accent-primary"] : theme.text["high-emphasis"],
                      fontWeight: hour === h ? "700" : "400",
                    },
                  ]}
                >
                  {pad(h)}
                </RNText>
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {minutes.map((m) => (
              <Pressable
                key={m}
                onPress={() => setMinute(m)}
                style={{
                  paddingVertical: scales.spacing.scale[2],
                  alignItems: "center",
                  backgroundColor: minute === m ? theme.surface["accent-primary-light"] : "transparent",
                  borderRadius: scales.borderRadius.sm,
                }}
              >
                <RNText
                  style={[
                    resolveTypo("body.lg"),
                    {
                      color: minute === m ? theme.text["accent-primary"] : theme.text["high-emphasis"],
                      fontWeight: minute === m ? "700" : "400",
                    },
                  ]}
                >
                  {pad(m)}
                </RNText>
              </Pressable>
            ))}
          </ScrollView>
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
                onChange?.({ hour, minute })
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
