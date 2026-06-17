import React from "react"
import { View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Separator } from "./Separator"

export interface OrderSummaryLine {
  label: string
  value: number
  emphasis?: "normal" | "discount" | "total"
}

export interface OrderSummaryProps {
  lines: OrderSummaryLine[]
  currency?: string
}

function fmt(n: number, currency: string) {
  return `${currency}${n.toLocaleString("ja-JP")}`
}

export function OrderSummary({ lines, currency = "¥" }: OrderSummaryProps) {
  const { theme, scales } = useTheme()
  return (
    <View
      style={{
        backgroundColor: theme.surface.primary,
        borderColor: theme.border["low-emphasis"],
        borderWidth: 1,
        borderRadius: scales.borderRadius.lg,
        padding: scales.spacing.scale[4],
        gap: scales.spacing.scale[2],
      }}
    >
      {lines.map((l, i) => {
        const isTotal = l.emphasis === "total"
        const isDiscount = l.emphasis === "discount"
        const valueColor = isDiscount
          ? theme.text.caution
          : isTotal
          ? theme.text["accent-primary"]
          : theme.text["high-emphasis"]
        const labelStyle = isTotal ? resolveTypo("label.lg") : resolveTypo("body.md")
        const valueStyle = isTotal ? resolveTypo("heading.lg") : resolveTypo("body.md")
        return (
          <React.Fragment key={i}>
            {isTotal && <Separator />}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <RNText style={[labelStyle, { color: theme.text["medium-emphasis"] }]}>{l.label}</RNText>
              <RNText style={[valueStyle, { color: valueColor }]}>
                {isDiscount && l.value > 0 ? "-" : ""}
                {fmt(l.value, currency)}
              </RNText>
            </View>
          </React.Fragment>
        )
      })}
    </View>
  )
}
