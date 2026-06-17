import React from "react"
import { View, Text as RNText, ScrollView } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Sheet } from "./Sheet"

export interface BottomSheetFormProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  footer?: React.ReactNode
  children: React.ReactNode
}

export function BottomSheetForm({
  open,
  onClose,
  title,
  description,
  footer,
  children,
}: BottomSheetFormProps) {
  const { theme, scales } = useTheme()
  return (
    <Sheet open={open} onClose={onClose} side="bottom" title={title}>
      {description && (
        <RNText style={[resolveTypo("body.sm"), { color: theme.text["medium-emphasis"] }]}>
          {description}
        </RNText>
      )}
      <ScrollView style={{ maxHeight: 420 }}>
        <View style={{ gap: scales.spacing.scale[3], paddingVertical: scales.spacing.scale[2] }}>
          {children}
        </View>
      </ScrollView>
      {footer && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: scales.spacing.scale[2],
            marginTop: scales.spacing.scale[3],
          }}
        >
          {footer}
        </View>
      )}
    </Sheet>
  )
}
