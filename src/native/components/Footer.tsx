import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface FooterLink {
  label: string
  onPress?: () => void
}

export interface FooterProps {
  copyright?: string
  links?: FooterLink[]
}

export function Footer({ copyright, links = [] }: FooterProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        backgroundColor: theme.surface.secondary,
        padding: scales.spacing.scale[4],
        gap: scales.spacing.scale[2],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: scales.spacing.scale[3],
        }}
      >
        {links.map((l, i) => (
          <Pressable key={i} onPress={l.onPress}>
            <RNText style={[resolveTypo("label.sm"), { color: theme.text["medium-emphasis"] }]}>
              {l.label}
            </RNText>
          </Pressable>
        ))}
      </View>
      {copyright && (
        <RNText style={[resolveTypo("body.sm"), { color: theme.text["low-emphasis"] }]}>
          {copyright}
        </RNText>
      )}
    </View>
  )
}
