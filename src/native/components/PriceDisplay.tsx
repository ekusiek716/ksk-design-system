import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface PriceDisplayProps {
  price: number
  originalPrice?: number
  currency?: string
  size?: "sm" | "md" | "lg"
  showTax?: boolean
}

function formatPrice(n: number, currency = "¥") {
  return `${currency}${n.toLocaleString("ja-JP")}`
}

export function PriceDisplay({
  price,
  originalPrice,
  currency = "¥",
  size = "md",
  showTax = true,
}: PriceDisplayProps) {
  const { theme, scales } = useTheme()
  const hasDiscount = typeof originalPrice === "number" && originalPrice > price
  const discountPct = hasDiscount ? Math.round((1 - price / originalPrice!) * 100) : 0

  const main =
    size === "lg" ? resolveTypo("heading.2xl") : size === "sm" ? resolveTypo("label.md") : resolveTypo("heading.lg")

  return (
    <View style={{ gap: 2 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          gap: scales.spacing.scale[2],
          flexWrap: "wrap",
        }}
      >
        {hasDiscount && (
          <RNText
            style={[
              resolveTypo("label.md"),
              { color: theme.caution.base, fontWeight: "700" },
            ]}
          >
            {discountPct}% OFF
          </RNText>
        )}
        <RNText style={[main, { color: theme.text["high-emphasis"] }]}>{formatPrice(price, currency)}</RNText>
        {showTax && (
          <RNText style={[resolveTypo("body.sm"), { color: theme.text["low-emphasis"] }]}>税込</RNText>
        )}
      </View>
      {hasDiscount && (
        <RNText
          style={[
            resolveTypo("body.sm"),
            { color: theme.text["low-emphasis"], textDecorationLine: "line-through" },
          ]}
        >
          {formatPrice(originalPrice!, currency)}
        </RNText>
      )}
    </View>
  )
}
