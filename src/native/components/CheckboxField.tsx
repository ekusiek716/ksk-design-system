import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Checkbox } from "./Checkbox"

export interface CheckboxFieldProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label: string
  description?: string
  accessibilityLabel?: string
  accessibilityHint?: string
}

export function CheckboxField({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  accessibilityLabel,
  accessibilityHint,
}: CheckboxFieldProps) {
  const { theme, scales } = useTheme()
  return (
    <Pressable
      onPress={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint ?? description}
      style={{
        flexDirection: "row",
        gap: scales.spacing.scale[2],
        alignItems: "flex-start",
        minHeight: scales.touchTargets.buttonCTA.min,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ paddingTop: 2 }}
      >
        <Checkbox checked={checked} disabled={disabled} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <RNText style={[resolveTypo("body.md"), { color: theme.text["high-emphasis"] }]}>{label}</RNText>
        {description && (
          <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"] }]}>
            {description}
          </RNText>
        )}
      </View>
    </Pressable>
  )
}
