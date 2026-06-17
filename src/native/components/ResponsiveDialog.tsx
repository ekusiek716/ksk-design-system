import React from "react"
import { Dimensions } from "react-native"
import { Dialog, type DialogProps } from "./Dialog"
import { Sheet } from "./Sheet"

export interface ResponsiveDialogProps extends DialogProps {
  /** width <= breakpoint で BottomSheet 化（既定 600） */
  breakpoint?: number
}

/** sm 以下では Sheet(bottom)、それ以上は Dialog。 */
export function ResponsiveDialog({ breakpoint = 600, ...props }: ResponsiveDialogProps) {
  const { width } = Dimensions.get("window")
  if (width <= breakpoint) {
    return (
      <Sheet open={props.open} onClose={props.onClose} side="bottom" title={props.title}>
        {props.children}
        {props.footer}
      </Sheet>
    )
  }
  return <Dialog {...props} />
}
