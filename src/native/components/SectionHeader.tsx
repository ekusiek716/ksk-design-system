import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface SectionHeaderProps {
  title: string
  description?: string
  action?: { label: string; onPress: () => void }
  variant?: "default" | "subtle"
}

export function SectionHeader({ title, description, action, variant = "default" }: SectionHeaderProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scales.spacing.scale[4],
        paddingVertical: scales.spacing.scale[2],
        gap: scales.spacing.scale[2],
      }}
    >
      <View style={{ flex: 1 }}>
        <RNText
          style={[
            variant === "subtle" ? resolveTypo("label.md") : resolveTypo("heading.md"),
            { color: theme.text["high-emphasis"] },
          ]}
        >
          {title}
        </RNText>
        {description && (
          <RNText
            style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"], marginTop: 2 }]}
          >
            {description}
          </RNText>
        )}
      </View>
      {action && (
        <Pressable onPress={action.onPress} hitSlop={8}>
          <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>
            {action.label} ›
          </RNText>
        </Pressable>
      )}
    </View>
  )
}
