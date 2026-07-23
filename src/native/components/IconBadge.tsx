import React from "react"
import {
  View,
  type AccessibilityProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"

import { useTheme } from "../theme/ThemeProvider"

export type IconBadgeSize = "md" | "ml" | "lg"

export interface IconBadgeRenderProps {
  color: string
  size: number
}

export interface IconBadgeProps extends AccessibilityProps {
  size?: IconBadgeSize
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
  children,
  style,
  accessibilityLabel,
  ...accessibilityProps
}: IconBadgeProps) {
  const { theme } = useTheme()
  const containerSize = containerSizes[size]
  const iconProps = {
    ...dimensions[size],
    color: theme.object["accent-primary"],
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
          backgroundColor: theme.surface["accent-primary-light"],
        },
        style,
      ]}
      {...accessibilityProps}
    >
      {typeof children === "function" ? children(iconProps) : children}
    </View>
  )
}
