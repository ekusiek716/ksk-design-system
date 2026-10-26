import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { Radio } from "./Radio"
import { resolveTypo } from "../typography"

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

/**
 * 開発ビルド判定（ChipSelector / QuickActionGrid と同じ形）。`proc` の存在を先に必須にして、
 * process 自体が無い環境で本番でも警告が出続けないようにする。
 */
function isDev() {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  /**
   * グループの読み上げ名（issue #765・ChipSelector の単一選択・Web の `aria-label` と対）。
   * RadioGroup は常に単一選択なので外側は `accessibilityRole="radiogroup"` で、radiogroup は名前が必須。
   * 「何を選ぶ欄か」を表す見出しの文言を渡す（未指定は開発ビルドで警告）。
   */
  accessibilityLabel?: string
  /** 見出し要素の nativeID（Android の accessibilityLabelledBy・Web の `aria-labelledby` と対） */
  accessibilityLabelledBy?: string
}

export function RadioGroup({
  options,
  value,
  onChange,
  disabled = false,
  accessibilityLabel,
  accessibilityLabelledBy,
}: RadioGroupProps) {
  const { theme, scales } = useTheme()
  if (isDev() && !accessibilityLabel && !accessibilityLabelledBy) {
    // issue #765: radiogroup は名前が必須。何を選ぶ欄か読み上げで分からなくなる
    console.warn(
      "[ksk-ds] RadioGroup: radiogroup には accessibilityLabel（または accessibilityLabelledBy）が必要です。",
    )
  }
  // 各行が touchTargets.buttonCTA.min（44）の高さを自前で持つため、行間はここで足しすぎない。
  // scale[3] だと 1 行ラベルでピッチが過剰に空く（issue #315）
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      accessibilityLabelledBy={accessibilityLabelledBy}
      style={{ gap: scales.spacing.scale[1] }}
    >
      {options.map((o) => {
        const selected = value === o.value
        const itemDisabled = disabled || o.disabled
        return (
          <Pressable
            key={o.value}
            onPress={() => !itemDisabled && onChange?.(o.value)}
            disabled={itemDisabled}
            style={{
              flexDirection: "row",
              gap: scales.spacing.scale[2],
              // description があるときは丸を1行目に頭揃えする。無いときは行が minHeight（44）まで
              // 伸びるので、上寄せだと文字の下に空白が残り間延びして見える（issue #315）
              alignItems: o.description ? "flex-start" : "center",
              // CheckboxField と揃えてタップ最小寸法を行が自前で満たす。
              // これが無いと 1 行ラベルの行が約 24.5pt しかなく 44pt を割る（issue #315 の副次修正）
              minHeight: scales.touchTargets.buttonCTA.min,
              opacity: itemDisabled ? 0.5 : 1,
            }}
            accessibilityRole="radio"
            // radio は checked が選択状態の正本（Radio / ChipSelector と同じ）。TalkBack は checked を読む
            accessibilityState={{ selected, checked: selected, disabled: itemDisabled }}
            // react-native-web 0.21 は accessibilityState を aria-* に変換しないため、
            // RN 0.71+ の aria-* props を併記する（peerDependency は react-native >=0.74.0）
            aria-checked={selected}
            aria-disabled={itemDisabled || undefined}
          >
            <View style={{ marginTop: o.description ? 2 : 0 }}>
              <Radio selected={selected} decorative />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <RNText style={[resolveTypo("body.md"), { color: theme.text["high-emphasis"] }]}>
                {o.label}
              </RNText>
              {o.description && (
                <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"] }]}>
                  {o.description}
                </RNText>
              )}
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}
