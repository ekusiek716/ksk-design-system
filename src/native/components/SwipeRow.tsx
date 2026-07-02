import React, { useState } from "react"
import { Animated, PanResponder, Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface SwipeAction {
  label: string
  color?: string
  textColor?: string
  onPress: () => void
}

export interface SwipeRowProps {
  rightActions?: SwipeAction[]
  actionWidth?: number
  children: React.ReactNode
}

/** 右からスワイプして action を出す簡易行。Animated.Value + PanResponder のみで実装。 */
export function SwipeRow({ rightActions = [], actionWidth = 80, children }: SwipeRowProps) {
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
            onPress={() => {
              Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start()
              a.onPress()
            }}
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
