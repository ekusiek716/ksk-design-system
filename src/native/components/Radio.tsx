import React from "react"
import { Pressable, View, type AccessibilityProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface RadioProps extends AccessibilityProps {
  selected?: boolean
  /** ラジオは再押下で解除しない。親で単一選択の値を管理する。 */
  onChange?: (selected: boolean) => void
  disabled?: boolean
  /** 丸印の直径。操作領域は最低44ptを確保する。 */
  size?: number
  /** 親の radio に意味と操作を委ねる装飾。読み上げ・フォーカス・押下を持たない。 */
  decorative?: boolean
}

export function Radio({
  selected = false,
  onChange,
  disabled = false,
  size = 20,
  decorative = false,
  accessibilityRole,
  accessibilityState,
  ...accessibilityProps
}: RadioProps) {
  const { theme, scales } = useTheme()
  const mark = (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: selected ? theme.brand.primary : theme.border["medium-emphasis"],
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {selected && (
        <View style={{ width: size / 2, height: size / 2, borderRadius: size / 4, backgroundColor: theme.brand.primary }} />
      )}
    </View>
  )
  if (decorative) {
    return (
      <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden>
        {mark}
      </View>
    )
  }
  return (
    <Pressable
      {...accessibilityProps}
      onPress={() => !disabled && onChange?.(true)}
      disabled={disabled}
      hitSlop={Math.max(0, (scales.touchTargets.buttonCTA.min - size) / 2)}
      accessibilityRole={accessibilityRole ?? "radio"}
      accessibilityState={{ selected, checked: selected, disabled, ...accessibilityState }}
      aria-checked={accessibilityState?.checked ?? selected}
      aria-disabled={accessibilityState?.disabled ?? disabled}
    >
      {mark}
    </Pressable>
  )
}
