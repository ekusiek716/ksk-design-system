import React, { useState } from "react"
import {
  Platform,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native"
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
  /**
   * 外側コンテナ（枠線・背景を持つ View）の style 上書きポイント。
   * DS 既定のレイアウト/トークンの後にマージされる（web の className 相当）。
   * issue #447: 意図的に Omit していたのは TextInputProps 側の `style`
   * （内部 TextInput 本体）のみで、コンテナ自体には元々 style の受け口が無かった。
   */
  style?: StyleProp<ViewStyle>
  /**
   * 内部 TextInput 本体の style 上書きポイント。DS 既定（typo・color・flex）の
   * 後にマージされる。TextInputProps の `style` は上の Omit で塞いでいるため、
   * こちらが唯一の入力テキスト側スタイル調整口になる。
   */
  inputStyle?: StyleProp<TextStyle>
}

export const Input = React.forwardRef<TextInput, InputProps>(function Input(
  { invalid, disabled, leading, trailing, style, inputStyle, ...rest },
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
    <View
      style={[
        {
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
        },
        style,
      ]}
    >
      {leading}
      <TextInput
        ref={ref}
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
          inputStyle,
        ]}
        {...rest}
      />
      {trailing}
    </View>
  )
})
