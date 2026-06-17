import React from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Popover } from "./Popover"
import { Separator } from "./Separator"

export interface DropdownMenuItem {
  key: string
  label: string
  destructive?: boolean
  disabled?: boolean
  onSelect?: () => void
}

export interface DropdownMenuProps {
  open: boolean
  onClose: () => void
  anchor?: { x: number; y: number; width?: number; height?: number }
  items: DropdownMenuItem[]
}

export function DropdownMenu({ open, onClose, anchor, items }: DropdownMenuProps) {
  const { theme, scales } = useTheme()
  return (
    <Popover open={open} onClose={onClose} anchor={anchor}>
      <View style={{ minWidth: 180 }}>
        {items.map((it, i) => (
          <React.Fragment key={it.key}>
            <Pressable
              onPress={() => {
                if (it.disabled) return
                it.onSelect?.()
                onClose()
              }}
              disabled={it.disabled}
              style={({ pressed }) => ({
                paddingVertical: scales.spacing.scale[2],
                paddingHorizontal: scales.spacing.scale[3],
                borderRadius: scales.borderRadius.sm,
                backgroundColor: pressed ? theme.surface.secondary : "transparent",
                opacity: it.disabled ? 0.4 : 1,
              })}
            >
              <RNText
                style={[
                  resolveTypo("body.md"),
                  { color: it.destructive ? theme.text.caution : theme.text["high-emphasis"] },
                ]}
              >
                {it.label}
              </RNText>
            </Pressable>
            {i < items.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </View>
    </Popover>
  )
}
