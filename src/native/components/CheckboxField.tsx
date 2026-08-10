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
      // react-native-web 0.21 は accessibilityState を aria-* に変換しないため、
      // RN 0.71+ の aria-* props を併記する（peerDependency は react-native >=0.74.0）
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      style={{
        flexDirection: "row",
        gap: scales.spacing.scale[2],
        // description があるときはチェックを1行目に頭揃えする。無いときは行が minHeight（44）まで
        // 伸びるので、上寄せだと文字の下に約 19.5pt の空白が残り間延びして見える（issue #315）
        alignItems: description ? "flex-start" : "center",
        minHeight: scales.touchTargets.buttonCTA.min,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        // react-native-web は上記2つの native 専用プロパティを尊重しないため、
        // web でも効く aria-hidden を併記して内側の装飾用 Checkbox を支援技術から隠す
        aria-hidden
        style={{ paddingTop: description ? 2 : 0 }}
      >
        <Checkbox checked={checked} disabled={disabled} decorative />
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
