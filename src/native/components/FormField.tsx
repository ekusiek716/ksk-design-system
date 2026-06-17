import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Label } from "./Label"

export interface FormFieldProps {
  label?: string
  required?: boolean
  description?: string
  error?: string
  children: React.ReactNode
}

export function FormField({ label, required, description, error, children }: FormFieldProps) {
  const { theme, scales } = useTheme()
  return (
    <View style={{ gap: scales.spacing.scale[2] }}>
      {label && <Label required={required}>{label}</Label>}
      {description && !error && (
        <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"] }]}>
          {description}
        </RNText>
      )}
      {children}
      {error && (
        <RNText style={[resolveTypo("body.sm"), { color: theme.text.caution }]}>
          {error}
        </RNText>
      )}
    </View>
  )
}
