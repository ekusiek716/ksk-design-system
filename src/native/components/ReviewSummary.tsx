import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { StarRating } from "./StarRating"

export interface ReviewSummaryProps {
  average: number
  total: number
  /** rating -> 件数 のマップ。例: { 5: 120, 4: 32, 3: 11, 2: 4, 1: 2 } */
  distribution: Record<number, number>
}

export function ReviewSummary({ average, total, distribution }: ReviewSummaryProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        flexDirection: "row",
        gap: scales.spacing.scale[4],
        padding: scales.spacing.scale[4],
        backgroundColor: theme.surface.primary,
        borderRadius: scales.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.border["low-emphasis"],
      }}
    >
      <View style={{ alignItems: "center", gap: scales.spacing.scale[1], minWidth: 100 }}>
        <RNText style={[resolveTypo("heading.3xl"), { color: theme.text["high-emphasis"] }]}>
          {average.toFixed(1)}
        </RNText>
        <StarRating value={average} size={16} readOnly />
        <RNText style={[resolveTypo("body.sm"), { color: theme.text["low-emphasis"] }]}>
          {total.toLocaleString("ja-JP")} 件
        </RNText>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        {[5, 4, 3, 2, 1].map((r) => {
          const count = distribution[r] ?? 0
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <View
              key={r}
              style={{ flexDirection: "row", alignItems: "center", gap: scales.spacing.scale[2] }}
            >
              <RNText style={[resolveTypo("label.sm"), { color: theme.text["medium-emphasis"], width: 16 }]}>
                {r}
              </RNText>
              <View
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: theme.surface.tertiary,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    backgroundColor: theme.object.rating,
                  }}
                />
              </View>
              <RNText
                style={[
                  resolveTypo("body.sm"),
                  { color: theme.text["low-emphasis"], width: 40, textAlign: "right" },
                ]}
              >
                {count}
              </RNText>
            </View>
          )
        })}
      </View>
    </View>
  )
}
