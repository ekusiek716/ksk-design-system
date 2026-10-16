/**
 * MonthCalendar / AgendaList が共有する日付ヘルパーと予定の色（issue #704）。
 * 公開 API ではない（src/index.ts からは出さない）。
 */

/** 予定の色の意味。Badge / IconBadge と同じ語彙 + neutral */
export type CalendarEventTone = "neutral" | "accent" | "info" | "success" | "warning" | "caution"

export const pad = (n: number) => String(n).padStart(2, "0")
/** ローカル日付の "YYYY-MM-DD" */
export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}
/** today 指定（"YYYY-MM-DD" / Date / 省略 = 現在日）を "YYYY-MM-DD" にする */
export const resolveTodayKey = (today: Date | string | undefined) =>
  today === undefined ? toKey(new Date()) : typeof today === "string" ? today : toKey(today)

export const WEEKDAYS = {
  ja: ["日", "月", "火", "水", "木", "金", "土"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
}

/** 「10月3日（土）」/ "Sat, Oct 3" */
export function formatDayLabel(key: string, locale: "ja" | "en"): string {
  const d = parseKey(key)
  return locale === "ja"
    ? `${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS.ja[d.getDay()]}）`
    : d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })
}

/** 予定チップ・行の面と文字 */
export const CHIP_TONE: Record<CalendarEventTone, string> = {
  neutral: "bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)]",
  accent: "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]",
  info: "bg-[var(--Surface-Info)] text-[var(--Text-Info)]",
  success: "bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
  warning: "bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
  caution: "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
}

/** 予定の色ドット */
export const DOT_TONE: Record<CalendarEventTone, string> = {
  neutral: "bg-[var(--Object-Medium-Emphasis)]",
  accent: "bg-[var(--Object-Accent-Primary)]",
  info: "bg-[var(--Object-Info)]",
  success: "bg-[var(--Object-Success)]",
  warning: "bg-[var(--Object-Warning)]",
  caution: "bg-[var(--Object-Caution)]",
}

/**
 * 予定の分類の識別色（issue #716）。空白だけ・空文字は未指定と同じ（KanbanColumn の accentColor と同じ扱い）
 */
export const resolveEventAccent = (accentColor: string | undefined) => {
  const trimmed = accentColor?.trim()
  return trimmed ? trimmed : undefined
}

/** 識別色の点。色は inline の変数 --ksk-calendar-accent で渡す（クラスは固定文字列のまま） */
export const ACCENT_DOT = "shrink-0 rounded-full bg-[var(--ksk-calendar-accent)]"
