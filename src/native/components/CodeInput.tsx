import React, { useRef, useState } from "react"
import {
  Platform,
  Pressable,
  Text as RNText,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

/** 1 文字として受け付ける文字種（issue #669・Web と同じ語彙）。 */
export type CodeInputPattern = "numeric" | "alphanumeric" | RegExp
/** 見た目（issue #669・Web と同じ語彙）。 */
export type CodeInputVariant = "cells" | "single"

export interface CodeInputProps {
  /** 桁数（コードの長さ） */
  length: number
  /** 入力中のコード（controlled）。左詰めの文字列 */
  value?: string
  /** 初期値（uncontrolled） */
  defaultValue?: string
  /** 入力が変わるたびに、受け付けた文字だけを左詰めにした文字列で呼ばれる */
  onChange?: (value: string) => void
  /** 全桁がそろった瞬間に 1 回呼ばれる */
  onComplete?: (value: string) => void
  /** @default "numeric" */
  pattern?: CodeInputPattern
  /** 英字を大文字にそろえる。@default false */
  uppercase?: boolean
  /** @default "cells" */
  variant?: CodeInputVariant
  autoFocus?: boolean
  disabled?: boolean
  invalid?: boolean
  /** 読み上げ名（Web の aria-label と対）。何のコードかを書く（例: "認証コード"） */
  accessibilityLabel?: string
  /**
   * autoComplete（Web と同じ規則）。既定は cells が SMS コード自動入力（iOS oneTimeCode /
   * Android sms-otp）、single は付けない（招待コード等にワンタイムコードの候補を出さない）。
   */
  autoComplete?: TextInputProps["autoComplete"]
  /** `single` の placeholder */
  placeholder?: string
  /** 外側コンテナの style（Web の className 相当） */
  style?: StyleProp<ViewStyle>
  testID?: string
}

function acceptsChar(char: string, pattern: CodeInputPattern) {
  if (pattern === "numeric") return /^[0-9]$/.test(char)
  if (pattern === "alphanumeric") return /^[0-9A-Za-z]$/.test(char)
  return new RegExp(pattern.source, pattern.flags.replace(/[gy]/g, "")).test(char)
}

function sanitize(raw: string, pattern: CodeInputPattern, uppercase: boolean) {
  return Array.from(uppercase ? raw.toUpperCase() : raw)
    .filter((c) => acceptsChar(c, pattern))
    .join("")
}

// react-native-web では <input> のブラウザ既定 outline を消す（Input.tsx と同じ）
const WEB_INPUT_RESET = Platform.OS === "web" ? { outlineStyle: "none" } : null

/**
 * CodeInput（native）— 認証コード（OTP）・招待コードの固定桁入力（issue #669・Web と同じ API）。
 *
 * `cells` は RN の定石どおり **1 つの TextInput** を桁のセルの上に透明で重ね、値を各セルに
 * 描き分ける（セルごとに TextInput を並べると SMS 自動入力・貼り付け・Backspace の桁移動を
 * OS ごとに再実装することになる）。iOS は textContentType="oneTimeCode"、Android は
 * autoComplete="sms-otp" で SMS コードが全桁に入る。読み上げは TextInput 1 つで、
 * accessibilityLabel と入力済みの値（Web の「n 桁目」名に相当する情報は「n / length 桁」として
 * accessibilityValue で伝える）。
 */
export function CodeInput({
  length,
  value: valueProp,
  defaultValue = "",
  onChange,
  onComplete,
  pattern = "numeric",
  uppercase = false,
  variant = "cells",
  autoFocus,
  disabled = false,
  invalid = false,
  accessibilityLabel,
  autoComplete,
  placeholder,
  style,
  testID,
}: CodeInputProps) {
  const { theme, scales } = useTheme()
  const inputRef = useRef<TextInput>(null)
  const [focused, setFocused] = useState(false)
  const isControlled = valueProp !== undefined
  const [innerValue, setInnerValue] = useState(() => sanitize(defaultValue, pattern, uppercase).slice(0, length))
  const value = (isControlled ? valueProp : innerValue).slice(0, length)

  const handleChangeText = (raw: string) => {
    const next = sanitize(raw, pattern, uppercase).slice(0, length)
    if (next === value) return
    if (!isControlled) setInnerValue(next)
    onChange?.(next)
    if (next.length === length) onComplete?.(next)
  }

  const borderFor = (active: boolean) =>
    invalid ? theme.border.caution : active ? theme.border["accent-primary"] : theme.border["medium-emphasis"]

  const inputProps: TextInputProps = {
    value,
    onChangeText: handleChangeText,
    maxLength: length,
    keyboardType: pattern === "numeric" ? "number-pad" : "default",
    ...(variant === "cells" || autoComplete === "one-time-code" || autoComplete === "sms-otp"
      ? { textContentType: "oneTimeCode" as const }
      : null),
    autoComplete:
      autoComplete ?? (variant === "cells" ? (Platform.OS === "android" ? "sms-otp" : "one-time-code") : undefined),
    autoCapitalize: uppercase ? "characters" : "none",
    autoCorrect: false,
    autoFocus,
    editable: !disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    accessibilityLabel,
    accessibilityState: { disabled },
    accessibilityValue: { text: `${value.length} / ${length} 桁${value ? `: ${value}` : ""}` },
    testID,
  }

  if (variant === "single") {
    return (
      <View
        style={[
          {
            minHeight: scales.touchTargets.textInput.min,
            justifyContent: "center",
            paddingHorizontal: scales.spacing.scale[3],
            borderRadius: scales.borderRadius.md,
            borderWidth: 1,
            borderColor: borderFor(focused),
            backgroundColor: disabled ? theme.surface.disable : theme.surface.primary,
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        <TextInput
          ref={inputRef}
          {...inputProps}
          placeholder={placeholder}
          placeholderTextColor={theme.text["low-emphasis"]}
          style={[
            resolveTypo("heading.lg"),
            {
              color: theme.text["high-emphasis"],
              textAlign: "center",
              letterSpacing: 2,
              fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
              paddingVertical: 0,
            },
            WEB_INPUT_RESET as TextInputProps["style"],
          ]}
        />
      </View>
    )
  }

  const cellSize = scales.touchTargets.textInput.min
  const activeIndex = Math.min(value.length, length - 1)

  return (
    <Pressable
      accessible={false}
      onPress={() => inputRef.current?.focus()}
      disabled={disabled}
      style={[{ position: "relative", flexDirection: "row", gap: scales.spacing.scale[2], opacity: disabled ? 0.6 : 1 }, style]}
    >
      {Array.from({ length }, (_, index) => (
        <View
          key={index}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            flex: 1,
            maxWidth: cellSize,
            height: cellSize,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: scales.borderRadius.md,
            borderWidth: 1,
            borderColor: borderFor(focused && index === activeIndex),
            backgroundColor: disabled ? theme.surface.disable : theme.surface.primary,
          }}
        >
          <RNText style={[resolveTypo("heading.lg"), { color: theme.text["high-emphasis"] }]}>
            {value[index] ?? ""}
          </RNText>
        </View>
      ))}
      {/* 値の入力・SMS 自動入力・貼り付けを一手に受ける透明な TextInput（セル全体を覆う） */}
      <TextInput
        ref={inputRef}
        {...inputProps}
        caretHidden
        style={[
          { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, color: "transparent", opacity: 0.02 },
          WEB_INPUT_RESET as TextInputProps["style"],
        ]}
      />
    </Pressable>
  )
}
