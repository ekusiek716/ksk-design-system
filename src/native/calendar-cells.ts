// react-native に依存しない Calendar の純粋ロジック。
// vitest から react-native をロードせずに直接テストできるよう分離している（issue #298④）。

export type CalendarLocale = "ja" | "en"

/** 曜日の意味づけ。日本のカレンダー慣習で日曜=赤 / 土曜=青に塗り分けるための識別子。 */
export type CalendarWeekdayTone = "sunday" | "saturday" | "weekday"

export interface CalendarDayInfo {
  /** そのセルの日付（ローカルタイムの 0 時） */
  date: Date
  /** 0=日 … 6=土 */
  weekday: number
  /** 選択中か */
  selected: boolean
  /** 今日か */
  today: boolean
  /** 選択不可か（minDate / maxDate / disablePast のいずれかに該当） */
  disabled: boolean
  /** 曜日トーン（日/土/平日） */
  tone: CalendarWeekdayTone
}

export const WEEK_LABELS_JA = ["日", "月", "火", "水", "木", "金", "土"] as const
export const WEEK_LABELS_EN = ["S", "M", "T", "W", "T", "F", "S"] as const
export const WEEKDAY_NAMES_JA = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
] as const
export const MONTH_LABELS_JA = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
] as const

/** その日の 0 時（ローカル）。日付同士の大小比較を時刻の影響なしで行うために使う。 */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

export function addMonths(d: Date, offset: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + offset, 1)
}

export function daysInMonth(d: Date): number {
  return endOfMonth(d).getDate()
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * 月グリッドのセル配列。先頭の空白と、末尾を7の倍数に揃える空白は null。
 * 週の開始は日曜固定（日本の一般的なカレンダー）。
 */
export function buildCalendarCells(cursor: Date): (Date | null)[] {
  const first = startOfMonth(cursor)
  const leading = first.getDay()
  const total = daysInMonth(cursor)
  const cells: (Date | null)[] = []
  for (let i = 0; i < leading; i += 1) cells.push(null)
  for (let d = 1; d <= total; d += 1) {
    cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function resolveWeekdayTone(weekday: number): CalendarWeekdayTone {
  if (weekday === 0) return "sunday"
  if (weekday === 6) return "saturday"
  return "weekday"
}

export interface CalendarDisabledOptions {
  minDate?: Date
  maxDate?: Date
  /** 今日より前の日付を選択不可にする */
  disablePast?: boolean
  /** 「今日」の基準日。省略時は new Date()（テスト時は固定日を渡す） */
  today?: Date
}

/** min/max/過去日制限を合成した「その日が選択不可か」の判定。 */
export function isDayDisabled(date: Date, options: CalendarDisabledOptions = {}): boolean {
  const { minDate, maxDate, disablePast, today = new Date() } = options
  const day = startOfDay(date)
  if (minDate && day < startOfDay(minDate)) return true
  if (maxDate && day > startOfDay(maxDate)) return true
  if (disablePast && day < startOfDay(today)) return true
  return false
}

/**
 * 月移動ボタンを押せるか。
 * 移動先の月が min/max（および disablePast）の範囲外に完全に外れる場合は押せない。
 */
export function canGoToMonth(
  cursor: Date,
  offset: number,
  options: CalendarDisabledOptions = {},
): boolean {
  const { minDate, maxDate, disablePast, today = new Date() } = options
  const target = addMonths(cursor, offset)
  // 下限は minDate と（disablePast のときの）今日のうち遅い方。
  const lowerBounds: Date[] = []
  if (minDate) lowerBounds.push(startOfDay(minDate))
  if (disablePast) lowerBounds.push(startOfDay(today))
  const lowerBound = lowerBounds.length
    ? new Date(Math.max(...lowerBounds.map((d) => d.getTime())))
    : undefined

  if (lowerBound && startOfDay(endOfMonth(target)) < lowerBound) return false
  if (maxDate && startOfMonth(target) > startOfDay(maxDate)) return false
  return true
}

/** 日セルの既定の読み上げラベル。「2026年8月6日 木曜日」/ "2026-08-06"。 */
export function defaultDayAccessibilityLabel(
  info: CalendarDayInfo,
  locale: CalendarLocale = "ja",
): string {
  const { date, weekday, today, selected } = info
  if (locale !== "ja") {
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return [iso, today ? "today" : null, selected ? "selected" : null]
      .filter(Boolean)
      .join(", ")
  }
  const base = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${WEEKDAY_NAMES_JA[weekday]}`
  const suffix = [today ? "今日" : null, selected ? "選択中" : null].filter(Boolean).join(" ")
  return suffix ? `${base} ${suffix}` : base
}

export function monthLabel(cursor: Date, locale: CalendarLocale = "ja"): string {
  return locale === "ja"
    ? `${cursor.getFullYear()}年 ${MONTH_LABELS_JA[cursor.getMonth()]}`
    : `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`
}
