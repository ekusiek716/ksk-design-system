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

export interface ChipSelectorProps {
  options: ChipSelectorOption[]
  values?: string[]
  onChange?: (values: string[]) => void
  multiple?: boolean
}

export function ChipSelector({
  options,
  values = [],
  onChange,
  multiple = true,
}: ChipSelectorProps) {
  const { scales } = useTheme()
  const toggle = (v: string) => {
    if (multiple) {
      onChange?.(values.includes(v) ? values.filter((x) => x !== v) : [...values, v])
    } else {
      onChange?.(values.includes(v) ? [] : [v])
    }
  }
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scales.spacing.scale[2],
      }}
    >
      {options.map((o) => (
        <Chip
          key={o.value}
          selected={values.includes(o.value)}
          disabled={o.disabled}
          count={o.count}
          onPress={() => toggle(o.value)}
        >
          {o.label}
        </Chip>
      ))}
    </View>
  )
}
