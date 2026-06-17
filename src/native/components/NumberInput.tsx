import React from "react"
import { Pressable, TextInput, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface NumberInputProps {
  value: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  disabled = false,
}: NumberInputProps) {
  const { theme, scales } = useTheme()
  const clamp = (v: number) => Math.max(min, Math.min(max, v))

  const inc = () => !disabled && onChange?.(clamp(value + step))
  const dec = () => !disabled && onChange?.(clamp(value - step))

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.border["medium-emphasis"],
        borderRadius: scales.borderRadius.md,
        backgroundColor: theme.surface.primary,
        overflow: "hidden",
        alignSelf: "flex-start",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Pressable
        onPress={dec}
        disabled={disabled || value <= min}
        style={({ pressed }) => ({
          width: 40,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? theme.active["tertiary-button"] : "transparent",
        })}
      >
        <RNText style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"] }]}>−</RNText>
      </Pressable>
      <TextInput
        value={String(value)}
        onChangeText={(t) => {
          const n = Number(t.replace(/[^0-9-]/g, ""))
          if (!Number.isNaN(n)) onChange?.(clamp(n))
        }}
        keyboardType="number-pad"
        editable={!disabled}
        style={[
          resolveTypo("body.md"),
          {
            width: 56,
            textAlign: "center",
            color: theme.text["high-emphasis"],
            paddingVertical: 0,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: theme.border["low-emphasis"],
          },
        ]}
      />
      <Pressable
        onPress={inc}
        disabled={disabled || value >= max}
        style={({ pressed }) => ({
          width: 40,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? theme.active["tertiary-button"] : "transparent",
        })}
      >
        <RNText style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"] }]}>＋</RNText>
      </Pressable>
    </View>
  )
}
