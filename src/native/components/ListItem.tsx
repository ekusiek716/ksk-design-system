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
/**
 * 行の中での配置（Web の ListItem `align` と同じ語彙）。
 * - "start"  : 既定。本文列が `flex: 1` で伸びる従来の見た目。
 * - "center" : 本文列を伸ばさず、leading / 本文 / trailing のかたまりを
 *              行の水平中央に寄せ、テキストも中央寄せにする。
 *              アイコン + ラベルだけの full-width な CTA 行に使う。
 *
 * 注: 垂直方向は Native の既定が `alignItems: "center"`（Web は `items-start`）で、
 * これは既存の見た目を保つための先行実装由来の差。align では変えない。
 */
export type ListItemAlign = "start" | "center"

/**
 * 行の密度（Web の ListItem `density` と同じ語彙）。
 * - "comfortable" : 既定。従来の paddingHorizontal 4 / paddingVertical 3 スケール。
 * - "compact"     : paddingHorizontal 3 / paddingVertical 1。カード内の高密度行用。
 *                   タップ可能な行に使う場合は 44pt のタップ領域が別途確保できるか
 *                   確認すること。
 */
export type ListItemDensity = "comfortable" | "compact"

export interface ListItemProps extends AccessibilityProps {
  leading?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  trailing?: React.ReactNode
  /**
   * title / description と同じ列に置く下段スロットではなく、
   * leading / 本文 / trailing の行の**外側**・全幅に置く下段スロット。
   * leading の幅にインデントされないため、進捗バー等に使う。
   */
  footerSlot?: React.ReactNode
  showChevron?: boolean
  onPress?: () => void
  disabled?: boolean
  align?: ListItemAlign
  density?: ListItemDensity
}

export function ListItem({
  leading,
  title,
  description,
  trailing,
  footerSlot,
  showChevron,
  onPress,
  disabled,
  align = "start",
  density = "comfortable",
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityState,
  ...accessibilityProps
}: ListItemProps) {
  const { theme, scales } = useTheme()
  const isCentered = align === "center"
  const isCompact = density === "compact"
  const hasFooter = footerSlot !== undefined && footerSlot !== null && footerSlot !== false

  const row = (
    <>
      {leading}
      <View
        style={
          isCentered ? { gap: 2, alignItems: "center" as const } : { flex: 1, gap: 2 }
        }
      >
        {typeof title === "string" ? (
          <RNText
            style={[
              resolveTypo("body.md"),
              { color: theme.text["high-emphasis"] },
              isCentered ? { textAlign: "center" as const } : null,
            ]}
          >
            {title}
          </RNText>
        ) : (
          title
        )}
        {description && typeof description === "string" ? (
          <RNText
            style={[
              resolveTypo("body.sm"),
              { color: theme.text["medium-emphasis"] },
              isCentered ? { textAlign: "center" as const } : null,
            ]}
          >
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
    </>
  )

  const inner = (pressed = false) => (
    <View
      style={{
        flexDirection: hasFooter ? "column" : "row",
        alignItems: hasFooter ? "stretch" : "center",
        ...(isCentered && !hasFooter ? { justifyContent: "center" as const } : null),
        ...(hasFooter ? null : { gap: scales.spacing.scale[3] }),
        paddingHorizontal: isCompact ? scales.spacing.scale[3] : scales.spacing.scale[4],
        paddingVertical: isCompact ? scales.spacing.scale[1] : scales.spacing.scale[3],
        backgroundColor: pressed ? theme.surface.secondary : theme.surface.primary,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {hasFooter ? (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: isCentered ? "center" : "flex-start",
              gap: scales.spacing.scale[3],
            }}
          >
            {row}
          </View>
          <View style={{ marginTop: 8, width: "100%" }}>{footerSlot}</View>
        </>
      ) : (
        row
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
