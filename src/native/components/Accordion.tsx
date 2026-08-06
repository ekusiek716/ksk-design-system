import React, { useCallback, useState } from "react"
import { Pressable, View, Text as RNText, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { nextAccordionKeys, normalizeAccordionKeys, type AccordionType } from "../disclosure-state"

export interface AccordionItem {
  key: string
  title: string
  content: React.ReactNode
  /** 見出し右端のスロット（例: 「表示する」/「閉じる」）。関数なら開閉状態を受け取る。 */
  trailing?: React.ReactNode | ((open: boolean) => React.ReactNode)
  /** 見出しの読み上げラベル。未指定なら title が使われる。 */
  accessibilityLabel?: string
}

/**
 * Accordion — 複数セクションの折りたたみ。
 *
 * 制御 / 非制御の両対応（issue #298②）:
 * - 非制御: `defaultOpenKeys` のみ指定。内部 state で開閉する。
 * - 制御:   `openKeys` を渡すと内部 state を無視し、常にその配列に従う。
 *           トグル時は `onOpenChange(nextKeys)` が呼ばれる。
 */
export interface AccordionProps {
  items: AccordionItem[]
  type?: AccordionType
  /** 非制御モードの初期状態。`openKeys` を渡した場合は無視される。 */
  defaultOpenKeys?: string[]
  /** 制御モードの開閉キー。指定すると内部 state ではなくこの配列に従う。 */
  openKeys?: string[]
  /** トグルされたときに次の開閉キー配列を通知する。制御・非制御どちらでも呼ばれる。 */
  onOpenChange?: (openKeys: string[]) => void
  style?: StyleProp<ViewStyle>
}

export function Accordion({
  items,
  type = "single",
  defaultOpenKeys = [],
  openKeys: controlledOpenKeys,
  onOpenChange,
  style,
}: AccordionProps) {
  const { theme, scales } = useTheme()
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(() =>
    normalizeAccordionKeys(defaultOpenKeys, type),
  )
  const isControlled = controlledOpenKeys !== undefined
  const openKeys = isControlled
    ? normalizeAccordionKeys(controlledOpenKeys, type)
    : internalOpenKeys

  const toggle = useCallback(
    (key: string) => {
      const next = nextAccordionKeys(openKeys, key, type)
      if (!isControlled) setInternalOpenKeys(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange, openKeys, type],
  )

  return (
    <View
      style={[
        {
          borderRadius: scales.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.border["low-emphasis"],
          backgroundColor: theme.surface.primary,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {items.map((it, i) => {
        const open = openKeys.includes(it.key)
        const trailingNode = typeof it.trailing === "function" ? it.trailing(open) : it.trailing
        return (
          <View
            key={it.key}
            style={{
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: theme.border["low-emphasis"],
            }}
          >
            <Pressable
              onPress={() => toggle(it.key)}
              accessibilityRole="button"
              accessibilityLabel={it.accessibilityLabel ?? it.title}
              accessibilityState={{ expanded: open }}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                // trailing を使わない既存呼び出しの余白を変えない
                gap: trailingNode ? scales.spacing.scale[2] : undefined,
                padding: scales.spacing.scale[4],
                backgroundColor: pressed ? theme.surface.secondary : "transparent",
              })}
            >
              <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"], flex: 1 }]}>
                {it.title}
              </RNText>
              {typeof trailingNode === "string" ? (
                <RNText style={[resolveTypo("label.sm"), { color: theme.text["accent-primary"] }]}>
                  {trailingNode}
                </RNText>
              ) : (
                trailingNode
              )}
              <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>
                {open ? "▾" : "▸"}
              </RNText>
            </Pressable>
            {open && (
              <View
                style={{
                  paddingHorizontal: scales.spacing.scale[4],
                  paddingBottom: scales.spacing.scale[4],
                }}
              >
                {it.content}
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}
