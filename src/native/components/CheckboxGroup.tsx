import React from "react"
import { View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { CheckboxField } from "./CheckboxField"

export interface CheckboxGroupOption {
  value: string
  label: string
  description?: string
}

export interface CheckboxGroupProps {
  options: CheckboxGroupOption[]
  values?: string[]
  onChange?: (values: string[]) => void
  disabled?: boolean
}

export function CheckboxGroup({ options, values = [], onChange, disabled = false }: CheckboxGroupProps) {
  const { scales } = useTheme()
  const toggle = (v: string) => {
    if (values.includes(v)) {
      onChange?.(values.filter((x) => x !== v))
    } else {
      onChange?.([...values, v])
    }
  }
  // 各行（CheckboxField）が touchTargets.buttonCTA.min（44）の高さを自前で持つため、行間はここで足しすぎない。
  // scale[3] だと 1 行ラベルで 56pt ピッチになり間延びする（issue #315）
  return (
    <View style={{ gap: scales.spacing.scale[1] }}>
      {options.map((o) => (
        <CheckboxField
          key={o.value}
          label={o.label}
          description={o.description}
          checked={values.includes(o.value)}
          disabled={disabled}
          onChange={() => toggle(o.value)}
        />
      ))}
    </View>
  )
}
