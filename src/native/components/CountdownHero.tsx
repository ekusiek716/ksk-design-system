import React, { useMemo } from "react"
import { Text as RNText, View, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export interface CountdownHeroProps {
  targetDate: Date | string
  label?: string
  todayLabel?: string
  pastLabel?: string
  unit?: string
  illustration?: React.ReactNode
  style?: ViewStyle
  testID?: string
}

function toLocalMidnight(d: Date) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function calcDaysLeft(target: Date): number {
  const today = toLocalMidnight(new Date())
  const t = toLocalMidnight(target)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((t.getTime() - today.getTime()) / msPerDay)
}

/**
 * CountdownHero（native） — 装飾的な巨大数字で目標日までの残日数を表示する。
 * web 版と同じロジック（ローカルタイム基準の日数計算）。RN には CSS var / serif
 * フォントフォールバック機構が無いため、フォントは OS 標準の serif ファミリー名
 * （iOS: "Georgia" / Android: "serif"）を Platform 分岐せず単純に "serif" 指定し、
 * 消費側で theme.typography 拡張時に差し替えられるようにする。
 */
export function CountdownHero({
  targetDate,
  label = "残り",
  todayLabel = "本日",
  pastLabel = "経過",
  unit = "days",
  illustration,
  style,
  testID,
}: CountdownHeroProps) {
  const { theme, scales } = useTheme()
  const target = useMemo(
    () => (targetDate instanceof Date ? targetDate : new Date(targetDate)),
    [targetDate],
  )
  const daysLeft = calcDaysLeft(target)
  const isToday = daysLeft === 0
  const isPast = daysLeft < 0
  const daysAbs = Math.abs(daysLeft)
  const displayLabel = isToday ? todayLabel : isPast ? pastLabel : label
  const valueText = isToday ? "0" : String(daysAbs)

  return (
    <View testID={testID} style={[{ position: "relative" }, style]}>
      {illustration && (
        <View pointerEvents="none" style={{ position: "absolute", top: 0, right: 0 }}>
          {illustration}
        </View>
      )}
      <View>
        <RNText style={{ fontSize: 12, lineHeight: 14, color: theme.text["low-emphasis"] }}>
          {displayLabel}
        </RNText>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: scales.spacing.scale[1] }}>
          <RNText
            style={{
              fontFamily: "serif",
              fontWeight: "400",
              fontSize: daysAbs >= 100 ? 64 : 88,
              lineHeight: daysAbs >= 100 ? 68 : 92,
              color: theme.text["accent-primary"],
            }}
          >
            {valueText}
          </RNText>
          {!isToday && (
            <RNText
              style={{
                fontFamily: "serif",
                fontWeight: "400",
                fontSize: 22,
                lineHeight: 24,
                color: theme.text["accent-primary"],
              }}
            >
              {unit}
            </RNText>
          )}
        </View>
      </View>
    </View>
  )
}
