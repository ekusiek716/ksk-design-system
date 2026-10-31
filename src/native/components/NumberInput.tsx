import React, { useRef, useState } from "react"
import { Pressable, TextInput, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface NumberInputProps {
  value?: number
  /**
   * 値が確定したときに呼ぶ。± ボタンは押すたびに、キーボード入力は確定
   * （入力終了・送信キー・フォーカス外し）のときに一度だけ、`min`〜`max` へ補正した値で呼ぶ。
   * 入力途中（空欄や桁の途中）では呼ばない。空欄・数値でない入力で確定したときは
   * 呼ばずに元の `value` の表示へ戻す。値が変わらないときも呼ばない。
   *
   * 以前は 1 文字ごとに補正して呼んでいたため、欄を消して打ち直すと空欄が `min` に
   * 置き換わり、狙った数値を入力できなかった（issue #786）。Web 版 NumberInput と同じ
   * 「入力中は下書き、確定時に補正」にそろえている。
   */
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export function NumberInput({
  value = 0,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  disabled = false,
}: NumberInputProps) {
  const { theme, scales } = useTheme()
  const clamp = (v: number) => Math.max(min, Math.min(max, v))

  // 入力中の文字列（issue #786）。null のときは value をそのまま表示する。
  // 確定処理は onEndEditing / onSubmitEditing / onBlur から重ねて呼ばれるため、
  // 同じ tick の 2 回目を空振りさせるよう ref でも持つ。
  const [draft, setDraftState] = useState<string | null>(null)
  const draftRef = useRef<string | null>(null)
  const setDraft = (next: string | null) => {
    draftRef.current = next
    setDraftState(next)
  }

  /** 下書きを数値にする。空欄・「-」だけ・数値でないときは null。 */
  const parseDraft = (text: string | null): number | null => {
    if (text === null || text === "" || text === "-") return null
    const n = Number(text)
    return Number.isFinite(n) ? n : null
  }

  const commit = () => {
    const text = draftRef.current
    if (text === null) return
    setDraft(null)
    const n = parseDraft(text)
    if (n === null) return
    const next = clamp(n)
    if (next !== value) onChange?.(next)
  }

  // 打ちかけの値があれば、それを基準に増減する（確定前に ± を押した場合）。
  const stepBy = (delta: number) => {
    if (disabled) return
    const base = parseDraft(draftRef.current) ?? value
    setDraft(null)
    onChange?.(clamp(base + delta))
  }
  const inc = () => stepBy(step)
  const dec = () => stepBy(-step)

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.border["medium-emphasis"],
        borderRadius: scales.borderRadius.md,
        backgroundColor: theme.surface.primary,
        overflow: "hidden",
        alignSelf: "flex-start",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Pressable
        onPress={dec}
        disabled={disabled || value <= min}
        style={({ pressed }) => ({
          width: 40,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? theme.active["tertiary-button"] : "transparent",
        })}
      >
        <RNText style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"] }]}>−</RNText>
      </Pressable>
      <TextInput
        value={draft ?? String(value)}
        onChangeText={(t) => setDraft(t.replace(/[^0-9-]/g, ""))}
        onEndEditing={commit}
        onSubmitEditing={commit}
        onBlur={commit}
        keyboardType="number-pad"
        editable={!disabled}
        style={[
          resolveTypo("body.md"),
          {
            width: 56,
            textAlign: "center",
            color: theme.text["high-emphasis"],
            paddingVertical: 0,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: theme.border["low-emphasis"],
          },
        ]}
      />
      <Pressable
        onPress={inc}
        disabled={disabled || value >= max}
        style={({ pressed }) => ({
          width: 40,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? theme.active["tertiary-button"] : "transparent",
        })}
      >
        <RNText style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"] }]}>＋</RNText>
      </Pressable>
    </View>
  )
}
