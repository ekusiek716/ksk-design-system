import React, { useEffect, useState } from "react"
import { Animated, View, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { useReduceMotionState } from "./use-reduce-motion"

/** 明滅の下端。ループはこの値から始まる（Animated.loop は各周回の前に初期値へ戻す） */
const PULSE_MIN_OPACITY = 0.4
/** 「視差効果を減らす」がオンのときの固定の不透明度。明滅の中ほどにして枠が見えるようにする（#802） */
const STATIC_OPACITY = 0.7

export interface SkeletonProps {
  width?: number | `${number}%`
  height?: number
  radius?: number
  style?: ViewStyle
}

export function Skeleton({ width = "100%", height = 16, radius, style }: SkeletonProps) {
  const { theme, scales } = useTheme()
  const [opacity] = useState(() => new Animated.Value(PULSE_MIN_OPACITY))
  // OS の「視差効果を減らす」。オンの間と、取得前（!resolved）の間は明滅を始めない
  // （use-reduce-motion の約束。Web 版の motion-reduce:animate-none と同じ扱い。#802）
  const { reduceMotion, resolved } = useReduceMotionState()
  const suppressMotion = !resolved || reduceMotion

  useEffect(() => {
    if (suppressMotion) {
      // 設定オンと分かったら固定の不透明度で見せる。取得前は初期値のまま待つ
      // （設定オフと分かったときに明滅をその値から途切れなく始めるため）
      if (reduceMotion) opacity.setValue(STATIC_OPACITY)
      return
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: PULSE_MIN_OPACITY, duration: 800, useNativeDriver: true }),
      ]),
    )
    loop.start()
    // 表示中に設定がオンになったら、この cleanup でループを止める（#802）
    return () => loop.stop()
  }, [opacity, suppressMotion, reduceMotion])

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.surface.tertiary,
          borderRadius: radius ?? scales.borderRadius.md,
          opacity,
        },
        style,
      ]}
    />
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={12} width={i === lines - 1 ? "60%" : "100%"} />
      ))}
    </View>
  )
}
