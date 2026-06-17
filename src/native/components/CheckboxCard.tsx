import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Checkbox } from "./Checkbox"

export interface CheckboxCardProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  title: string
  description?: string
}

export function CheckboxCard({
  checked = false,
  onChange,
  disabled = false,
  title,
  description,
}: CheckboxCardProps) {
  const { theme, scales } = useTheme()
  return (
    <Pressable
      onPress={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      style={{
        flexDirection: "row",
        gap: scales.spacing.scale[3],
        alignItems: "flex-start",
        padding: scales.spacing.scale[4],
        borderRadius: scales.borderRadius.lg,
        borderWidth: 1,
        borderColor: checked ? theme.border["accent-primary"] : theme.border["low-emphasis"],
        backgroundColor: checked ? theme.surface["accent-primary-light"] : theme.surface.primary,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View style={{ paddingTop: 2 }}>
        <Checkbox checked={checked} disabled={disabled} onChange={onChange} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>{title}</RNText>
        {description && (
          <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"] }]}>
            {description}
          </RNText>
        )}
      </View>
    </Pressable>
  )
}
