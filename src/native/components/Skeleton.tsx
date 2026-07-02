import React, { useEffect, useState } from "react"
import { Animated, View, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface SkeletonProps {
  width?: number | `${number}%`
  height?: number
  radius?: number
  style?: ViewStyle
}

export function Skeleton({ width = "100%", height = 16, radius, style }: SkeletonProps) {
  const { theme, scales } = useTheme()
  const [opacity] = useState(() => new Animated.Value(0.4))

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])

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
