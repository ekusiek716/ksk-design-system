import React, { useCallback, useRef, useState } from "react"
import { Pressable, TextInput, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { useWebCompositionGuard } from "../use-web-composition-guard"

export interface TagInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export function TagInput({ value = [], onChange, placeholder = "タグを入力", maxTags = 10 }: TagInputProps) {
  const { theme, scales } = useTheme()
  const [draft, setDraft] = useState("")
  const inputRef = useRef<TextInput>(null)
  // react-native-web 上では TextInput の実体が DOM <input> になり、日本語 IME の
  // 「変換を確定する Enter」でも onSubmitEditing が発火する。ガードしないと未確定文字が
  // そのままタグ化される（Web 版 TagInput と同一原因。issue #301）。
  // ネイティブ実機では compositionstart/end が無く、このフックは no-op。
  const composingRef = useRef(false)
  useWebCompositionGuard(
    inputRef,
    useCallback(() => {
      composingRef.current = true
    }, []),
    useCallback(() => {
      composingRef.current = false
    }, []),
  )

  const add = () => {
    if (composingRef.current) return
    const t = draft.trim()
    if (!t) return
    if (value.includes(t)) {
      setDraft("")
      return
    }
    if (value.length >= maxTags) return
    onChange?.([...value, t])
    setDraft("")
  }

  const remove = (t: string) => {
    onChange?.(value.filter((x) => x !== t))
  }

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scales.spacing.scale[1],
        padding: scales.spacing.scale[2],
        borderRadius: scales.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.border["medium-emphasis"],
        backgroundColor: theme.surface.primary,
      }}
    >
      {value.map((t) => (
        <View
          key={t}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingLeft: scales.spacing.scale[2],
            paddingRight: 4,
            height: 28,
            borderRadius: scales.borderRadius.full,
            backgroundColor: theme.surface["accent-primary-light"],
          }}
        >
          <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>{t}</RNText>
          <Pressable onPress={() => remove(t)} hitSlop={6}>
            <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>×</RNText>
          </Pressable>
        </View>
      ))}
      <TextInput
        ref={inputRef}
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={add}
        onBlur={add}
        placeholder={value.length === 0 ? placeholder : ""}
        placeholderTextColor={theme.text["low-emphasis"]}
        returnKeyType="done"
        style={[
          resolveTypo("body.md"),
          {
            minWidth: 100,
            flex: 1,
            color: theme.text["high-emphasis"],
            paddingVertical: 4,
            paddingHorizontal: 4,
          },
        ]}
      />
    </View>
  )
}
