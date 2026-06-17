import React, { useRef, useState } from "react"
import { View, PanResponder, type LayoutChangeEvent } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface SliderProps {
  value: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
}: SliderProps) {
  const { theme, scales } = useTheme()
  const [width, setWidth] = useState(0)
  const widthRef = useRef(0)

  const clamp = (v: number) => Math.max(min, Math.min(max, v))
  const snap = (v: number) => {
    if (!step) return v
    return Math.round(v / step) * step
  }

  const updateFromX = (x: number) => {
    if (!widthRef.current) return
    const ratio = Math.max(0, Math.min(1, x / widthRef.current))
    const next = clamp(snap(min + (max - min) * ratio))
    onChange?.(next)
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (e) => updateFromX(e.nativeEvent.locationX),
      onPanResponderMove: (e) => updateFromX(e.nativeEvent.locationX),
    }),
  ).current

  const ratio = (clamp(value) - min) / (max - min)
  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    setWidth(w)
    widthRef.current = w
  }

  return (
    <View
      onLayout={onLayout}
      {...panResponder.panHandlers}
      style={{
        height: 32,
        justifyContent: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View
        style={{
          height: 6,
          borderRadius: scales.borderRadius.full,
          backgroundColor: theme.surface.tertiary,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          height: 6,
          width: width * ratio,
          borderRadius: scales.borderRadius.full,
          backgroundColor: theme.brand.primary,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: width * ratio - 10,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: theme.brand.primary,
          borderWidth: 2,
          borderColor: theme.surface.primary,
        }}
      />
    </View>
  )
}
