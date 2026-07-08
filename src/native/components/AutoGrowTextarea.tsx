import React, { useState } from "react"
import { Platform, TextInput, type TextInputProps, type NativeSyntheticEvent, type TextInputContentSizeChangeEventData } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

const WEB_INPUT_RESET = Platform.OS === "web" ? { outlineStyle: "none" } : null
export type AutoGrowTextareaDensity = "default" | "compact"

export interface AutoGrowTextareaProps extends Omit<TextInputProps, "style" | "multiline"> {
  invalid?: boolean
  disabled?: boolean
  minHeight?: number
  maxHeight?: number
  density?: AutoGrowTextareaDensity
}

export const AutoGrowTextarea = React.forwardRef<TextInput, AutoGrowTextareaProps>(
  function AutoGrowTextarea(
    { invalid, disabled, minHeight = 44, maxHeight = 200, density = "default", ...rest },
    ref,
  ) {
    const { theme, scales } = useTheme()
    const [focused, setFocused] = useState(false)
    const [height, setHeight] = useState(minHeight)

    const borderColor = invalid
      ? theme.border.caution
      : focused
      ? theme.border["accent-primary"]
      : theme.border["medium-emphasis"]

    const handleSize = (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const extraHeight = density === "compact" ? 0 : 16
      const next = Math.min(maxHeight, Math.max(minHeight, e.nativeEvent.contentSize.height + extraHeight))
      setHeight(next)
    }

    return (
      <TextInput
        ref={ref}
        editable={!disabled}
        multiline
        textAlignVertical="top"
        onContentSizeChange={handleSize}
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
            height,
            padding: density === "compact" ? scales.spacing.scale[2] : scales.spacing.scale[3],
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
  },
)
