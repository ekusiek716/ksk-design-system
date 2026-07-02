import React from "react"
import { Modal, Pressable, View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface PopoverProps {
  open: boolean
  onClose: () => void
  /** triggerが描画される位置（画面座標）。anchor 計測は呼び出し側で行う */
  anchor?: { x: number; y: number; width?: number; height?: number }
  children: React.ReactNode
}

export function Popover({ open, onClose, anchor, children }: PopoverProps) {
  const { theme, scales } = useTheme()

  const top = anchor ? anchor.y + (anchor.height ?? 0) + 4 : 100
  const left = anchor ? anchor.x : 0

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1 }}>
        <View
          style={{
            position: "absolute",
            top,
            left: Math.max(8, left),
            minWidth: 160,
            backgroundColor: theme.surface.primary,
            borderRadius: scales.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.border["low-emphasis"],
            padding: scales.spacing.scale[2],
            shadowColor: theme.overlay.dark,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Pressable onPress={() => {}}>{children}</Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}
