import React from "react"
import { View, Platform, type ViewProps, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface CardProps extends ViewProps {
  /** spacing.scale のインデックス。既定 4 = 16px */
  padding?: number
  /** shadow トークン名。web は boxShadow、native は elevation(Android) を適用 */
  elevation?: "sm" | "md" | "lg"
  children: React.ReactNode
}

/** surface.primary 面 + border.low-emphasis の標準カード。 */
export function Card({ padding = 4, elevation, style, children, ...rest }: CardProps) {
  const { theme, scales } = useTheme()

  const shadow: ViewStyle | undefined = elevation
    ? (Platform.select({
        web: { boxShadow: scales.shadows[elevation].boxShadow },
        default: { elevation: scales.shadows[elevation].elevation },
      }) as ViewStyle)
    : undefined

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface.primary,
          borderColor: theme.border["low-emphasis"],
          borderWidth: 1,
          borderRadius: scales.borderRadius.lg,
          padding: scales.spacing.scale[padding],
          gap: scales.spacing.scale[3],
        },
        shadow,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}
