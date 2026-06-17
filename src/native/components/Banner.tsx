import React from "react"
import { Image, Pressable, View, Text as RNText, type ImageSourcePropType } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface BannerProps {
  title?: string
  description?: string
  image?: ImageSourcePropType
  onPress?: () => void
  tone?: "neutral" | "accent" | "success" | "warning" | "caution"
  height?: number
}

export function Banner({ title, description, image, onPress, tone = "neutral", height = 140 }: BannerProps) {
  const { theme, scales } = useTheme()
  const palette = {
    neutral: { bg: theme.surface.secondary, fg: theme.text["high-emphasis"] },
    accent: { bg: theme.surface["accent-primary-light"], fg: theme.text["accent-primary"] },
    success: { bg: theme.surface.success, fg: theme.text.success },
    warning: { bg: theme.surface.warning, fg: theme.text.warning },
    caution: { bg: theme.surface.caution, fg: theme.text.caution },
  }[tone]

  const content = (
    <View
      style={{
        height,
        borderRadius: scales.borderRadius.lg,
        backgroundColor: palette.bg,
        overflow: "hidden",
      }}
    >
      {image && (
        <Image
          source={image}
          resizeMode="cover"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}
      <View
        style={{
          flex: 1,
          padding: scales.spacing.scale[4],
          justifyContent: "flex-end",
          backgroundColor: image ? theme.surface["videoOverlay-light"] : "transparent",
        }}
      >
        {title && (
          <RNText
            style={[
              resolveTypo("heading.lg"),
              { color: image ? theme.text["on-inverse"] : palette.fg },
            ]}
          >
            {title}
          </RNText>
        )}
        {description && (
          <RNText
            style={[
              resolveTypo("body.sm"),
              { color: image ? theme.text["on-inverse-secondary"] : theme.text["medium-emphasis"] },
            ]}
          >
            {description}
          </RNText>
        )}
      </View>
    </View>
  )

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>
  }
  return content
}
