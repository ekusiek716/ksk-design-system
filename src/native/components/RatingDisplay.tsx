import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { StarRating } from "./StarRating"

export interface RatingDisplayProps {
  rating: number
  count?: number
  size?: number
  layout?: "row" | "stacked"
}

export function RatingDisplay({ rating, count, size = 16, layout = "row" }: RatingDisplayProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        flexDirection: layout === "row" ? "row" : "column",
        alignItems: layout === "row" ? "center" : "flex-start",
        gap: scales.spacing.scale[1],
      }}
    >
      <StarRating value={rating} size={size} readOnly />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <RNText style={[resolveTypo("label.sm"), { color: theme.text["high-emphasis"] }]}>
          {rating.toFixed(1)}
        </RNText>
        {count !== undefined && (
          <RNText style={[resolveTypo("body.sm"), { color: theme.text["low-emphasis"] }]}>
            ({count.toLocaleString("ja-JP")})
          </RNText>
        )}
      </View>
    </View>
  )
}
