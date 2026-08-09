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
  // 各行が touchTargets.buttonCTA.min（44）の高さを自前で持つため、行間はここで足しすぎない。
  // scale[3] だと 1 行ラベルでピッチが過剰に空く（issue #315）
  return (
    <View style={{ gap: scales.spacing.scale[1] }}>
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
                marginTop: o.description ? 2 : 0,
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
