import React from "react"
import { Pressable, View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: number
  /**
   * true のとき、支援技術から読み上げ対象外の純粋な装飾として振る舞う
   * （accessibilityRole/State を持たず、キーボードフォーカスも受けない）。
   * CheckboxField 等、親の Pressable が既に role="checkbox" を持ち、
   * このコンポーネントを見た目のためだけに内側へ入れ子にする場合に使う。
   * 親側は装飾の subtree を aria-hidden で隠す（react-native-web は
   * accessibilityElementsHidden / importantForAccessibility を尊重しないため）が、
   * aria-hidden はフォーカス可能な子孫を許さない（axe: aria-hidden-focus）ので
   * tabIndex も同時に外す必要がある。
   * @default false
   */
  decorative?: boolean
}

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  size = 20,
  decorative = false,
}: CheckboxProps) {
  const { theme, scales } = useTheme()
  return (
    <Pressable
      onPress={() => !decorative && !disabled && onChange?.(!checked)}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole={decorative ? undefined : "checkbox"}
      accessibilityState={decorative ? undefined : { checked, disabled }}
      // decorative 時は web のタブ順から外す（aria-hidden の親と組み合わせて完全に無視させる）
      tabIndex={decorative ? -1 : undefined}
      style={{
        width: size,
        height: size,
        borderRadius: scales.borderRadius.sm,
        borderWidth: 2,
        borderColor: checked ? theme.brand.primary : theme.border["medium-emphasis"],
        backgroundColor: checked ? theme.brand.primary : "transparent",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {checked && (
        <View
          style={{
            width: size * 0.5,
            height: size * 0.25,
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderColor: theme.text["on-inverse"],
            transform: [{ rotate: "-45deg" }, { translateY: -1 }],
          }}
        />
      )}
    </Pressable>
  )
}
