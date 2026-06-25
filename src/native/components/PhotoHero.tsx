import React from "react"
import {
  ImageBackground,
  Text as RNText,
  View,
  type ImageStyle,
  type ImageSourcePropType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export type PhotoHeroOverlay = "none" | "medium" | "dark"
export type PhotoHeroAlign = "bottom" | "center"
type PhotoHeroSource = ImageSourcePropType | string

export interface PhotoHeroProps {
  src: PhotoHeroSource
  alt?: string
  overlay?: PhotoHeroOverlay
  align?: PhotoHeroAlign
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  contentStyle?: StyleProp<ViewStyle>
}

interface PhotoHeroTextProps {
  children: React.ReactNode
  style?: StyleProp<TextStyle>
  numberOfLines?: number
}

interface PhotoHeroActionsProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

function imageSource(src: PhotoHeroSource): ImageSourcePropType {
  return typeof src === "string" ? { uri: src } : src
}

function overlayColor(overlay: PhotoHeroOverlay, theme: ReturnType<typeof useTheme>["theme"]) {
  if (overlay === "none") return "transparent"
  if (overlay === "dark") return theme.surface["videoOverlay-strong"]
  return theme.surface["videoOverlay-medium"]
}

function PhotoHeroRoot({
  src,
  alt = "",
  overlay = "medium",
  align = "bottom",
  children,
  style,
  imageStyle,
  contentStyle,
}: PhotoHeroProps) {
  const { theme, scales } = useTheme()
  const justifyContent = align === "center" ? "center" : "flex-end"

  return (
    <ImageBackground
      source={imageSource(src)}
      accessibilityIgnoresInvertColors
      accessibilityLabel={alt || undefined}
      style={[
        {
          flex: 1,
          minHeight: "100%",
          backgroundColor: theme.surface.inverse,
          overflow: "hidden",
        },
        style,
      ]}
      imageStyle={imageStyle}
      resizeMode="cover"
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: overlayColor(overlay, theme),
        }}
      />
      <View
        style={[
          {
            flex: 1,
            justifyContent,
            paddingHorizontal: scales.spacing.scale[6],
            paddingTop: align === "bottom" ? scales.spacing.scale[15] : scales.spacing.scale[15],
            paddingBottom: align === "bottom" ? scales.spacing.scale[15] : scales.spacing.scale[15],
          },
          contentStyle,
        ]}
      >
        <View style={{ gap: scales.spacing.scale[4] }}>{children}</View>
      </View>
    </ImageBackground>
  )
}

function PhotoHeroEyebrow({ children, style, numberOfLines }: PhotoHeroTextProps) {
  const { theme } = useTheme()
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[resolveTypo("label.sm"), { color: theme.text["on-media-secondary"] }, style]}
    >
      {children}
    </RNText>
  )
}

function PhotoHeroTitle({ children, style, numberOfLines }: PhotoHeroTextProps) {
  const { theme } = useTheme()
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[resolveTypo("heading.2xl"), { color: theme.text["on-media"] }, style]}
    >
      {children}
    </RNText>
  )
}

function PhotoHeroBody({ children, style, numberOfLines }: PhotoHeroTextProps) {
  const { theme } = useTheme()
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[resolveTypo("body.md"), { color: theme.text["on-media-secondary"] }, style]}
    >
      {children}
    </RNText>
  )
}

function PhotoHeroActions({ children, style }: PhotoHeroActionsProps) {
  const { scales } = useTheme()
  return (
    <View style={[{ gap: scales.spacing.scale[3], marginTop: scales.spacing.scale[2] }, style]}>
      {children}
    </View>
  )
}

export const PhotoHero = Object.assign(PhotoHeroRoot, {
  Eyebrow: PhotoHeroEyebrow,
  Title: PhotoHeroTitle,
  Body: PhotoHeroBody,
  Actions: PhotoHeroActions,
})
