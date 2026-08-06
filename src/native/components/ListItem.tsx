import React from "react"
import { Pressable, View, Text as RNText, type AccessibilityProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

/**
 * `AccessibilityProps` を継承しているため、`accessibilityLabel` /
 * `accessibilityHint` / `accessibilityState` / `accessibilityRole` を
 * そのまま渡せる（issue #298①）。`accessibilityLabel` を渡すと行全体が
 * 1つの読み上げ要素にまとまり、title/description の断片読みを防げる。
 */
export interface ListItemProps extends AccessibilityProps {
  leading?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  trailing?: React.ReactNode
  showChevron?: boolean
  onPress?: () => void
  disabled?: boolean
}

export function ListItem({
  leading,
  title,
  description,
  trailing,
  showChevron,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityState,
  ...accessibilityProps
}: ListItemProps) {
  const { theme, scales } = useTheme()
  const inner = (pressed = false) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[3],
        paddingHorizontal: scales.spacing.scale[4],
        paddingVertical: scales.spacing.scale[3],
        backgroundColor: pressed ? theme.surface.secondary : theme.surface.primary,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {leading}
      <View style={{ flex: 1, gap: 2 }}>
        {typeof title === "string" ? (
          <RNText style={[resolveTypo("body.md"), { color: theme.text["high-emphasis"] }]}>
            {title}
          </RNText>
        ) : (
          title
        )}
        {description && typeof description === "string" ? (
          <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"] }]}>
            {description}
          </RNText>
        ) : (
          description
        )}
      </View>
      {trailing}
      {showChevron && (
        <RNText style={[resolveTypo("label.md"), { color: theme.text["low-emphasis"] }]}>›</RNText>
      )}
    </View>
  )
  if (onPress) {
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        accessibilityRole={accessibilityRole ?? "button"}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: Boolean(disabled), ...accessibilityState }}
        {...accessibilityProps}
      >
        {({ pressed }) => inner(pressed)}
      </Pressable>
    )
  }

  const hasAccessibilityProps =
    accessibilityLabel !== undefined ||
    accessibilityHint !== undefined ||
    accessibilityRole !== undefined ||
    accessibilityState !== undefined ||
    Object.keys(accessibilityProps).length > 0

  // 非タップ行は a11y prop が来たときだけラッパを足す（未指定なら従来どおりの
  // ツリー構造・読み上げ挙動を保つ＝非破壊）。label / hint 指定時は行全体を
  // 1要素にまとめる（accessible が無いと hint は読み上げられない）。
  if (!hasAccessibilityProps) return inner(false)

  return (
    <View
      accessible={
        accessibilityLabel !== undefined || accessibilityHint !== undefined ? true : undefined
      }
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
      {...accessibilityProps}
    >
      {inner(false)}
    </View>
  )
}
