import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface PillToggleOption {
  value: string
  label: string
  count?: number
}

export interface PillToggleProps {
  options: PillToggleOption[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export function PillToggle({ options, value, onChange, disabled = false }: PillToggleProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: scales.spacing.scale[2],
      }}
    >
      {options.map((o) => {
        const selected = value === o.value
        return (
          <Pressable
            key={o.value}
            onPress={() => !disabled && onChange?.(o.value)}
            disabled={disabled}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: scales.spacing.scale[1],
              paddingHorizontal: scales.spacing.scale[3],
              height: 36,
              borderRadius: scales.borderRadius.full,
              backgroundColor: selected
                ? theme.brand.primary
                : pressed
                ? theme.active["secondary-button"]
                : theme.surface.secondary,
              opacity: disabled ? 0.5 : 1,
            })}
          >
            <RNText
              style={[
                resolveTypo("label.sm"),
                {
                  color: selected ? theme.text["on-inverse"] : theme.text["high-emphasis"],
                  fontWeight: selected ? "700" : "500",
                },
              ]}
            >
              {o.label}
            </RNText>
            {o.count !== undefined && (
              <View
                style={{
                  paddingHorizontal: 6,
                  borderRadius: 999,
                  backgroundColor: selected ? theme.surface.primary : theme.surface.tertiary,
                  minWidth: 20,
                  alignItems: "center",
                }}
              >
                <RNText
                  style={[
                    resolveTypo("label.xs"),
                    { color: selected ? theme.text["accent-primary"] : theme.text["medium-emphasis"] },
                  ]}
                >
                  {o.count}
                </RNText>
              </View>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}
