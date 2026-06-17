import React from "react"
import { Image, Pressable, View, Text as RNText, type ImageSourcePropType } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { PriceDisplay } from "./PriceDisplay"
import { RatingDisplay } from "./RatingDisplay"
import { Tag } from "./Tag"

export interface ProductCardProps {
  image?: ImageSourcePropType
  title: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  badge?: string
  soldOut?: boolean
  onPress?: () => void
  layout?: "vertical" | "horizontal"
}

export function ProductCard({
  image,
  title,
  price,
  originalPrice,
  rating,
  reviewCount,
  badge,
  soldOut,
  onPress,
  layout = "vertical",
}: ProductCardProps) {
  const { theme, scales } = useTheme()

  const isHorizontal = layout === "horizontal"
  const imageSize = isHorizontal ? 96 : "100%"
  const imageHeight = isHorizontal ? 96 : 160

  const inner = (pressed = false) => (
    <View
      style={{
        flexDirection: isHorizontal ? "row" : "column",
        gap: scales.spacing.scale[3],
        backgroundColor: theme.surface.primary,
        borderRadius: scales.borderRadius.lg,
        overflow: "hidden",
        padding: isHorizontal ? scales.spacing.scale[3] : 0,
        opacity: pressed ? 0.85 : 1,
      }}
    >
      <View style={{ position: "relative", width: imageSize as any, height: imageHeight }}>
        <Image
          source={image}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: scales.borderRadius.md,
            backgroundColor: theme.surface.tertiary,
          }}
          resizeMode="cover"
        />
        {soldOut && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme.overlay.medium,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: scales.borderRadius.md,
            }}
          >
            <RNText style={[resolveTypo("label.md"), { color: theme.text["on-inverse"] }]}>
              売り切れ
            </RNText>
          </View>
        )}
        {badge && (
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
            }}
          >
            <Tag tone="caution">{badge}</Tag>
          </View>
        )}
      </View>
      <View style={{ flex: 1, gap: 4, padding: isHorizontal ? 0 : scales.spacing.scale[3] }}>
        <RNText
          numberOfLines={2}
          style={[resolveTypo("body.md"), { color: theme.text["high-emphasis"] }]}
        >
          {title}
        </RNText>
        {rating !== undefined && (
          <RatingDisplay rating={rating} count={reviewCount} size={14} />
        )}
        <PriceDisplay price={price} originalPrice={originalPrice} size="sm" />
      </View>
    </View>
  )

  if (onPress) {
    return (
      <Pressable onPress={onPress} disabled={soldOut}>
        {({ pressed }) => inner(pressed)}
      </Pressable>
    )
  }
  return inner(false)
}
