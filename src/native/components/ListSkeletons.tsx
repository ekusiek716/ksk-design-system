import React from "react"
import { View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { Skeleton } from "./Skeleton"

export interface ListSkeletonsProps {
  count?: number
  /** アイテムの形 */
  variant?: "row" | "card" | "list"
}

export function ListSkeletons({ count = 3, variant = "row" }: ListSkeletonsProps) {
  const { scales } = useTheme()
  return (
    <View style={{ gap: scales.spacing.scale[3] }}>
      {Array.from({ length: count }).map((_, i) => {
        if (variant === "card") {
          return (
            <View key={i} style={{ gap: scales.spacing.scale[2] }}>
              <Skeleton height={140} radius={scales.borderRadius.lg} />
              <Skeleton height={14} width="60%" />
              <Skeleton height={12} width="40%" />
            </View>
          )
        }
        if (variant === "list") {
          return (
            <View key={i} style={{ gap: 8 }}>
              <Skeleton height={14} width="80%" />
              <Skeleton height={12} width="50%" />
            </View>
          )
        }
        return (
          <View key={i} style={{ flexDirection: "row", gap: scales.spacing.scale[3], alignItems: "center" }}>
            <Skeleton width={48} height={48} radius={24} />
            <View style={{ flex: 1, gap: 6 }}>
              <Skeleton height={14} width="70%" />
              <Skeleton height={12} width="50%" />
            </View>
          </View>
        )
      })}
    </View>
  )
}
