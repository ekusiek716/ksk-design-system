import React, { useMemo, useState } from "react"
import { Pressable, View, Text as RNText, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { IconButton } from "./IconButton"
import {
  addMonths,
  buildCalendarCells,
  canGoToMonth,
  defaultDayAccessibilityLabel,
  isDayDisabled,
  isSameDay,
  monthLabel as resolveMonthLabel,
  resolveCalendarDayColors,
  resolveCalendarWeekdayTextColor,
  resolveWeekdayTone,
  startOfMonth,
  WEEK_LABELS_EN,
  WEEK_LABELS_JA,
  type CalendarDayColors,
  type CalendarDayInfo,
  type CalendarLocale,
  type CalendarWeekdayTone,
} from "../calendar-cells"

export type { CalendarDayColors, CalendarDayInfo, CalendarWeekdayTone }

/** 今日セルの強調表現。`ring` は既定（従来動作）。 */
export type CalendarTodayEmphasis = "ring" | "dot" | "none"

export interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  locale?: CalendarLocale
  /**
   * 曜日の色分け（日=赤 / 土=青）。日本のカレンダー慣習（issue #298④）。
   * 既定 false — 有効にすると曜日ヘッダと日セルの文字色が変わるため、
   * 既存の見た目を変えないよう opt-in にしている。
   */
  weekendTone?: boolean
  /** 今日セルの強調表現。既定 `ring`（従来どおり枠線）。 */
  todayEmphasis?: CalendarTodayEmphasis
  /** 今日より前の日付を選択不可にする。minDate と併用可（遅い方が効く）。 */
  disablePast?: boolean
  /** 「今日」の基準日。省略時は new Date()。テストや擬似日付での検証に使う。 */
  today?: Date
  /** 初期表示する月。省略時は value、それも無ければ today。 */
  defaultMonth?: Date
  /** 表示月が変わったときに通知する。 */
  onMonthChange?: (month: Date) => void
  /**
   * 日セルの色の注入点（issue #304）。未指定のキーは DS theme の既定色に落ちる。
   * ThemeProvider を使わず、アプリごとのブランドトークンを props で流し込む
   * consumer（exam-kit 系）向け。`weekendTone=false` のとき sunday/saturday は効かない。
   */
  colors?: CalendarDayColors
  /**
   * 日セルのコンテナ style を最後に合成するフック（issue #304）。
   * `colors` で足りない見た目（角丸・枠線の太さ・影など）の逃げ道。
   * renderDay がセルの「中身」なのに対し、こちらはセルの「器」を差し替える。
   */
  dayStyle?: (info: CalendarDayInfo) => StyleProp<ViewStyle>
  /** 日セルの独自描画。返した要素が Pressable の中身になる。 */
  renderDay?: (info: CalendarDayInfo) => React.ReactNode
  /** 日セルの読み上げラベル生成。既定は「2026年8月6日 木曜日」形式。 */
  dayAccessibilityLabel?: (info: CalendarDayInfo) => string
  /** 前月ボタンの読み上げラベル。 */
  previousMonthLabel?: string
  /** 次月ボタンの読み上げラベル。 */
  nextMonthLabel?: string
  style?: StyleProp<ViewStyle>
}

