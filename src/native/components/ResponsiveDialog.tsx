import React from "react"
import { Dimensions, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Dialog, type DialogProps } from "./Dialog"
import { Sheet } from "./Sheet"

export interface ResponsiveDialogProps extends DialogProps {
  /** width <= breakpoint で BottomSheet 化（既定 600） */
  breakpoint?: number
}

/**
 * sm 以下では Sheet(bottom)、それ以上は Dialog。
 * Sheet 側でも Dialog と同じく description を表示し、本文とフッターの間に
 * scale[3]、フッター内の要素間に scale[2] の余白を取る（issue #604）。
 * スマホ幅ではフッターのボタンは縦積み（全幅）になる。
 */
export function ResponsiveDialog({ breakpoint = 600, ...props }: ResponsiveDialogProps) {
  const { theme, scales } = useTheme()
  const { width } = Dimensions.get("window")
  if (width <= breakpoint) {
    return (
      <Sheet open={props.open} onClose={props.onClose} side="bottom" title={props.title}>
        <View style={{ gap: scales.spacing.scale[3] }}>
          {props.description ? (
            <RNText style={[resolveTypo("body.md"), { color: theme.text["medium-emphasis"] }]}>
              {props.description}
            </RNText>
          ) : null}
          {props.children}
          {props.footer ? <View style={{ gap: scales.spacing.scale[2] }}>{props.footer}</View> : null}
        </View>
      </Sheet>
    )
  }
  return <Dialog {...props} />
}
