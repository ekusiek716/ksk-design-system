import React from "react"
import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface SwitchProps extends Omit<RNSwitchProps, "trackColor" | "thumbColor"> {}

export function Switch(props: SwitchProps) {
  const { theme } = useTheme()
  return (
    <RNSwitch
      trackColor={{ false: theme.surface.tertiary, true: theme.brand.primary }}
      thumbColor={theme.surface.primary}
      ios_backgroundColor={theme.surface.tertiary}
      {...props}
    />
  )
}
