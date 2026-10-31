import React, { useState } from "react"
import { Platform, TextInput, type TextInputProps, type NativeSyntheticEvent, type TextInputContentSizeChangeEventData } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

const WEB_INPUT_RESET = Platform.OS === "web" ? { outlineStyle: "none" } : null
export type AutoGrowTextareaDensity = "default" | "compact"

export interface AutoGrowTextareaProps extends Omit<TextInputProps, "style" | "multiline"> {
  /** Web / native Input・Textarea と同じ（issue #675）。inline は枠・背景なし・下線でフォーカスを示す */
  variant?: "default" | "inline" | "inline-title"
  invalid?: boolean
  disabled?: boolean
  minHeight?: number
  maxHeight?: number
  density?: AutoGrowTextareaDensity
}

export const AutoGrowTextarea = React.forwardRef<TextInput, AutoGrowTextareaProps>(
  function AutoGrowTextarea(
    {
      variant = "default",
      invalid,
      disabled,
      minHeight = 44,
      maxHeight = 200,
      density = "default",
      // onFocus / onBlur / onContentSizeChange / editable は rest から取り出して内部処理と合成する。
      // rest に残すと後ろの {...rest} が focused 切り替え・高さ調整・disabled を上書きしていた（issue #819）。
      onFocus,
      onBlur,
      onContentSizeChange,
      editable,
      ...rest
    },
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
      onContentSizeChange?.(e)
    }

    return (
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        placeholderTextColor={theme.text["low-emphasis"]}
        style={[
          resolveTypo(variant === "inline-title" ? "heading.xl" : "body.md"),
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
          variant !== "default"
            ? {
                paddingHorizontal: 0,
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
        // rest の後ろに置き、consumer の指定より内部処理を優先させる（issue #819）。
        // disabled は editable より優先する。
        editable={disabled ? false : editable ?? true}
        onContentSizeChange={handleSize}
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
      />
    )
  },
)
