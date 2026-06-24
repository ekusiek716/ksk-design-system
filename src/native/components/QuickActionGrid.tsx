import React from "react"
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Spinner } from "./Spinner"

export type ActionTileVariant = "neutral" | "selected" | "success" | "info" | "caution"

export interface ActionTileProps {
  icon?: React.ReactNode
  emoji?: React.ReactNode
  label: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
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
  selected = false,
  loading = false,
  disabled = false,
  variant = selected ? "selected" : "neutral",
  onPress,
  style,
}: ActionTileProps) {
  const { theme, scales } = useTheme()
  const isDisabled = disabled || loading
  const variantColors = colorsForVariant(variant, theme)

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, selected, busy: loading }}
      style={({ pressed }) => [
        {
          minHeight: 96,
          borderWidth: 1,
          borderRadius: scales.borderRadius.xl,
          padding: scales.spacing.scale[3],
          gap: scales.spacing.scale[3],
          justifyContent: "space-between",
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
        {loading && <Spinner size="sm" />}
      </View>
      {(description || meta) && (
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: scales.spacing.scale[2] }}>
          {typeof description === "string" ? (
            <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"], flex: 1 }]}>
              {description}
            </RNText>
          ) : (
            description
          )}
          {typeof meta === "string" ? (
            <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>
              {meta}
            </RNText>
          ) : (
            meta
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
