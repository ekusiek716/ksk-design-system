import React, { useState } from "react"
import {
  Animated,
  PanResponder,
  Pressable,
  View,
  Text as RNText,
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface SwipeAction {
  label: string
  color?: string
  textColor?: string
  onPress: () => void
  /** VoiceOver/TalkBack 用のアクションラベル・ボタンラベル。既定は label。 */
  accessibilityLabel?: string
}

export interface SwipeRowProps {
  rightActions?: SwipeAction[]
  actionWidth?: number
  children: React.ReactNode
  /**
   * 行本体の accessibilityActions（VoiceOver のローターから rightActions を
   * 実行できるようにする、issue #342）。既定は rightActions から自動生成。
   * 呼び出し側が明示した場合はそちらを優先する。
   */
  accessibilityActions?: AccessibilityActionInfo[]
  /** accessibilityActions のハンドラ。既定は actionName === label で rightActions の onPress を呼ぶ。 */
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void
}

/** 右からスワイプして action を出す簡易行。Animated.Value + PanResponder のみで実装。 */
export function SwipeRow({
  rightActions = [],
  actionWidth = 80,
  children,
  accessibilityActions,
  onAccessibilityAction,
}: SwipeRowProps) {
  const { theme } = useTheme()
  // render 中の ref 読み取りを避けるため useState の lazy initializer で一度だけ生成
  const [translateX] = useState(() => new Animated.Value(0))
  const openedWidth = rightActions.length * actionWidth

  const [responder] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8,
      onPanResponderMove: (_, g) => {
        const next = Math.min(0, Math.max(-openedWidth, g.dx))
        translateX.setValue(next)
      },
      onPanResponderRelease: (_, g) => {
        const open = g.dx < -openedWidth / 2
        Animated.spring(translateX, {
          toValue: open ? -openedWidth : 0,
          useNativeDriver: true,
        }).start()
      },
    }),
  )

  const runAction = (a: SwipeAction) => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start()
    a.onPress()
  }

  // 支援技術からスワイプ操作を代替する既定値（issue #342）。PanResponder の
  // ドラッグは VoiceOver/TalkBack から実行できないため、行本体に
  // accessibilityActions を持たせ rightActions を実行可能にする。
  // 呼び出し側の明示値が常に優先される。
  const defaultAccessibilityActions: AccessibilityActionInfo[] = rightActions.map((a) => ({
    name: a.label,
    label: a.accessibilityLabel ?? a.label,
  }))
  const defaultOnAccessibilityAction = (event: AccessibilityActionEvent) => {
    const action = rightActions.find((a) => a.label === event.nativeEvent.actionName)
    if (action) runAction(action)
  }

  return (
    <View style={{ position: "relative", overflow: "hidden" }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          flexDirection: "row",
        }}
      >
        {rightActions.map((a, i) => (
          <Pressable
            key={i}
            onPress={() => runAction(a)}
            accessibilityRole="button"
            accessibilityLabel={a.accessibilityLabel ?? a.label}
            style={{
              width: actionWidth,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: a.color ?? theme.caution.base,
            }}
          >
            <RNText style={[resolveTypo("label.md"), { color: a.textColor ?? theme.text["on-inverse"] }]}>
              {a.label}
            </RNText>
          </Pressable>
        ))}
      </View>
      <Animated.View
        accessible={rightActions.length > 0 ? true : undefined}
        accessibilityActions={
          rightActions.length > 0 ? accessibilityActions ?? defaultAccessibilityActions : undefined
        }
        onAccessibilityAction={
          rightActions.length > 0 ? onAccessibilityAction ?? defaultOnAccessibilityAction : undefined
        }
        style={{
          transform: [{ translateX }],
          backgroundColor: theme.surface.primary,
        }}
        {...responder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  )
}
