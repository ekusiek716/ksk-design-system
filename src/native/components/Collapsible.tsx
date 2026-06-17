import React, { useState } from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface CollapsibleProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function Collapsible({ title, defaultOpen = false, children }: CollapsibleProps) {
  const { theme, scales } = useTheme()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <View>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: scales.spacing.scale[1],
        }}
      >
        <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>
          {open ? "▾" : "▸"}
        </RNText>
        <RNText style={[resolveTypo("label.md"), { color: theme.text["accent-primary"] }]}>{title}</RNText>
      </Pressable>
      {open && <View style={{ marginTop: scales.spacing.scale[2] }}>{children}</View>}
    </View>
  )
}
