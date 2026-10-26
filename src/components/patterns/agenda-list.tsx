import * as React from "react"
import { cn } from "@/lib/utils"
import { useKskLocale } from "../ui/ksk-labels"
import type { MonthCalendarEvent } from "./month-calendar"
import { ACCENT_DOT, CHIP_TONE, WEEKDAYS, formatDayLabel, parseKey, resolveEventAccent, resolveTodayKey } from "./_internal/calendar-shared"

interface AgendaListProps extends Omit<React.ComponentProps<"div">, "onSelect"> {
  /** 予定（MonthCalendar と同じ形。date は "YYYY-MM-DD"） */
  events: MonthCalendarEvent[]
  /**
   * 並べる日（"YYYY-MM-DD"）。既定は予定がある日を昇順に。
   * 予定の無い日も行として出したいとき（「この週の 7 日」等）に渡す。予定の無い日は `emptyDayLabel`
   */
  dates?: string[]
  /** 選択中の日（行の面を Surface-Accent-Primary-Light にする） */
  selectedDate?: string
  /** 「今日」の基準日。省略時は現在日 */
  today?: Date | string
  /** 表示言語（日付の読み上げ・曜日）。既定は KskLabelsProvider の locale（無ければ "ja"） */
  locale?: "ja" | "en"
  /** 日曜を Text-Caution、土曜を Text-Accent-Primary にする（MonthCalendar と同じ）。既定 true */
  weekendTone?: boolean
  /** 予定の行を押したとき。渡すと行が button になる（渡さなければ読むだけの行） */
  onSelectEvent?: (event: MonthCalendarEvent) => void
  /** 予定の行の中身。既定は label */
  renderEvent?: (event: MonthCalendarEvent) => React.ReactNode
  /** 並べる日が 1 日も無いときに出すもの（EmptyState 等） */
  empty?: React.ReactNode
  /** `dates` で渡した予定の無い日の文言。既定 ja「予定なし」/ en「No events」 */
  emptyDayLabel?: string
  /**
   * 日の行の id（スクロール連動・「今日へ」のジャンプ先）。例: `(d) => \`agenda-${d}\``。
   * 省略時は id を付けない（行には常に `data-date` が付く）
   */
  dayId?: (date: string) => string
  /**
   * 日ごとの見出し（読み上げ用）のレベル。置き場所の見出し構造に合わせる
   * （画面の h1 → セクションの h2 の下なら 3）。@default 3
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

/**
 * AgendaList — 予定がある日を時系列に並べる一覧（issue #704）
 *
 * スマホのカレンダー画面で、MonthCalendar（`view="week"` の週の帯や月グリッド）の下に置き、
 * 日ごとの予定の中身を見せる。日付列（日・曜日）+ その日の予定の行。
 *
 * - 構造: 日ごとの `<li>`（`data-date` / 今日は `aria-current="date"`）に、読み上げ用の見出し
 *   （既定 `h3`・`headingLevel` で変更・「10月3日（土）、今日」）と予定の `<ul>`
 * - 予定の行の面は tone（MonthCalendar のチップと同じ色）。onSelectEvent を渡すと button
 * - 今日・選択日・土日の見た目は DS が持つ。過去の日の強調などプロダクト固有の表現は renderEvent で
 */
function AgendaList({
  events,
  dates,
  selectedDate,
  today,
  locale: localeProp,
  weekendTone = true,
  onSelectEvent,
  renderEvent,
  empty,
  emptyDayLabel,
  dayId,
  headingLevel = 3,
  className,
  ...props
}: AgendaListProps) {
  // 既定は KskLabelsProvider の locale（無ければ "ja"。issue #723）
  const providerLocale = useKskLocale()
  const locale = localeProp ?? providerLocale ?? "ja"
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6"
  const todayKey = resolveTodayKey(today)
  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, MonthCalendarEvent[]>()
    for (const e of events) {
      const list = map.get(e.date)
      if (list) list.push(e)
      else map.set(e.date, [e])
    }
    return map
  }, [events])
  // dates の重複は 1 行にまとめる（同じ日の行・key・id が二重にならないように）
  const days = dates ? [...new Set(dates)] : [...eventsByDate.keys()].sort()
  const noEventsLabel = emptyDayLabel ?? (locale === "ja" ? "予定なし" : "No events")

  if (days.length === 0) {
    return (
      <div data-slot="agenda-list" data-empty="" className={className} {...props}>
        {empty}
      </div>
    )
  }

  return (
    <div data-slot="agenda-list" className={cn("w-full", className)} {...props}>
      <ul role="list" className="divide-y divide-[var(--Border-Low-Emphasis)]">
        {days.map((key) => {
          const d = parseKey(key)
          const weekday = d.getDay()
          const dayEvents = eventsByDate.get(key) ?? []
          const isToday = key === todayKey
          const isSelected = key === selectedDate
          const headingLabel = `${formatDayLabel(key, locale)}${isToday ? (locale === "ja" ? "、今日" : ", today") : ""}`
          return (
            <li
              key={key}
              id={dayId?.(key)}
              data-slot="agenda-list-day"
              data-date={key}
              data-today={isToday || undefined}
              data-selected={isSelected || undefined}
              aria-current={isToday ? "date" : undefined}
              className={cn(
                "flex items-start gap-4 px-1 py-3",
                isSelected && "bg-[var(--Surface-Accent-Primary-Light)]"
              )}
            >
              {/* 日付列は見た目用。読み上げは下の見出しが担う */}
              <div aria-hidden="true" className="flex w-8 shrink-0 flex-col items-center">
                <span
                  className={cn(
                    "typo-heading-xl tabular-nums",
                    isToday ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)]"
                  )}
                >
                  {d.getDate()}
                </span>
                <span
                  className={cn(
                    "mt-1 typo-body-xs",
                    weekendTone && weekday === 0
                      ? "text-[var(--Text-Caution)]"
                      : weekendTone && weekday === 6
                        ? "text-[var(--Text-Accent-Primary)]"
                        : "text-[var(--Text-Medium-Emphasis)]"
                  )}
                >
                  {WEEKDAYS[locale][weekday]}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Heading className="sr-only">{headingLabel}</Heading>
                {dayEvents.length === 0 ? (
                  <p className="py-2.5 typo-body-sm text-[var(--Text-Low-Emphasis)]">{noEventsLabel}</p>
                ) : (
                  <ul role="list" className="flex flex-col gap-1.5">
                    {dayEvents.map((event) => {
                      const label = renderEvent ? renderEvent(event) : event.label
                      const accent = resolveEventAccent(event.accentColor)
                      // #716: 分類の識別色は行の先頭の点（行の面と文字は tone のまま）
                      const content =
                        accent !== undefined ? (
                          <>
                            <span
                              aria-hidden="true"
                              data-slot="agenda-list-event-dot"
                              className={cn("size-2.5", ACCENT_DOT)}
                              style={{ "--ksk-calendar-accent": accent } as React.CSSProperties}
                            />
                            <span className="min-w-0 flex-1">{label}</span>
                          </>
                        ) : (
                          label
                        )
                      const rowClass = cn(
                        "flex min-h-11 w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left typo-body-md",
                        CHIP_TONE[event.tone ?? "neutral"]
                      )
                      return (
                        <li key={event.id} data-slot="agenda-list-event" className="min-w-0">
                          {onSelectEvent ? (
                            <button
                              type="button"
                              onClick={() => onSelectEvent(event)}
                              className={cn(
                                rowClass,
                                "cursor-pointer transition-opacity duration-[var(--Motion-Duration-Fast)] active:opacity-70",
                                "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]"
                              )}
                            >
                              {content}
                            </button>
                          ) : (
                            <div className={rowClass}>{content}</div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { AgendaList }
export type { AgendaListProps }
