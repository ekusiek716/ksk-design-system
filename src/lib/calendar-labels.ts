/**
 * 日付の語順・曜日名・月名を KskLabels（文言キー）から組み立てる共通ヘルパー（issue #723）。
 * MonthCalendar / MonthCalendarHeader / AgendaList / DatePicker が使う。公開 API ではない（src/index.ts からは出さない）。
 *
 * 曜日名・月名は Intl（`toLocaleDateString`）に任せず、文言キー（カンマ区切りの一覧）にしてある。理由:
 * - Provider の labels で差し替えられる（"Su Mo Tu…" の 2 文字表記・フランス語など、ja / en 以外の言語も labels だけで足りる）
 * - 実行環境の ICU（Node / Safari / Hermes）で表記が揺れない。SSR とクライアントで食い違わない
 * - ja / en の既定は Intl の "en" / "ja" の出力と同じ値（テストで全曜日・全月を突き合わせて固定している）
 */
import { KSK_DEFAULT_LABELS, formatKskLabel, type ResolvedKskLabels } from "../components/ui/ksk-labels"

/** カンマ区切りの一覧を `count` 個の配列にする。個数が合わない（labels の書き間違い）ときは日本語の既定で補う。 */
function splitList(value: string, count: number, fallback: string): string[] {
  const list = value.split(",")
  return list.length === count ? list : fallback.split(",")
}

/** 短い曜日名（日曜始まり・7 個）。「日」/ "Sun" */
function shortWeekdays(labels: Pick<ResolvedKskLabels, "calendarWeekdaysShort">): string[] {
  return splitList(labels.calendarWeekdaysShort, 7, KSK_DEFAULT_LABELS.ja.calendarWeekdaysShort)
}

/** 長い曜日名（日曜始まり・7 個）。「日曜日」/ "Sunday" */
function longWeekdays(labels: Pick<ResolvedKskLabels, "calendarWeekdaysLong">): string[] {
  return splitList(labels.calendarWeekdaysLong, 7, KSK_DEFAULT_LABELS.ja.calendarWeekdaysLong)
}

type CalendarDateLabels = Pick<
  ResolvedKskLabels,
  "calendarWeekdaysShort" | "calendarMonthsLong" | "calendarMonthsShort" | "calendarDayLabel" | "calendarMonthTitle"
>

/** `calendarDayLabel` / `calendarMonthTitle` の差し込み口の値。 */
function calendarDateValues(date: Date, labels: CalendarDateLabels): Record<string, string | number> {
  const month = date.getMonth()
  return {
    year: date.getFullYear(),
    month: month + 1,
    monthName: splitList(labels.calendarMonthsLong, 12, KSK_DEFAULT_LABELS.ja.calendarMonthsLong)[month],
    monthShort: splitList(labels.calendarMonthsShort, 12, KSK_DEFAULT_LABELS.ja.calendarMonthsShort)[month],
    day: date.getDate(),
    weekday: shortWeekdays(labels)[date.getDay()],
  }
}

/** 「10月3日（土）」/ "Sat, Oct 3"（`calendarDayLabel`） */
function formatCalendarDay(date: Date, labels: CalendarDateLabels): string {
  return formatKskLabel(labels.calendarDayLabel, calendarDateValues(date, labels))
}

/** 「2026年10月」/ "October 2026"（`calendarMonthTitle`） */
function formatCalendarMonth(date: Date, labels: CalendarDateLabels): string {
  return formatKskLabel(labels.calendarMonthTitle, calendarDateValues(date, labels))
}

export { shortWeekdays, longWeekdays, formatCalendarDay, formatCalendarMonth }
