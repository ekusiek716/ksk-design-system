import React, { useState } from "react"
import { View, type LayoutChangeEvent } from "react-native"
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

  const clamp = (v: number) => Math.max(min, Math.min(max, v))
  const snap = (v: number) => {
    if (!step) return v
    return Math.round(v / step) * step
  }

  const updateFromX = (x: number) => {
    if (!width) return
    const ratio = Math.max(0, Math.min(1, x / width))
    const next = clamp(snap(min + (max - min) * ratio))
    onChange?.(next)
  }

  const ratio = (clamp(value) - min) / (max - min)
  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width)
  }

  // PanResponder を render 中に生成すると react-hooks/refs 違反になるため、
  // View の responder props を直接使う。毎 render 最新の props/width を
  // 参照するクロージャになるので stale closure も解消される。
  return (
    <View
      onLayout={onLayout}
      onStartShouldSetResponder={() => !disabled}
      onMoveShouldSetResponder={() => !disabled}
      onResponderGrant={(e) => updateFromX(e.nativeEvent.locationX)}
      onResponderMove={(e) => updateFromX(e.nativeEvent.locationX)}
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
