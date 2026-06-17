import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface ListItemProps {
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
      <Pressable disabled={disabled} onPress={onPress}>
        {({ pressed }) => inner(pressed)}
      </Pressable>
    )
  }
  return inner(false)
}
