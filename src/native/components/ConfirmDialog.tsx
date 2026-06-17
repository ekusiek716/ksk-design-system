import React from "react"
import { AlertDialog, type AlertDialogProps } from "./AlertDialog"

export interface ConfirmDialogProps extends Omit<AlertDialogProps, "confirmLabel" | "cancelLabel"> {
  confirmLabel?: string
  cancelLabel?: string
}

/** AlertDialog の薄いラッパ（語感の違い吸収用）。 */
export function ConfirmDialog(props: ConfirmDialogProps) {
  return <AlertDialog {...props} />
}
