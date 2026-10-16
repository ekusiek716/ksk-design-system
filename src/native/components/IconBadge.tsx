import React from "react"
import {
  View,
  type AccessibilityProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"

import { useTheme } from "../theme/ThemeProvider"

export type IconBadgeSize = "md" | "ml" | "lg"
/** 色の意味。Web IconBadge の tone と同じ語彙（issue #684）。 */
export type IconBadgeTone = "accent" | "info" | "success" | "warning" | "caution"

export interface IconBadgeRenderProps {
  color: string
  size: number
}

export interface IconBadgeProps extends AccessibilityProps {
  size?: IconBadgeSize
  /** 色の意味。既定 "accent"（従来どおり）。面は対応する淡色面、アイコンは Object-* 色。 */
  tone?: IconBadgeTone
  children: React.ReactNode | ((props: IconBadgeRenderProps) => React.ReactNode)
  style?: StyleProp<ViewStyle>
}

const dimensions: Record<IconBadgeSize, IconBadgeRenderProps> = {
  md: { color: "", size: 20 },
  ml: { color: "", size: 24 },
  lg: { color: "", size: 38 },
}

const containerSizes: Record<IconBadgeSize, number> = {
  md: 44,
  ml: 48,
  lg: 72,
}

export function IconBadge({
  size = "md",
  tone = "accent",
  children,
  style,
  accessibilityLabel,
  ...accessibilityProps
}: IconBadgeProps) {
  const { theme } = useTheme()
  const containerSize = containerSizes[size]
  const palette = {
    accent: { bg: theme.surface["accent-primary-light"], fg: theme.object["accent-primary"] },
    info: { bg: theme.surface.info, fg: theme.object.info },
    success: { bg: theme.surface.success, fg: theme.object.success },
    warning: { bg: theme.surface.warning, fg: theme.object.warning },
    caution: { bg: theme.surface.caution, fg: theme.object.caution },
  }[tone]
  const iconProps = {
    ...dimensions[size],
    color: palette.fg,
  }

  return (
    <View
      accessibilityElementsHidden={!accessibilityLabel}
      importantForAccessibility={accessibilityLabel ? "yes" : "no-hide-descendants"}
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.bg,
        },
        style,
      ]}
      {...accessibilityProps}
    >
      {typeof children === "function" ? children(iconProps) : children}
    </View>
  )
}
