import React, { useState } from "react"
import { Platform, TextInput, View, type TextInputProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

// Web (react-native-web) は <input> をそのまま使うのでブラウザの黄色 focus outline が
// borderColor の上に被さる。focus 状態は外側 View の borderColor で表すので outline は消す。
const WEB_INPUT_RESET = Platform.OS === "web" ? { outlineStyle: "none" } : null

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
          WEB_INPUT_RESET as TextInputProps["style"],
        ]}
        {...rest}
      />
      {trailing}
    </View>
  )
}
