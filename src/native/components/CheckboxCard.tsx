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
      // カード全体を 1 つの checkbox として読ませる（issue #799。CheckboxField と同じ構成）
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={title}
      accessibilityHint={description}
      // react-native-web 0.21 は accessibilityState を aria-* に変換しないため併記する
      aria-checked={checked}
      aria-disabled={disabled || undefined}
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
      {/*
        チェック枠は見た目だけの装飾にし、タップはカードの onPress に任せる（issue #799）。
        以前は枠が名前の無い checkbox として別要素に読まれていた。
      */}
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        // react-native-web は上記2つを尊重しないため、web でも効く aria-hidden を併記する
        aria-hidden
        style={{ paddingTop: 2 }}
      >
        <Checkbox checked={checked} disabled={disabled} decorative />
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
