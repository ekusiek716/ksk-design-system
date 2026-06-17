import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export function RadioGroup({ options, value, onChange, disabled = false }: RadioGroupProps) {
  const { theme, scales } = useTheme()
  return (
    <View style={{ gap: scales.spacing.scale[3] }}>
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
              alignItems: "flex-start",
              opacity: itemDisabled ? 0.5 : 1,
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selected ? theme.brand.primary : theme.border["medium-emphasis"],
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              {selected && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: theme.brand.primary,
                  }}
                />
              )}
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
