import React from "react"
import { View, Text as RNText, type ViewProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface LabelProps extends ViewProps {
  required?: boolean
  children: React.ReactNode
}

export function Label({ required, children, style, ...rest }: LabelProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={[{ flexDirection: "row", alignItems: "center", gap: scales.spacing.scale[1] }, style]}
      {...rest}
    >
      <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>{children}</RNText>
      {required && (
        <RNText style={[resolveTypo("label.sm"), { color: theme.caution.base }]}>*</RNText>
      )}
    </View>
  )
}
