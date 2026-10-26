/**
 * 日付の語順・曜日名・月名を KskLabels（文言キー）から組み立てる共通ヘルパー（issue #723）。
 * MonthCalendar / MonthCalendarHeader / AgendaList / DatePicker が使う。公開 API ではない（src/index.ts からは出さない）。
 *
 * 曜日名・月名は Intl（`toLocaleDateString`）に任せず、文言キー（カンマ区切りの一覧）にしてある。理由:
 * - Provider の labels で差し替えられる（"Su Mo Tu…" の 2 文字表記・フランス語など、ja / en 以外の言語も labels だけで足りる）
 * - 実行環境の ICU（Node / Safari / Hermes）で表記が揺れない。SSR とクライアントで食い違わない
 * - ja / en の既定は Intl の "en" / "ja" の出力と同じ値（テストで全曜日・全月を突き合わせて固定している）
 *
 * 一覧の書き方: 各項目の前後の空白は取り除く（"Sun, Mon, …" でよい）。個数が合わない・空のときは、
 * 表示が壊れないよう「その時点で解決している locale（部品の locale prop → Provider の locale → ja）の既定」の一覧で補い、
 * 開発ビルドだけ一度 warn する。
 */
import {
  KSK_DEFAULT_LABELS,
  formatKskLabel,
  type KskLocale,
  type ResolvedKskLabels,
} from "../components/ui/ksk-labels"
import { warnOnceInDev } from "./dev-warn"

type ListKey = "calendarWeekdaysShort" | "calendarWeekdaysLong" | "calendarMonthsLong" | "calendarMonthsShort"

/**
 * カンマ区切りの一覧を `count` 個の配列にする（各項目は trim）。
 * 個数が合わない（labels の書き間違い）ときは `locale` の既定で補い、開発ビルドだけ一度 warn する。
 */
function splitList(key: ListKey, value: string, count: number, locale: KskLocale): string[] {
  const list = value.split(",").map((item) => item.trim())
  if (list.length === count) return list
  warnOnceInDev(
    `calendar-labels:${key}:${value}`,
    `KskLabels の ${key} は半角カンマ区切りで ${count} 個必要です（現在 ${list.length} 個: "${value}"）。${locale} の既定で補います。`
  )
  return KSK_DEFAULT_LABELS[locale][key].split(",")
}

/** 短い曜日名（日曜始まり・7 個）。「日」/ "Sun" */
function shortWeekdays(labels: Pick<ResolvedKskLabels, "calendarWeekdaysShort">, locale: KskLocale): string[] {
  return splitList("calendarWeekdaysShort", labels.calendarWeekdaysShort, 7, locale)
}

/** 長い曜日名（日曜始まり・7 個）。「日曜日」/ "Sunday" */
function longWeekdays(labels: Pick<ResolvedKskLabels, "calendarWeekdaysLong">, locale: KskLocale): string[] {
  return splitList("calendarWeekdaysLong", labels.calendarWeekdaysLong, 7, locale)
}

type CalendarDateLabels = Pick<
  ResolvedKskLabels,
  "calendarWeekdaysShort" | "calendarMonthsLong" | "calendarMonthsShort" | "calendarDayLabel" | "calendarMonthTitle"
>

/** `calendarDayLabel` / `calendarMonthTitle` の差し込み口の値。 */
function calendarDateValues(date: Date, labels: CalendarDateLabels, locale: KskLocale): Record<string, string | number> {
  const month = date.getMonth()
  return {
    year: date.getFullYear(),
    month: month + 1,
    monthName: splitList("calendarMonthsLong", labels.calendarMonthsLong, 12, locale)[month],
    monthShort: splitList("calendarMonthsShort", labels.calendarMonthsShort, 12, locale)[month],
    day: date.getDate(),
    weekday: shortWeekdays(labels, locale)[date.getDay()],
  }
}

/** 「10月3日（土）」/ "Sat, Oct 3"（`calendarDayLabel`） */
function formatCalendarDay(date: Date, labels: CalendarDateLabels, locale: KskLocale): string {
  return formatKskLabel(labels.calendarDayLabel, calendarDateValues(date, labels, locale))
}

/** 「2026年10月」/ "October 2026"（`calendarMonthTitle`） */
function formatCalendarMonth(date: Date, labels: CalendarDateLabels, locale: KskLocale): string {
  return formatKskLabel(labels.calendarMonthTitle, calendarDateValues(date, labels, locale))
}

export { shortWeekdays, longWeekdays, formatCalendarDay, formatCalendarMonth }
