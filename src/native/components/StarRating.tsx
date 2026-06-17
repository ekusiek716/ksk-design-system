import React from "react"
import { View, Pressable, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface StarRatingProps {
  value: number
  max?: number
  size?: number
  onChange?: (value: number) => void
  readOnly?: boolean
}

/** ★を文字で描画する簡易実装。半端値は0.5刻みで切り捨て。 */
export function StarRating({ value, max = 5, size = 20, onChange, readOnly = false }: StarRatingProps) {
  const { theme } = useTheme()
  const filledColor = theme.object.rating
  const emptyColor = theme.object["low-emphasis"]
  const safe = Math.max(0, Math.min(max, value))

  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => {
        const isFull = i + 1 <= safe
        const isHalf = !isFull && i + 0.5 <= safe
        const charColor = isFull || isHalf ? filledColor : emptyColor
        const char = isHalf ? "★" : isFull ? "★" : "☆"

        const star = (
          <RNText
            style={{
              fontSize: size,
              color: charColor,
              opacity: isHalf ? 0.5 : 1,
            }}
          >
            {char}
          </RNText>
        )

        if (readOnly || !onChange) {
          return <View key={i}>{star}</View>
        }
        return (
          <Pressable key={i} onPress={() => onChange(i + 1)} hitSlop={8}>
            {star}
          </Pressable>
        )
      })}
    </View>
  )
}
