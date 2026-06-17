import React, { useState } from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface AccordionItem {
  key: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  type?: "single" | "multiple"
  defaultOpenKeys?: string[]
}

export function Accordion({ items, type = "single", defaultOpenKeys = [] }: AccordionProps) {
  const { theme, scales } = useTheme()
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(defaultOpenKeys))

  const toggle = (k: string) => {
    setOpenKeys((prev) => {
      const next = new Set(type === "multiple" ? prev : [])
      if (prev.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  return (
    <View
      style={{
        borderRadius: scales.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.border["low-emphasis"],
        backgroundColor: theme.surface.primary,
        overflow: "hidden",
      }}
    >
      {items.map((it, i) => {
        const open = openKeys.has(it.key)
        return (
          <View
            key={it.key}
            style={{
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: theme.border["low-emphasis"],
            }}
          >
            <Pressable
              onPress={() => toggle(it.key)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: scales.spacing.scale[4],
                backgroundColor: pressed ? theme.surface.secondary : "transparent",
              })}
            >
              <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"], flex: 1 }]}>
                {it.title}
              </RNText>
              <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>
                {open ? "▾" : "▸"}
              </RNText>
            </Pressable>
            {open && (
              <View
                style={{
                  paddingHorizontal: scales.spacing.scale[4],
                  paddingBottom: scales.spacing.scale[4],
                }}
              >
                {it.content}
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}
