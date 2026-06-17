import React, { useState } from "react"
import { Pressable, Text as RNText, View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Sheet } from "./Sheet"
import { Separator } from "./Separator"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  title?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "選択",
  disabled = false,
  title = "選択",
}: SelectProps) {
  const { theme, scales } = useTheme()
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

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
      <Sheet open={open} onClose={() => setOpen(false)} side="bottom" title={title}>
        <View>
          {options.map((o, i) => (
            <React.Fragment key={o.value}>
              <Pressable
                onPress={() => {
                  if (o.disabled) return
                  onChange?.(o.value)
                  setOpen(false)
                }}
                disabled={o.disabled}
                style={({ pressed }) => ({
                  paddingVertical: scales.spacing.scale[3],
                  paddingHorizontal: scales.spacing.scale[2],
                  backgroundColor: pressed ? theme.surface.secondary : "transparent",
                  opacity: o.disabled ? 0.4 : 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                })}
              >
                <RNText style={[resolveTypo("body.md"), { color: theme.text["high-emphasis"] }]}>
                  {o.label}
                </RNText>
                {value === o.value && (
                  <RNText style={[resolveTypo("label.md"), { color: theme.text["accent-primary"] }]}>
                    ✓
                  </RNText>
                )}
              </Pressable>
              {i < options.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </View>
      </Sheet>
    </>
  )
}
