import React from "react"
import { Pressable, View, Text as RNText, Platform } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface AppHeaderProps {
  title?: string
  subtitle?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
  onBack?: () => void
  centered?: boolean
}

export function AppHeader({ title, subtitle, leading, trailing, onBack, centered = true }: AppHeaderProps) {
  const { theme, scales } = useTheme()
  const left =
    leading ??
    (onBack ? (
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => ({
          padding: scales.spacing.scale[1],
          borderRadius: scales.borderRadius.md,
          backgroundColor: pressed ? theme.surface.secondary : "transparent",
        })}
      >
        <RNText style={[resolveTypo("heading.lg"), { color: theme.text["high-emphasis"] }]}>‹</RNText>
      </Pressable>
    ) : null)

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: scales.spacing.scale[2],
        paddingHorizontal: scales.spacing.scale[3],
        paddingTop: Platform.OS === "ios" ? 48 : scales.spacing.scale[3],
        paddingBottom: scales.spacing.scale[3],
        backgroundColor: theme.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: theme.border["low-emphasis"],
      }}
    >
      <View style={{ width: 44, alignItems: "flex-start" }}>{left}</View>
      <View style={{ flex: 1, alignItems: centered ? "center" : "flex-start" }}>
        {title && (
          <RNText
            numberOfLines={1}
            style={[resolveTypo("heading.md"), { color: theme.text["high-emphasis"] }]}
          >
            {title}
          </RNText>
        )}
        {subtitle && (
          <RNText
            numberOfLines={1}
            style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"] }]}
          >
            {subtitle}
          </RNText>
        )}
      </View>
      <View style={{ minWidth: 44, alignItems: "flex-end" }}>{trailing}</View>
    </View>
  )
}
