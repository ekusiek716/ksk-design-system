import React from "react"
import { View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { Skeleton } from "./Skeleton"

export interface ListSkeletonsProps {
  count?: number
  /** アイテムの形 */
  variant?: "row" | "card" | "list"
}

export interface ListSkeletonProps {
  rows?: number
  hasFilter?: boolean
  rowHeight?: number
}

export interface GridSkeletonProps {
  rows?: number
  columns?: number
  cardHeight?: number
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

export function ListSkeleton({
  rows = 5,
  hasFilter = true,
  rowHeight = 56,
}: ListSkeletonProps) {
  const { scales } = useTheme()
  return (
    <View style={{ gap: scales.spacing.scale[2] }}>
      {hasFilter && (
        <View style={{ flexDirection: "row", gap: scales.spacing.scale[2], marginBottom: scales.spacing.scale[1] }}>
          <Skeleton width={80} height={36} radius={scales.borderRadius.full} />
          <Skeleton width={80} height={36} radius={scales.borderRadius.full} />
          <Skeleton width={80} height={36} radius={scales.borderRadius.full} />
        </View>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} width="100%" height={rowHeight} radius={scales.borderRadius["2xl"]} />
      ))}
    </View>
  )
}

export function GridSkeleton({
  rows = 3,
  columns = 2,
  cardHeight = 140,
}: GridSkeletonProps) {
  const { scales } = useTheme()
  const normalizedColumns = Math.max(1, Math.min(columns, 4))
  const itemCount = Math.max(0, rows) * normalizedColumns
  const gutter = scales.spacing.scale[3]

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -gutter / 2 }}>
      {Array.from({ length: itemCount }).map((_, i) => (
        <View
          key={i}
          style={{
            width: `${100 / normalizedColumns}%`,
            paddingHorizontal: gutter / 2,
            marginBottom: gutter,
          }}
        >
          <Skeleton width="100%" height={cardHeight} radius={scales.borderRadius["2xl"]} />
        </View>
      ))}
    </View>
  )
}
