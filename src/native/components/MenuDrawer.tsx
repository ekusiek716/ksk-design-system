import React from "react"
import { View, Text as RNText, Pressable, ScrollView } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Sheet } from "./Sheet"
import { Separator } from "./Separator"

export interface MenuDrawerItem {
  key: string
  label: string
  icon?: React.ReactNode
  onPress?: () => void
  active?: boolean
}

export interface MenuDrawerSection {
  title?: string
  items: MenuDrawerItem[]
}

export interface MenuDrawerProps {
  open: boolean
  onClose: () => void
  side?: "left" | "right"
  header?: React.ReactNode
  sections: MenuDrawerSection[]
  footer?: React.ReactNode
}

export function MenuDrawer({
  open,
  onClose,
  side = "left",
  header,
  sections,
  footer,
}: MenuDrawerProps) {
  const { theme, scales } = useTheme()
  return (
    <Sheet open={open} onClose={onClose} side={side}>
      {header && <View style={{ marginBottom: scales.spacing.scale[3] }}>{header}</View>}
      <ScrollView style={{ maxHeight: 480 }}>
        {sections.map((sec, sIdx) => (
          <View key={sIdx} style={{ marginBottom: scales.spacing.scale[3] }}>
            {sec.title && (
              <RNText
                style={[
                  resolveTypo("label.xs"),
                  {
                    color: theme.text["low-emphasis"],
                    paddingHorizontal: scales.spacing.scale[2],
                    marginBottom: scales.spacing.scale[1],
                  },
                ]}
              >
                {sec.title}
              </RNText>
            )}
            {sec.items.map((it, iIdx) => (
              <React.Fragment key={it.key}>
                <Pressable
                  onPress={() => {
                    it.onPress?.()
                    onClose()
                  }}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scales.spacing.scale[3],
                    paddingHorizontal: scales.spacing.scale[3],
                    paddingVertical: scales.spacing.scale[3],
                    borderRadius: scales.borderRadius.md,
                    backgroundColor: it.active
                      ? theme.surface["accent-primary-light"]
                      : pressed
                      ? theme.surface.secondary
                      : "transparent",
                  })}
                >
                  {it.icon}
                  <RNText
                    style={[
                      resolveTypo("body.md"),
                      {
                        color: it.active ? theme.text["accent-primary"] : theme.text["high-emphasis"],
                      },
                    ]}
                  >
                    {it.label}
                  </RNText>
                </Pressable>
                {iIdx < sec.items.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </View>
        ))}
      </ScrollView>
      {footer && <View style={{ marginTop: scales.spacing.scale[3] }}>{footer}</View>}
    </Sheet>
  )
}
