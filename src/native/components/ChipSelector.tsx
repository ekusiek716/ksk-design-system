import React from "react"
import { View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { Chip } from "./Chip"

export interface ChipSelectorOption {
  value: string
  label: string
  count?: number
  disabled?: boolean
}

/**
 * 選択の意味論（issue #352）。web / `QuickActionGrid`（issue #318）と同じ語彙。
 * - `"single"`: 排他選択。グループが `accessibilityRole="radiogroup"`、チップが `"radio"` + `accessibilityState.checked`
 * - `"multiple"`: 複数選択。チップは従来どおり `accessibilityState.selected`
 */
export type ChipSelectorSelectionMode = "single" | "multiple"

/**
 * 開発ビルド判定。DS は node の型を持たないので globalThis 経由で参照する。
 * `proc` の存在を先に必須にする（QuickActionGrid と同じ形）。省略すると
 * process 自体が無い環境で undefined との比較が true になり、本番でも
 * 警告が出続ける。
 */
function isDev() {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}

export interface ChipSelectorProps {
  options: ChipSelectorOption[]
  values?: string[]
  onChange?: (values: string[]) => void
  /**
   * 複数選択を許可するか。
   *
   * @deprecated issue #352。`selectionMode` を使うこと
   * （`multiple={false}` は `selectionMode="single"`、`multiple` は `selectionMode="multiple"`）。
   * 後方互換のため型からは消していないが、既定が `true`（複数選択）で
   * 「渡し忘れると静かに壊れる側」に倒れているため、新規実装では使わない。
   *
   * @default true
   */
  multiple?: boolean
  /**
   * 選択の意味論（issue #352）。指定した場合は `multiple` より優先される。
   * 未指定のときは後方互換のため従来どおり `multiple`（既定 `true`）から導出する。
   */
  selectionMode?: ChipSelectorSelectionMode
}

export function ChipSelector({
  options,
  values = [],
  onChange,
  multiple = true,
  selectionMode,
}: ChipSelectorProps) {
  const { scales } = useTheme()
  // selectionMode があればそれが正本。無ければ従来の multiple から導出する（非破壊）
  const isMultiple = selectionMode ? selectionMode === "multiple" : multiple
  const isRadio = !isMultiple

  if (isDev() && isRadio && values.length > 1) {
    // #39 の footgun（単一選択のつもりで複数選択になり values[0] を読む実装が静かに壊れる）を
    // 開発時に見えるようにする（issue #352）
    console.warn(
      `[ksk-ds] ChipSelector: selectionMode="single" は排他選択ですが、選択中の値が ${values.length} 個あります。values を 1 つに絞るか selectionMode="multiple" を使ってください。`,
    )
  }

  const toggle = (v: string) => {
    if (isMultiple) {
      onChange?.(values.includes(v) ? values.filter((x) => x !== v) : [...values, v])
    } else {
      onChange?.(values.includes(v) ? [] : [v])
    }
  }
  return (
    <View
      accessibilityRole={isRadio ? "radiogroup" : undefined}
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scales.spacing.scale[2],
      }}
    >
      {options.map((o) => {
        const selected = values.includes(o.value)
        return (
          <Chip
            key={o.value}
            selected={selected}
            disabled={o.disabled}
            count={o.count}
            accessibilityRole={isRadio ? "radio" : undefined}
            // radio は checked が選択状態の正本。Chip の既定は `selected` なので、
            // 意味論を二重化しないよう undefined で明示的に打ち消す（spread 順で後勝ち）。
            accessibilityState={isRadio ? { checked: selected, selected: undefined } : undefined}
            onPress={() => toggle(o.value)}
          >
            {o.label}
          </Chip>
        )
      })}
    </View>
  )
}
