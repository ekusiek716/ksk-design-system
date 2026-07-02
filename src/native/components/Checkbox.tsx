import React from "react"
import { Pressable, View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: number
}

export function Checkbox({ checked = false, onChange, disabled = false, size = 20 }: CheckboxProps) {
  const { theme, scales } = useTheme()
  return (
    <Pressable
      onPress={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      style={{
        width: size,
        height: size,
        borderRadius: scales.borderRadius.sm,
        borderWidth: 2,
        borderColor: checked ? theme.brand.primary : theme.border["medium-emphasis"],
        backgroundColor: checked ? theme.brand.primary : "transparent",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {checked && (
        <View
          style={{
            width: size * 0.5,
            height: size * 0.25,
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderColor: theme.text["on-inverse"],
            transform: [{ rotate: "-45deg" }, { translateY: -1 }],
          }}
        />
      )}
    </Pressable>
  )
}
