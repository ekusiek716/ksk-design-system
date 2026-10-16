import React, { useState } from "react"
import { Platform, TextInput, type TextInputProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

const WEB_INPUT_RESET = Platform.OS === "web" ? { outlineStyle: "none" } : null

export interface TextareaProps extends Omit<TextInputProps, "style" | "multiline"> {
  /** Web Textarea / native Input の variant と同じ（issue #675）。inline は枠・背景なし・下線でフォーカスを示す */
  variant?: "default" | "inline" | "inline-title"
  invalid?: boolean
  disabled?: boolean
  minHeight?: number
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(function Textarea(
  { variant = "default", invalid, disabled, minHeight, ...rest },
  ref,
) {
  const { theme, scales } = useTheme()
  const [focused, setFocused] = useState(false)

  const borderColor = invalid
    ? theme.border.caution
    : focused
    ? theme.border["accent-primary"]
    : theme.border["medium-emphasis"]

  return (
    <TextInput
      ref={ref}
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
        resolveTypo(variant === "inline-title" ? "heading.xl" : "body.md"),
        {
          minHeight: minHeight ?? (variant === "default" ? 96 : 0),
          padding: scales.spacing.scale[3],
          borderRadius: scales.borderRadius.md,
          borderWidth: 1,
          borderColor,
          backgroundColor: disabled ? theme.surface.disable : theme.surface.primary,
          color: theme.text["high-emphasis"],
          opacity: disabled ? 0.6 : 1,
        },
        variant !== "default"
          ? {
              paddingHorizontal: 0,
              paddingVertical: scales.spacing.scale[1],
              borderRadius: 0,
              borderWidth: 0,
              borderBottomWidth: 2,
              borderBottomColor: invalid || focused ? borderColor : "transparent",
              backgroundColor: "transparent",
            }
          : null,
        WEB_INPUT_RESET as TextInputProps["style"],
      ]}
      {...rest}
    />
  )
})