export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  locale = "ja",
  weekendTone = false,
  todayEmphasis = "ring",
  disablePast = false,
  today: todayProp,
  defaultMonth,
  onMonthChange,
  colors,
  dayStyle,
  renderDay,
  dayAccessibilityLabel,
  previousMonthLabel,
  nextMonthLabel,
  style,
}: CalendarProps) {
  const { theme, scales } = useTheme()
  // memo 化しない: 日付をまたいで開かれたままの画面でも「今日」が古い日付に
  // 固定されないようにする（固定したい場合は today prop を渡す）。
  const today = todayProp ?? new Date()
  const [cursor, setCursor] = useState<Date>(() =>
    startOfMonth(defaultMonth ?? value ?? today),
  )

  const labels = locale === "ja" ? WEEK_LABELS_JA : WEEK_LABELS_EN
  const disabledOptions = { minDate, maxDate, disablePast, today }

  const cells = useMemo(() => buildCalendarCells(cursor), [cursor])

  const monthLabel = resolveMonthLabel(cursor, locale)
  const canGoPrev = canGoToMonth(cursor, -1, disabledOptions)
  const canGoNext = canGoToMonth(cursor, 1, disabledOptions)

  const goTo = (offset: number) => {
    const next = addMonths(cursor, offset)
    setCursor(next)
    onMonthChange?.(next)
  }

  // DS theme 由来の既定色。consumer が colors で上書きしなければこの値が使われる
  // ＝ 既存の呼び出しは見た目が変わらない（issue #304）。
  const colorDefaults = {
    selected: theme.brand.primary,
    selectedText: theme.text["on-inverse"],
    today: theme.border["accent-primary"],
    sunday: theme.text.caution,
    saturday: theme.text["accent-primary"],
    weekdayText: theme.text["high-emphasis"],
  }

  /** 曜日トーンに応じた文字色。weekendTone=false なら常に既定色。 */
  const weekdayColor = (tone: CalendarWeekdayTone, fallback: string) =>
    resolveCalendarWeekdayTextColor(tone, colorDefaults, colors, weekendTone, fallback)

  return (
    <View
      style={[
        {
          backgroundColor: theme.surface.primary,
          borderRadius: scales.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.border["low-emphasis"],
          padding: scales.spacing.scale[3],
          gap: scales.spacing.scale[2],
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {/*
          月送りは面を持つ IconButton にする（consumer 指摘: 素の Pressable + テキストだと
          押せる領域が見て分からない）。variant="tertiary" は Surface-Secondary の薄灰背景
          （CLAUDE.md の semantic token 早見表どおり）、size="sm" は視覚 36pt +
          IconButton 内部の hitSlop 補正で実効タップ領域 44pt を満たす（icon-button-metrics.ts）。
          disabled 時は IconButton 既定の opacity 減光（0.56）で区別する。
          colors/dayStyle は日セル専用の拡張点なので、ここでは既存 IconButton の
          containerStyle 拡張点をそのまま使い、Calendar 独自の新規 props は増やさない。
        */}
        <IconButton
          accessibilityLabel={previousMonthLabel ?? (locale === "ja" ? "前の月" : "Previous month")}
          onPress={() => goTo(-1)}
          disabled={!canGoPrev}
          variant="tertiary"
          size="sm"
          icon={({ color }) => (
            <RNText style={[resolveTypo("label.lg"), { color }]}>‹</RNText>
          )}
        />
        <RNText style={[resolveTypo("label.md"), { color: theme.text["high-emphasis"] }]}>
          {monthLabel}
        </RNText>
        <IconButton
          accessibilityLabel={nextMonthLabel ?? (locale === "ja" ? "次の月" : "Next month")}
          onPress={() => goTo(1)}
          disabled={!canGoNext}
          variant="tertiary"
          size="sm"
          icon={({ color }) => (
            <RNText style={[resolveTypo("label.lg"), { color }]}>›</RNText>
          )}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        {labels.map((l, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <RNText
              style={[
                resolveTypo("label.xs"),
                { color: weekdayColor(resolveWeekdayTone(i), theme.text["low-emphasis"]) },
              ]}
            >
              {l}
            </RNText>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {cells.map((c, i) => {
          if (!c) return <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />
          const weekday = c.getDay()
          const info: CalendarDayInfo = {
            date: c,
            weekday,
            selected: Boolean(value && isSameDay(c, value)),
            today: isSameDay(c, today),
            disabled: isDayDisabled(c, disabledOptions),
            tone: resolveWeekdayTone(weekday),
          }
          const showRing = info.today && !info.selected && todayEmphasis === "ring"
          const showDot = info.today && !info.selected && todayEmphasis === "dot"
          const dayColors = resolveCalendarDayColors(info, colorDefaults, colors, weekendTone)
          return (
            <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 2 }}>
              <Pressable
                onPress={() => !info.disabled && onChange?.(c)}
                disabled={info.disabled}
                accessibilityRole="button"
                accessibilityLabel={
                  dayAccessibilityLabel?.(info) ?? defaultDayAccessibilityLabel(info, locale)
                }
                accessibilityState={{ disabled: info.disabled, selected: info.selected }}
                style={[
                  {
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    borderRadius: scales.borderRadius.full,
                    backgroundColor: dayColors.background,
                    borderWidth: showRing ? 1 : 0,
                    borderColor: dayColors.accent,
                    opacity: info.disabled ? 0.3 : 1,
                  },
                  // consumer の逃げ道は最後に合成して確実に勝たせる（issue #304）
                  dayStyle?.(info),
                ]}
              >
                {renderDay ? (
                  renderDay(info)
                ) : (
                  <>
                    <RNText
                      style={[
                        resolveTypo("body.sm"),
                        {
                          color: info.selected
                            ? dayColors.text
                            : weekdayColor(info.tone, colorDefaults.weekdayText),
                          fontWeight: info.selected || info.today ? "700" : "400",
                        },
                      ]}
                    >
                      {c.getDate()}
                    </RNText>
                    {/* ドットの既定は brand.primary、ring の既定は border.accent-primary と
                        歴史的に別トークン。colors.today は両方をまとめて上書きする。 */}
                    {showDot && (
                      <View
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: colors?.today ?? theme.brand.primary,
                        }}
                      />
                    )}
                  </>
                )}
              </Pressable>
            </View>
          )
        })}
      </View>
    </View>
  )
}
