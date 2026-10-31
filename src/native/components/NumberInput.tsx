import React, { useEffect, useRef, useState } from "react"
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
   *
   * 注意: 値が確定するのは欄からフォーカスが外れたとき（送信キー・入力終了を含む）。
   * `keyboardType="number-pad"` の iOS キーボードには送信キーが無く、`Screen` の
   * `keyboardShouldPersistTaps="handled"` の中ではボタンを押しても欄のフォーカスが外れない。
   * そのため「保存」ボタン等の押下時に値を読むときは、ボタンの `onPressIn` で
   * `Keyboard.dismiss()` を呼び、`onPress` までに確定させること（NATIVE_RECIPES.md の
   * 「数値の入力欄と保存ボタン」）。確定前に部品が外れた（画面を閉じた）場合は、外れる時点で
   * 打ちかけの値を確定して呼ぶ。確定前に親が `value` を変えた場合は打ちかけの値を捨てる。
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
  // 下書きを打ち始めた時点の value。確定前に親が value を変えたかの判定に使う。
  const draftBaseRef = useRef(value)
  const setDraft = (next: string | null) => {
    if (draftRef.current === null && next !== null) draftBaseRef.current = value
    draftRef.current = next
    setDraftState(next)
  }

  /** 下書きを数値にする。空欄・「-」だけ・数値でないときは null。 */
  const parseDraft = (text: string | null): number | null => {
    if (text === null || text === "" || text === "-") return null
    const n = Number(text)
    return Number.isFinite(n) ? n : null
  }

  /** 下書きを確定する。unmounting のときは state を触らずに通知だけする。 */
  const commit = (unmounting = false) => {
    const text = draftRef.current
    if (text === null) return
    if (unmounting) draftRef.current = null
    else setDraft(null)
    const n = parseDraft(text)
    if (n === null) return
    const next = clamp(n)
    if (next !== value) onChange?.(next)
  }

  // 確定前に部品が外れたとき（保存して画面を閉じた等）も打ちかけの値を捨てない。
  // cleanup は最初の render の commit を閉じ込めるため、最新の commit を ref 経由で呼ぶ。
  const commitRef = useRef(commit)
  useEffect(() => {
    commitRef.current = commit
  })
  useEffect(() => () => commitRef.current(true), [])

  // 確定前に親が value を変えた（リセットボタン等）ら、古い下書きを捨てて新しい値を表示する。
  // 残すと次のフォーカス外しで古い下書きが確定し、親が入れた値を上書きしてしまう。
  useEffect(() => {
    if (draftRef.current !== null && value !== draftBaseRef.current) setDraft(null)
    // setDraft は毎 render 作り直すが、value の変化だけを契機にしたい。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // 打ちかけの値があれば、それを基準に増減する（確定前に ± を押した場合）。
  const stepBy = (delta: number) => {
    if (disabled) return
    const base = parseDraft(draftRef.current) ?? value
    setDraft(null)
    onChange?.(clamp(base + delta))
  }
  const inc = () => stepBy(step)
  const dec = () => stepBy(-step)
  // ± の押せる・押せないも、打ちかけの値を基準に決める（境界の値から打ち直した直後に押せるように）。
  const effective = parseDraft(draft) ?? value

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
        disabled={disabled || effective <= min}
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
        onEndEditing={() => commit()}
        onSubmitEditing={() => commit()}
        onBlur={() => commit()}
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
        disabled={disabled || effective >= max}
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
