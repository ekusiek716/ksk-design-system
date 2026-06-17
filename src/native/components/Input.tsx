import React, { useState } from "react"
import { TextInput, View, type TextInputProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface InputProps extends Omit<TextInputProps, "style"> {
  invalid?: boolean
  disabled?: boolean
  leading?: React.ReactNode
  trailing?: React.ReactNode
}

export function Input({ invalid, disabled, leading, trailing, ...rest }: InputProps) {
  const { theme, scales } = useTheme()
  const [focused, setFocused] = useState(false)

  const borderColor = invalid
    ? theme.border.caution
    : focused
    ? theme.border["accent-primary"]
    : theme.border["medium-emphasis"]

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[2],
        minHeight: scales.touchTargets.textInput.min,
        paddingHorizontal: scales.spacing.scale[3],
        borderRadius: scales.borderRadius.md,
        borderWidth: 1,
        borderColor,
        backgroundColor: disabled ? theme.surface.disable : theme.surface.primary,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {leading}
      <TextInput
        editable={!disabled}
        onFocus={(e) => {
          setFocused(true)
          rest.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          rest.onBlur?.(e)
        }}
        placeholderTextColor={theme.text["low-emphasis"]}
        style={[
          resolveTypo("body.md"),
          { flex: 1, color: theme.text["high-emphasis"], paddingVertical: 0 },
        ]}
        {...rest}
      />
      {trailing}
    </View>
  )
}
