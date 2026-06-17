import React from "react"
import { View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical"
  emphasis?: "low" | "medium"
}

export function Separator({ orientation = "horizontal", emphasis = "low" }: SeparatorProps) {
  const { theme } = useTheme()
  const color = emphasis === "low" ? theme.border["low-emphasis"] : theme.border["medium-emphasis"]
  if (orientation === "vertical") {
    return <View style={{ width: 1, alignSelf: "stretch", backgroundColor: color }} />
  }
  return <View style={{ height: 1, alignSelf: "stretch", backgroundColor: color }} />
}
