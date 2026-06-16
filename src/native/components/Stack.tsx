import React from "react"
import { View, type ViewProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface StackProps extends ViewProps {
  /** spacing.scale のインデックス（0–15）。既定 3 = 12px */
  gap?: number
  direction?: "row" | "column"
  align?: "flex-start" | "center" | "flex-end" | "stretch"
  justify?: "flex-start" | "center" | "flex-end" | "space-between"
  wrap?: boolean
  children: React.ReactNode
}

/** spacing トークン駆動の Flex レイアウト。Row/Column の薄いラッパ。 */
export function Stack({
  gap = 3,
  direction = "column",
  align,
  justify,
  wrap = false,
  style,
  children,
  ...rest
}: StackProps) {
  const { scales } = useTheme()
  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap: scales.spacing.scale[gap],
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? "wrap" : "nowrap",
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}
