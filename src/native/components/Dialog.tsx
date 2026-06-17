import React from "react"
import { Modal, View, Pressable, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  footer?: React.ReactNode
  children?: React.ReactNode
  /** タップで閉じるか */
  dismissOnBackdrop?: boolean
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  dismissOnBackdrop = true,
}: DialogProps) {
  const { theme, scales } = useTheme()
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={() => dismissOnBackdrop && onClose()}
        style={{
          flex: 1,
          backgroundColor: theme.overlay.dark,
          alignItems: "center",
          justifyContent: "center",
          padding: scales.spacing.scale[4],
        }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            width: "100%",
            maxWidth: 480,
            backgroundColor: theme.surface.primary,
            borderRadius: scales.borderRadius["2xl"],
            padding: scales.spacing.scale[5],
            gap: scales.spacing.scale[3],
          }}
        >
          {title && (
            <RNText style={[resolveTypo("heading.lg"), { color: theme.text["high-emphasis"] }]}>
              {title}
            </RNText>
          )}
          {description && (
            <RNText style={[resolveTypo("body.md"), { color: theme.text["medium-emphasis"] }]}>
              {description}
            </RNText>
          )}
          {children}
          {footer && (
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: scales.spacing.scale[2] }}>
              {footer}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}
