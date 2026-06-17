import React from "react"
import { Modal, View, Pressable } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface CoachMarkOverlayProps {
  open: boolean
  onClose: () => void
  /** ハイライト対象の画面座標。指定するとそのエリアだけ暗くしない */
  highlight?: { x: number; y: number; width: number; height: number; radius?: number }
  children: React.ReactNode
}

/**
 * 背景を暗くしてフォーカスしたい領域だけ残す簡易オーバーレイ。
 * ハイライト穴は4枚の View でスポットを囲う形（Mask 非依存）。
 */
export function CoachMarkOverlay({ open, onClose, highlight, children }: CoachMarkOverlayProps) {
  const { theme } = useTheme()
  const overlay = theme.overlay.dark

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1 }}>
        {highlight ? (
          <>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: highlight.y,
                backgroundColor: overlay,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: highlight.y,
                left: 0,
                width: highlight.x,
                height: highlight.height,
                backgroundColor: overlay,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: highlight.y,
                left: highlight.x + highlight.width,
                right: 0,
                height: highlight.height,
                backgroundColor: overlay,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: highlight.y + highlight.height,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: overlay,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: highlight.y,
                left: highlight.x,
                width: highlight.width,
                height: highlight.height,
                borderRadius: highlight.radius ?? 12,
                borderWidth: 2,
                borderColor: theme.brand.primary,
              }}
            />
          </>
        ) : (
          <View style={{ flex: 1, backgroundColor: overlay }} />
        )}
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 80, alignItems: "center" }}>
          <Pressable onPress={() => {}}>{children}</Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}
