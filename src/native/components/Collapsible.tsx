import React, { useCallback, useState } from "react"
import {
  Pressable,
  View,
  Text as RNText,
  type AccessibilityProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { isControlledOpen, resolveOpenState } from "../disclosure-state"

/**
 * Collapsible — 単独の折りたたみ。
 *
 * 制御 / 非制御の両対応（issue #298②）:
 * - 非制御: `defaultOpen` のみ指定。内部 state で開閉する。
 * - 制御:   `open` を渡すと内部 state を無視し、常に `open` に従う。
 *           トグル時は `onOpenChange(next)` が呼ばれるので、consumer 側の
 *           state（他セクションとの排他、解答表示との連動など）と同期できる。
 *
 * `trailing` はトグル右端のスロット。開閉状態を受け取る関数も渡せるため、
 * 「表示する / 閉じる」のようなラベル切り替えを consumer 側で自作しなくて済む。
 */
export interface CollapsibleProps extends AccessibilityProps {
  title: string
  /** 非制御モードの初期状態。`open` を渡した場合は無視される。 */
  defaultOpen?: boolean
  /** 制御モードの開閉状態。指定すると内部 state ではなくこの値に従う。 */
  open?: boolean
  /** トグルされたときに次の状態を通知する。制御・非制御どちらでも呼ばれる。 */
  onOpenChange?: (open: boolean) => void
  /** トグル右端のスロット（例: 「表示する」/「閉じる」）。関数なら開閉状態を受け取る。 */
  trailing?: React.ReactNode | ((open: boolean) => React.ReactNode)
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
}

export function Collapsible({
  title,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  trailing,
  style,
  children,
  accessibilityRole,
  accessibilityLabel,
  accessibilityState,
  ...accessibilityProps
}: CollapsibleProps) {
  const { theme, scales } = useTheme()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = resolveOpenState(controlledOpen, internalOpen)

  const toggle = useCallback(() => {
    const next = !open
    if (!isControlledOpen(controlledOpen)) setInternalOpen(next)
    onOpenChange?.(next)
  }, [controlledOpen, onOpenChange, open])

  const trailingNode = typeof trailing === "function" ? trailing(open) : trailing

  return (
    <View style={style}>
      <Pressable
        onPress={toggle}
        accessibilityRole={accessibilityRole ?? "button"}
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ expanded: open, ...accessibilityState }}
        // レイアウトを変えずに実タップ領域を広げる（minHeight を足すと
        // 既存 consumer の縦リズムが黙って変わるため hitSlop で補う）。
        hitSlop={8}
        {...accessibilityProps}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: scales.spacing.scale[1],
          // アイコン + タイトルと trailing の間を空ける（trailing 無しでも
          // 従来と同じ左寄せに見えるよう、タイトル側を flex-1 で伸ばす）。
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scales.spacing.scale[1],
            flex: 1,
            minWidth: 0,
          }}
        >
          <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>
            {open ? "▾" : "▸"}
          </RNText>
          <RNText
            style={[resolveTypo("label.md"), { color: theme.text["accent-primary"], flex: 1 }]}
          >
            {title}
          </RNText>
        </View>
        {typeof trailingNode === "string" ? (
          <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>
            {trailingNode}
          </RNText>
        ) : (
          trailingNode
        )}
      </Pressable>
      {open && <View style={{ marginTop: scales.spacing.scale[2] }}>{children}</View>}
    </View>
  )
}
