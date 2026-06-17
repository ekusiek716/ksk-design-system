import React from "react"
import { View, Text as RNText, type ImageSourcePropType } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Avatar } from "./Avatar"
import { StarRating } from "./StarRating"

export interface ReviewCardProps {
  authorName: string
  authorAvatar?: ImageSourcePropType
  rating: number
  date?: string
  title?: string
  comment: string
  helpfulCount?: number
}

export function ReviewCard({
  authorName,
  authorAvatar,
  rating,
  date,
  title,
  comment,
  helpfulCount,
}: ReviewCardProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        backgroundColor: theme.surface.primary,
        borderRadius: scales.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.border["low-emphasis"],
        padding: scales.spacing.scale[4],
        gap: scales.spacing.scale[2],
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: scales.spacing.scale[2] }}>
        <Avatar source={authorAvatar} fallback={authorName[0]} size="sm" />
        <View style={{ flex: 1 }}>
          <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>
            {authorName}
          </RNText>
          {date && (
            <RNText style={[resolveTypo("body.sm"), { color: theme.text["low-emphasis"] }]}>{date}</RNText>
          )}
        </View>
        <StarRating value={rating} size={14} readOnly />
      </View>
      {title && (
        <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>
          {title}
        </RNText>
      )}
      <RNText style={[resolveTypo("body.md"), { color: theme.text["high-emphasis"] }]}>
        {comment}
      </RNText>
      {helpfulCount !== undefined && (
        <RNText style={[resolveTypo("label.sm"), { color: theme.text["low-emphasis"] }]}>
          参考になった {helpfulCount}
        </RNText>
      )}
    </View>
  )
}
