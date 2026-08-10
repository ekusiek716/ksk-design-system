import React from "react"
import {
  Pressable,
  Text as RNText,
  View,
  type AccessibilityProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Spinner } from "./Spinner"

export type ActionTileVariant = "neutral" | "selected" | "success" | "info" | "caution"

/**
 * `AccessibilityProps` を継承しているため `accessibilityLabel` /
 * `accessibilityHint` をそのまま渡せる（issue #298①）。label + meta を
 * 合成した読み上げラベル（例: 「模試2（要解放）」）を consumer 側で付けられる。
 */
export interface ActionTileProps extends AccessibilityProps {
  icon?: React.ReactNode
  emoji?: React.ReactNode
  label: React.ReactNode
  description?: React.ReactNode
  /** カード下段の右端に置く補足情報(例:「所要5分」「要解放」)。選択インジケータには使わない — `indicator` を使う。 */
  meta?: React.ReactNode
  /**
   * 選択状態などを示す小さな表示。**ラベル行の右端**(loading 時に Spinner が入る位置)に置かれる。
   * 省略時、選択状態なら DS 標準のチェックを表示する。表示自体を消したい場合の口は用意していない
   * (選択を色だけで伝えると WCAG 1.4.1 に反するため)。
   */
  indicator?: React.ReactNode
  selected?: boolean
  loading?: boolean
  disabled?: boolean
  variant?: ActionTileVariant
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

export interface QuickActionGridProps {
  columns?: 2 | 3 | 4
  gap?: number
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

function colorsForVariant(
  variant: ActionTileVariant,
  theme: ReturnType<typeof useTheme>["theme"],
) {
  switch (variant) {
    case "selected":
      return {
        borderColor: theme.brand.primary,
        backgroundColor: theme.surface["accent-primary-light"],
      }
    case "success":
      return { borderColor: theme.border.success, backgroundColor: theme.surface["success-subtle"] }
    case "info":
      return { borderColor: theme.border.info, backgroundColor: theme.surface["info-subtle"] }
    case "caution":
      return { borderColor: theme.border.caution, backgroundColor: theme.surface["caution-subtle"] }
    default:
      return { borderColor: theme.border["low-emphasis"], backgroundColor: theme.surface.primary }
  }
}

export function ActionTile({
  icon,
  emoji,
  label,
  description,
  meta,
  indicator,
  selected = false,
  loading = false,
  disabled = false,
  variant = selected ? "selected" : "neutral",
  onPress,
  style,
  accessibilityRole,
  accessibilityState,
  ...accessibilityProps
}: ActionTileProps) {
  const { theme, scales } = useTheme()
  const isDisabled = disabled || loading
  const isSelected = selected || variant === "selected"
  const hasIndicator = indicator !== undefined && indicator !== null && indicator !== false
  // 下段（description / meta）を描くかどうか。下の JSX の描画条件と必ず一致させる
  const hasBottomRow = Boolean(description || meta)
  const variantColors = colorsForVariant(variant, theme)

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole={accessibilityRole ?? "button"}
      accessibilityState={{
        disabled: isDisabled,
        selected: isSelected,
        busy: loading,
        ...accessibilityState,
      }}
      {...accessibilityProps}
      style={({ pressed }) => [
        {
          minHeight: 96,
          borderWidth: 1,
          borderRadius: scales.borderRadius.xl,
          padding: scales.spacing.scale[3],
          gap: scales.spacing.scale[3],
          // 下段（description / meta）があるときだけ上下に振り分ける。無いときに
          // space-between にすると、ラベルが上端に貼り付いて下に空白が残り間延びして
          // 見える（issue #309 の原因2）。1 行タイルは中央に置く
          justifyContent: hasBottomRow ? "space-between" : "center",
          opacity: isDisabled ? 0.5 : 1,
          ...variantColors,
          backgroundColor: pressed ? theme.surface.secondary : variantColors.backgroundColor,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: scales.spacing.scale[2] }}>
        <View style={{ flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: scales.spacing.scale[2] }}>
          {emoji && <RNText style={resolveTypo("heading.md")}>{emoji}</RNText>}
          {icon}
          {typeof label === "string" ? (
            <RNText numberOfLines={1} style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"], flex: 1 }]}>
              {label}
            </RNText>
          ) : (
            label
          )}
        </View>
        {loading ? (
          <Spinner size="sm" />
        ) : hasIndicator ? (
          // 文字列だけでなく数値もラップする。View 直下の生テキストは RN 実機で落ちる（Chip.tsx と同じガード）
          typeof indicator === "string" || typeof indicator === "number" ? (
            <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>
              {indicator}
            </RNText>
          ) : (
            indicator
          )
        ) : isSelected ? (
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <RNText style={[resolveTypo("label.md"), { color: theme.text["accent-primary"] }]}>✓</RNText>
          </View>
        ) : null}
      </View>
      {hasBottomRow && (
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: scales.spacing.scale[2] }}>
          {typeof description === "string" ? (
            <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"], flex: 1 }]}>
              {description}
            </RNText>
          ) : (
            description
          )}
          {typeof meta === "string" ? (
            <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"], marginLeft: "auto" }]}>
              {meta}
            </RNText>
          ) : (
            meta && <View style={{ marginLeft: "auto" }}>{meta}</View>
          )}
        </View>
      )}
    </Pressable>
  )
}

export function QuickActionGrid({
  columns = 3,
  gap = 12,
  children,
  style,
}: QuickActionGridProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          gap,
        },
        style,
      ]}
    >
      {React.Children.map(children, (child) => (
        <View style={{ width: `${100 / columns}%`, paddingRight: gap }}>
          {child}
        </View>
      ))}
    </View>
  )
}
