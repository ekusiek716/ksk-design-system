import React from "react"
import { View } from "react-native"
import { Dialog } from "./Dialog"
import { Button } from "./Button"

export interface AlertDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  destructive?: boolean
}

export function AlertDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = "OK",
  cancelLabel = "キャンセル",
  onConfirm,
  destructive = false,
}: AlertDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      dismissOnBackdrop={false}
      footer={
        <>
          <View style={{ minWidth: 100 }}>
            <Button variant="tertiary" onPress={onClose}>
              {cancelLabel}
            </Button>
          </View>
          <View style={{ minWidth: 100 }}>
            <Button
              variant={destructive ? "destructive" : "primary"}
              onPress={() => {
                onConfirm?.()
                onClose()
              }}
            >
              {confirmLabel}
            </Button>
          </View>
        </>
      }
    />
  )
}
