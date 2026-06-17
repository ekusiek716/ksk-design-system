import React, { useMemo, useState } from "react"
import { Pressable, View, Text as RNText } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"

export interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  locale?: "ja" | "en"
}

const WEEK_LABELS_JA = ["日", "月", "火", "水", "木", "金", "土"]
const WEEK_LABELS_EN = ["S", "M", "T", "W", "T", "F", "S"]
const MONTH_LABELS_JA = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
]

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function Calendar({ value, onChange, minDate, maxDate, locale = "ja" }: CalendarProps) {
  const { theme, scales } = useTheme()
  const [cursor, setCursor] = useState<Date>(value ?? new Date())

  const labels = locale === "ja" ? WEEK_LABELS_JA : WEEK_LABELS_EN

  const cells = useMemo(() => {
    const first = startOfMonth(cursor)
    const leading = first.getDay()
    const total = daysInMonth(cursor)
    const arr: (Date | null)[] = []
    for (let i = 0; i < leading; i++) arr.push(null)
    for (let d = 1; d <= total; d++) arr.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [cursor])

  const monthLabel =
    locale === "ja"
      ? `${cursor.getFullYear()}年 ${MONTH_LABELS_JA[cursor.getMonth()]}`
      : `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`

  const goPrev = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
  const goNext = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))

  return (
    <View
      style={{
        backgroundColor: theme.surface.primary,
        borderRadius: scales.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.border["low-emphasis"],
        padding: scales.spacing.scale[3],
        gap: scales.spacing.scale[2],
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Pressable onPress={goPrev} hitSlop={8}>
          <RNText style={[resolveTypo("label.lg"), { color: theme.text["medium-emphasis"] }]}>‹</RNText>
        </Pressable>
        <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>
          {monthLabel}
        </RNText>
        <Pressable onPress={goNext} hitSlop={8}>
          <RNText style={[resolveTypo("label.lg"), { color: theme.text["medium-emphasis"] }]}>›</RNText>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row" }}>
        {labels.map((l, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <RNText style={[resolveTypo("label.xs"), { color: theme.text["low-emphasis"] }]}>{l}</RNText>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {cells.map((c, i) => {
          if (!c) return <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />
          const disabled =
            (minDate && c < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) ||
            (maxDate && c > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()))
          const selected = value && isSameDay(c, value)
          const today = isSameDay(c, new Date())
          return (
            <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 2 }}>
              <Pressable
                onPress={() => !disabled && onChange?.(c)}
                disabled={!!disabled}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: scales.borderRadius.full,
                  backgroundColor: selected ? theme.brand.primary : "transparent",
                  borderWidth: today && !selected ? 1 : 0,
                  borderColor: theme.border["accent-primary"],
                  opacity: disabled ? 0.3 : 1,
                }}
              >
                <RNText
                  style={[
                    resolveTypo("body.sm"),
                    {
                      color: selected ? theme.text["on-inverse"] : theme.text["high-emphasis"],
                      fontWeight: selected || today ? "700" : "400",
                    },
                  ]}
                >
                  {c.getDate()}
                </RNText>
              </Pressable>
            </View>
          )
        })}
      </View>
    </View>
  )
}
