import React, { useState } from "react"
import { View, type LayoutChangeEvent } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { sliderRatio, sliderValueFromX } from "../slider-value"

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

  // x は外側コンテナ左端からの距離。子 View を pointerEvents="none" にしているので
  // locationX は常にコンテナ基準になる（issue #817）。
  const updateFromX = (x: number) => {
    const next = sliderValueFromX({ x, width, min, max, step })
    if (next !== null) onChange?.(next)
  }

  const ratio = sliderRatio({ value, min, max })
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
      {/* 溝・塗り・つまみは pointerEvents="none"。子がタッチ対象になると locationX が
          その子の左端基準になり、つまみを押した瞬間に値が最小値付近へ飛ぶ（issue #817）。 */}
      <View
        pointerEvents="none"
        style={{
          height: 6,
          borderRadius: scales.borderRadius.full,
          backgroundColor: theme.surface.tertiary,
        }}
      />
      <View
        pointerEvents="none"
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
        pointerEvents="none"
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
