import React, { useState } from "react"
import { Platform, TextInput, type TextInputProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

const WEB_INPUT_RESET = Platform.OS === "web" ? { outlineStyle: "none" } : null

export interface TextareaProps extends Omit<TextInputProps, "style" | "multiline"> {
  invalid?: boolean
  disabled?: boolean
  minHeight?: number
}

export function Textarea({ invalid, disabled, minHeight = 96, ...rest }: TextareaProps) {
  const { theme, scales } = useTheme()
  const [focused, setFocused] = useState(false)

  const borderColor = invalid
    ? theme.border.caution
    : focused
    ? theme.border["accent-primary"]
    : theme.border["medium-emphasis"]

  return (
    <TextInput
      editable={!disabled}
      multiline
      textAlignVertical="top"
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
        {
          minHeight,
          padding: scales.spacing.scale[3],
          borderRadius: scales.borderRadius.md,
          borderWidth: 1,
          borderColor,
          backgroundColor: disabled ? theme.surface.disable : theme.surface.primary,
          color: theme.text["high-emphasis"],
          opacity: disabled ? 0.6 : 1,
        },
        WEB_INPUT_RESET as TextInputProps["style"],
      ]}
      {...rest}
    />
  )
}
