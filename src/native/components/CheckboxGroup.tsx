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
  return (
    <View style={{ gap: scales.spacing.scale[3] }}>
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
