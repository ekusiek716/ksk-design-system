import React from "react"
import { Pressable, View, Text as RNText, type PressableProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type ChipVariant = "filled" | "accent" | "outline"
export type ChipSize = "sm" | "md" | "lg"
export type ChipShape = "pill" | "square"

export interface ChipProps extends Omit<PressableProps, "children" | "style"> {
  variant?: ChipVariant
  size?: ChipSize
  shape?: ChipShape
  selected?: boolean
  disabled?: boolean
  count?: number
  removable?: boolean
  onRemove?: () => void
  children?: React.ReactNode
}

const heightMap: Record<ChipSize, number> = { sm: 28, md: 32, lg: 36 }
const padHMap: Record<ChipSize, number> = { sm: 10, md: 12, lg: 16 }

export function Chip({
  variant = "filled",
  size = "md",
  shape = "pill",
  selected = false,
  disabled = false,
  count,
  removable = false,
  onRemove,
  children,
  ...rest
}: ChipProps) {
  const { theme, scales } = useTheme()

  const palette = {
    filled: { bg: theme.surface.secondary, fg: theme.text["high-emphasis"], border: "transparent" },
    accent: {
      bg: theme.surface["accent-primary-light"],
      fg: theme.text["accent-primary"],
      border: "transparent",
    },
    outline: { bg: "transparent", fg: theme.text["high-emphasis"], border: theme.border["medium-emphasis"] },
  }[variant]

  const bg = selected ? theme.brand.primary : palette.bg
  const fg = selected ? theme.text["on-inverse"] : disabled ? theme.text.disable : palette.fg
  const border = selected ? theme.brand.primary : palette.border

  return (
    <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
      <Pressable
        disabled={disabled}
        style={({ pressed }) => [
          {
            height: heightMap[size],
            paddingHorizontal: padHMap[size],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: scales.spacing.scale[1],
            borderRadius: shape === "pill" ? scales.borderRadius.full : scales.borderRadius.sm,
            borderWidth: variant === "outline" || selected ? 1 : 0,
            borderColor: border,
            backgroundColor: pressed && !disabled ? theme.active["secondary-button"] : bg,
            opacity: disabled ? 0.6 : 1,
          },
          removable && { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
        ]}
        {...rest}
      >
        <RNText style={[resolveTypo("label.sm"), { color: fg }]}>{children}</RNText>
        {count !== undefined && (
          <View
            style={{
              minWidth: 20,
              paddingHorizontal: 6,
              borderRadius: scales.borderRadius.full,
              backgroundColor: selected ? theme.surface.primary : theme.surface.tertiary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RNText
              style={[
                resolveTypo("label.xs"),
                { color: selected ? theme.text["accent-primary"] : theme.text["medium-emphasis"] },
              ]}
            >
              {count}
            </RNText>
          </View>
        )}
      </Pressable>
      {removable && (
        <Pressable
          onPress={onRemove}
          disabled={disabled}
          style={({ pressed }) => ({
            height: heightMap[size],
            paddingHorizontal: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed ? theme.active["tertiary-button"] : bg,
            borderTopRightRadius: shape === "pill" ? scales.borderRadius.full : scales.borderRadius.sm,
            borderBottomRightRadius: shape === "pill" ? scales.borderRadius.full : scales.borderRadius.sm,
            borderWidth: variant === "outline" || selected ? 1 : 0,
            borderLeftWidth: 0,
            borderColor: border,
            opacity: disabled ? 0.6 : 1,
          })}
        >
          <RNText style={[resolveTypo("label.md"), { color: fg, lineHeight: 14 }]}>×</RNText>
        </Pressable>
      )}
    </View>
  )
}
