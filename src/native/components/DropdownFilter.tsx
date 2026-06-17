import React, { useState } from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Sheet } from "./Sheet"
import { Separator } from "./Separator"

export interface DropdownFilterOption {
  value: string
  label: string
  count?: number
}

export interface DropdownFilterProps {
  label: string
  options: DropdownFilterOption[]
  value?: string
  onChange?: (value: string | undefined) => void
}

export function DropdownFilter({ label, options, value, onChange }: DropdownFilterProps) {
  const { theme, scales } = useTheme()
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)
  const active = !!selected

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: scales.spacing.scale[1],
          paddingVertical: scales.spacing.scale[2],
          paddingHorizontal: scales.spacing.scale[3],
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
          {label}
          {selected ? `: ${selected.label}` : ""}
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
      <Sheet open={open} onClose={() => setOpen(false)} side="bottom" title={label}>
        <View>
          <Pressable
            onPress={() => {
              onChange?.(undefined)
              setOpen(false)
            }}
            style={({ pressed }) => ({
              paddingVertical: scales.spacing.scale[3],
              backgroundColor: pressed ? theme.surface.secondary : "transparent",
            })}
          >
            <RNText style={[resolveTypo("body.md"), { color: theme.text["medium-emphasis"] }]}>
              すべて
            </RNText>
          </Pressable>
          <Separator />
          {options.map((o, i) => (
            <React.Fragment key={o.value}>
              <Pressable
                onPress={() => {
                  onChange?.(o.value)
                  setOpen(false)
                }}
                style={({ pressed }) => ({
                  paddingVertical: scales.spacing.scale[3],
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: pressed ? theme.surface.secondary : "transparent",
                })}
              >
                <RNText style={[resolveTypo("body.md"), { color: theme.text["high-emphasis"] }]}>
                  {o.label}
                </RNText>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  {o.count !== undefined && (
                    <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>
                      {o.count}
                    </RNText>
                  )}
                  {value === o.value && (
                    <RNText style={[resolveTypo("label.md"), { color: theme.text["accent-primary"] }]}>
                      ✓
                    </RNText>
                  )}
                </View>
              </Pressable>
              {i < options.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </View>
      </Sheet>
    </>
  )
}
