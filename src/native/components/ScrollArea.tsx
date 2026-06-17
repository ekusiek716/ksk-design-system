import React from "react"
import { ScrollView, type ScrollViewProps, View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface ScrollAreaProps extends ScrollViewProps {
  maxHeight?: number
  bordered?: boolean
  children: React.ReactNode
}

/** ScrollView の薄いラッパ。max-height と枠線つけたいケース用。 */
export function ScrollArea({ maxHeight, bordered, children, ...rest }: ScrollAreaProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        maxHeight,
        borderWidth: bordered ? 1 : 0,
        borderColor: theme.border["low-emphasis"],
        borderRadius: bordered ? scales.borderRadius.lg : 0,
        overflow: "hidden",
      }}
    >
      <ScrollView {...rest}>{children}</ScrollView>
    </View>
  )
}
