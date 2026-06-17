import React from "react"
import { View, Image, Text as RNText, type ImageSourcePropType } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type AvatarSize = "sm" | "md" | "lg" | "xl"

export interface AvatarProps {
  source?: ImageSourcePropType
  fallback?: string
  size?: AvatarSize
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

export function Avatar({ source, fallback, size = "md" }: AvatarProps) {
  const { theme } = useTheme()
  const dim = sizeMap[size]

  if (source) {
    return (
      <Image
        source={source}
        style={{
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: theme.surface.tertiary,
        }}
      />
    )
  }

  return (
    <View
      style={{
        width: dim,
        height: dim,
        borderRadius: dim / 2,
        backgroundColor: theme.surface.tertiary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RNText style={[resolveTypo("label.sm"), { color: theme.text["medium-emphasis"] }]}>
        {fallback ?? "?"}
      </RNText>
    </View>
  )
}
