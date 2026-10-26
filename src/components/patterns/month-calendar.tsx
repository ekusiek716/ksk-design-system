import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowDown2, ArrowLeft2, ArrowRight2 } from "iconsax-reactjs"
import { formatKskLabel, useKskLabels, useKskLabelsFor, useKskLocaleFor } from "../ui/ksk-labels"
import { formatCalendarDay, formatCalendarMonth, shortWeekdays } from "@/lib/calendar-labels"
import { Button, type ButtonProps } from "../ui/button"
import {
  ACCENT_DOT,
  CHIP_TONE,
  DOT_TONE,
  pad,
  parseKey,
  resolveEventAccent,
  resolveTodayKey,
  toKey,
  type CalendarEventTone,
} from "./_internal/calendar-shared"

// ─── Types ───────────────────────────────────────────────────────────────────

/** 予定の色の意味。Badge / IconBadge と同じ語彙 + neutral */
type MonthCalendarEventTone = CalendarEventTone

/** 表示の範囲（issue #704）。month=月全体（既定）/ week=フォーカス中の日を含む 1 週だけ */
type MonthCalendarView = "month" | "week"

interface MonthCalendarEvent {
  /** 安定キー */
  id: string
  /** 予定日（"YYYY-MM-DD"・ローカル日付） */
  date: string
  /** 予定名（セル内のチップ・読み上げに使う） */
  label: string
  /** 色の意味。既定 neutral */
  tone?: MonthCalendarEventTone
  /**
   * 分類の識別色（CSS の色。`var(--Categorical-N)` 想定。issue #716）。カテゴリ別の色を予定に出すとき。
   * - md 以上: 予定のチップの先頭に 6px の点（チップの面と文字は tone のまま）
   * - md 未満: 日付の下の点をこの色で塗る（tone より優先）
   * - AgendaList: 予定の行の先頭に点
   * 色だけで意味を伝えない（予定名が正）。空文字は未指定と同じ。renderEvent の中で点を自作しない
   */
  accentColor?: string
}

interface MonthCalendarProps extends Omit<React.ComponentProps<"div">, "onSelect"> {
  /** 表示する月（その月の任意の日）。`Date` か "YYYY-MM" */
  month: Date | string
  events?: MonthCalendarEvent[]
  /** 選択中の日（"YYYY-MM-DD"） */
  selectedDate?: string
  /** 日を選んだとき（クリック / Enter / Space）。その日の予定一覧を開く等 */
  onSelectDay?: (date: string) => void
  /** 予定チップを押したとき（ポインタ操作。キーボードでは日を選んで詳細から辿る） */
  onSelectEvent?: (event: MonthCalendarEvent) => void
  /**
   * 「+n件」を押したとき。既定は onSelectDay と同じ（その日の詳細へ）。
   */
  onShowMore?: (date: string, events: MonthCalendarEvent[]) => void
  /**
   * PageUp / PageDown と、月の端から矢印キーで出たときに呼ぶ（次 / 前の月の 1 日を渡す）。
   * 渡さないときは月の端で止まる。
   */
  onMonthChange?: (month: Date) => void
  /** セルに並べる予定の上限（md 以上）。超えた分は「+n件」。既定 2 */
  maxEventsPerDay?: number
  /** 週の始まり。0=日曜（既定）/ 1=月曜 */
  weekStartsOn?: 0 | 1
  /** 日曜を Text-Caution、土曜を Text-Accent-Primary にする（Calendar と同じ語彙）。既定 true */
  weekendTone?: boolean
  /** 「今日」の基準日（"YYYY-MM-DD" / Date）。省略時は現在日。テスト・擬似日付用 */
  today?: Date | string
  /**
   * 表示言語（曜日・読み上げ・「+n件」の既定）。既定は KskLabelsProvider の locale（無ければ "ja"）。
   * 文言は KskLabelsProvider の `calendarWeekdaysShort` / `calendarMonthTitle` / `calendarDayLabel` / `calendarDayToday` /
   * `calendarDayEvents` / `calendarEventsSeparator` / `calendarMore` で差し替えられる。
   * Provider の locale と**異なる** locale を指定したときは、Provider の labels は使わず指定した言語の既定文言になる
   * （日本語の差し替え文言が英語のカレンダーに混ざらないように）
   */
  locale?: "ja" | "en"
  /**
   * 「+n件」の文言を返す関数。既定は KskLabelsProvider の `calendarMore`（ja: `+${n}件` / en: `+${n} more`）。
   * 英語の単複などを出し分けたいときはこの関数で渡す
   */
  moreLabel?: (count: number) => string
  /** グリッドの読み上げ名。既定は「2026年10月」等 */
  "aria-label"?: string
  renderEvent?: (event: MonthCalendarEvent) => React.ReactNode
  /**
   * 表示の範囲（issue #704）。
   * - "month"（既定）: 月全体
   * - "week": フォーカス中の日（選択日 → 今日 → 1 日）を含む 1 週だけ。スマホの「週の帯」用。
   *   矢印キーで週をまたぐと表示する週が移る（grid のキー操作は month と共通）。
   *   月をまたぐ週は月外の日も描き（数字は Text-Medium-Emphasis）、月の端でも止まらず隣の週へ移る。
   *   onMonthChange があれば月をまたいだときに呼ぶ（無ければ内部で進める）。
   *   日ごとの予定の中身は AgendaList と組み合わせる
   */
  view?: MonthCalendarView
}

// ─── Date helpers（ローカル日付・"YYYY-MM-DD"。共通部は _internal/calendar-shared） ──────────

function toMonthStart(month: Date | string): Date {
  if (typeof month === "string") {
    const [y, m] = month.split("-").map(Number)
    return new Date(y, (m ?? 1) - 1, 1)
  }
  return new Date(month.getFullYear(), month.getMonth(), 1)
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()

/** 月の週ごとのセル（月外は null）。テスト・独自レイアウト用に公開 */
function buildMonthWeeks(month: Date | string, weekStartsOn: 0 | 1 = 0): (string | null)[][] {
  const start = toMonthStart(month)
  const lead = (start.getDay() - weekStartsOn + 7) % 7
  const total = daysInMonth(start)
  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: total }, (_, i) => toKey(addDays(start, i))),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

// ─── MonthCalendar ───────────────────────────────────────────────────────────

/**
 * MonthCalendar — 予定付きの月カレンダー（issue #679）
 *
 * 日付を「選ぶ」Calendar / DatePicker と違い、日ごとの予定を一覧する予定表。
 *
 * ### 設計判断
 * - **キーボードは WAI-ARIA grid パターン**: role="grid" / row / columnheader / gridcell。
 *   タブストップはグリッドに 1 つ（roving tabindex。選択日 → 今日 → 1 日の順で決める）。
 *   ← → ↑ ↓ で 1 日 / 1 週、Home / End で週の端、PageUp / PageDown で前後の月
 *   （onMonthChange があるとき）、Enter / Space で onSelectDay。
 * - **予定チップはポインタ用の近道**（tabIndex=-1）。キーボード・スクリーンリーダーでは日を選び、
 *   その日の詳細（consumer のシート等）から予定へ辿る。セルの読み上げ名に予定名と件数を含める。
 * - **あふれは「+n件」**: md 以上で maxEventsPerDay（既定 2）を超えた分を「+n件」にまとめ、
 *   押すと onShowMore（既定 onSelectDay）でその日の詳細へ。
 * - **PC / スマホは既存のブレークポイント語彙（md = 768px）**: md 未満はセルが狭いのでチップを
 *   出さず予定の色ドット（最大 3）だけを出す。同じグリッドを使い、操作は日の選択に一本化する。
 * - 今日（Brand-Primary の丸）・選択日（Surface-Accent-Primary-Light の面 + Border-Accent-Primary）・
 *   土日（weekendTone）・月外の空きセルの見た目は DS が持つ。
 */
function MonthCalendar({
  month,
  events = [],
  selectedDate,
  onSelectDay,
  onSelectEvent,
  onShowMore,
  onMonthChange,
  maxEventsPerDay = 2,
  weekStartsOn = 0,
  weekendTone = true,
  today: todayProp,
  locale: localeProp,
  moreLabel,
  renderEvent,
  view = "month",
  className,
  "aria-label": ariaLabel,
  ...props
}: MonthCalendarProps) {
  // 文言は prop > locale prop が Provider と違うときはその言語の既定 > Provider の labels > 日本語（issue #723）
  const labels = useKskLabelsFor(localeProp)
  const locale = useKskLocaleFor(localeProp)
  const monthStart = toMonthStart(month)
  const monthKey = `${monthStart.getFullYear()}-${pad(monthStart.getMonth() + 1)}`
  const weeks = buildMonthWeeks(monthStart, weekStartsOn)
  const todayKey = resolveTodayKey(todayProp)
  const inMonth = (key: string | null | undefined) => Boolean(key && key.startsWith(`${monthKey}-`))

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, MonthCalendarEvent[]>()
    for (const e of events) {
      const list = map.get(e.date)
      if (list) list.push(e)
      else map.set(e.date, [e])
    }
    return map
  }, [events])

  const isWeek = view === "week"
  const defaultFocus = selectedDate && (isWeek || inMonth(selectedDate)) ? selectedDate : inMonth(todayKey) ? todayKey : `${monthKey}-01`
  const [focusKey, setFocusKey] = React.useState(defaultFocus)
  // 選択日が外から変わったら（「今日へ」ボタン等）タブストップと week 表示の週もそこへ移す。
  // effect ではなく前回値との比較で render 中に揃える（React の推奨パターン・余分な描画なし）
  const [prevSelectedDate, setPrevSelectedDate] = React.useState(selectedDate)
  if (selectedDate !== prevSelectedDate) {
    setPrevSelectedDate(selectedDate)
    // week は月外の日も表示できるので、月をまたいだ選択日にも追従する
    if (selectedDate && (isWeek || inMonth(selectedDate))) setFocusKey(selectedDate)
  }
  // week: 表示月が外から変わったら（前後の月ボタン等）、その月の中へ移す。
  // 自分で月をまたいで onMonthChange を呼んだときはフォーカス先が新しい月の中なので動かさない
  const [prevMonthKey, setPrevMonthKey] = React.useState(monthKey)
  if (monthKey !== prevMonthKey) {
    setPrevMonthKey(monthKey)
    if (isWeek && !inMonth(focusKey)) setFocusKey(defaultFocus)
  }
  // month: 月が変わったら、その月の中のセルへ移す（月外の日を覚えたままだとタブストップが消える）。
  // week: 月外の日（月をまたぐ週）にもフォーカスできる（issue #704 レビュー）
  const activeKey = isWeek ? focusKey : inMonth(focusKey) ? focusKey : defaultFocus
  // 週を内部で移動する構成では、見出しと月外表示もフォーカス先の月へ揃える。
  // onMonthChange ありでは従来どおり consumer の month を表示月の正本にする。
  const displayedMonthStart = isWeek && !onMonthChange ? toMonthStart(parseKey(activeKey)) : monthStart
  const displayedMonthKey = `${displayedMonthStart.getFullYear()}-${pad(displayedMonthStart.getMonth() + 1)}`
  const gridRef = React.useRef<HTMLDivElement>(null)
  const shouldFocusRef = React.useRef(false)

  React.useEffect(() => {
    if (!shouldFocusRef.current) return
    shouldFocusRef.current = false
    gridRef.current?.querySelector<HTMLElement>(`[data-date="${activeKey}"]`)?.focus()
  }, [activeKey])

  const moveTo = (next: Date) => {
    const key = toKey(next)
    shouldFocusRef.current = true
    if (isWeek) {
      // week は月境界で止めない。onMonthChange があれば表示月も合わせ、無ければ内部で進める
      setFocusKey(key)
      if (!inMonth(key)) onMonthChange?.(new Date(next.getFullYear(), next.getMonth(), 1))
      return
    }
    if (inMonth(key)) {
      setFocusKey(key)
      return
    }
    if (onMonthChange) {
      setFocusKey(key)
      onMonthChange(new Date(next.getFullYear(), next.getMonth(), 1))
    }
  }

  const weekdays = shortWeekdays(labels, locale)
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => weekdays[(i + weekStartsOn) % 7])
  const more = moreLabel ?? ((n: number) => formatKskLabel(labels.calendarMore, { count: n }))
  const gridLabel = ariaLabel ?? formatCalendarMonth(displayedMonthStart, labels, locale)

  const dayLabel = (key: string, dayEvents: MonthCalendarEvent[]) => {
    const base = formatCalendarDay(parseKey(key), labels, locale)
    const todayPart = key === todayKey ? labels.calendarDayToday : ""
    const eventsPart = dayEvents.length
      ? formatKskLabel(labels.calendarDayEvents, {
          count: dayEvents.length,
          events: dayEvents.map((e) => e.label).join(labels.calendarEventsSeparator),
        })
      : ""
    return `${base}${todayPart}${eventsPart}`
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>, key: string) => {
    const d = parseKey(key)
    const col = (d.getDay() - weekStartsOn + 7) % 7
    switch (event.key) {
      case "ArrowLeft":
        moveTo(addDays(d, -1))
        break
      case "ArrowRight":
        moveTo(addDays(d, 1))
        break
      case "ArrowUp":
        moveTo(addDays(d, -7))
        break
      case "ArrowDown":
        moveTo(addDays(d, 7))
        break
      case "Home": {
        const start = addDays(d, -col)
        moveTo(isWeek || inMonth(toKey(start)) ? start : monthStart)
        break
      }
      case "End": {
        const end = addDays(d, 6 - col)
        moveTo(isWeek || inMonth(toKey(end)) ? end : new Date(monthStart.getFullYear(), monthStart.getMonth(), daysInMonth(monthStart)))
        break
      }
      case "PageUp":
      case "PageDown": {
        if (!onMonthChange) return
        const delta = event.key === "PageUp" ? -1 : 1
        const target = new Date(d.getFullYear(), d.getMonth() + delta, 1)
        const day = Math.min(d.getDate(), daysInMonth(target))
        moveTo(new Date(target.getFullYear(), target.getMonth(), day))
        break
      }
      case "Enter":
      case " ":
        onSelectDay?.(key)
        break
      default:
        return
    }
    event.preventDefault()
  }

  // view="week" はフォーカス中の日（タブストップ）を含む 7 日を出す。月をまたぐ週は月外の日も描く
  const visibleWeeks: { week: (string | null)[]; index: number }[] = isWeek
    ? (() => {
        const active = parseKey(activeKey)
        const start = addDays(active, -((active.getDay() - weekStartsOn + 7) % 7))
        return [{ week: Array.from({ length: 7 }, (_, i) => toKey(addDays(start, i))), index: 0 }]
      })()
    : weeks.map((week, index) => ({ week, index }))

  return (
    <div
      ref={gridRef}
      role="grid"
      data-view={view}
      aria-label={gridLabel}
      data-slot="month-calendar"
      className={cn("w-full", className)}
      {...props}
    >
      <div role="row" className="grid grid-cols-7 border-b border-[var(--Border-Low-Emphasis)]">
        {weekdayLabels.map((label, i) => {
          const weekday = (i + weekStartsOn) % 7
          return (
            <div
              key={label}
              role="columnheader"
              className={cn(
                "py-2 text-center typo-label-sm",
                weekendTone && weekday === 0
                  ? "text-[var(--Text-Caution)]"
                  : weekendTone && weekday === 6
                    ? "text-[var(--Text-Accent-Primary)]"
                    : "text-[var(--Text-Medium-Emphasis)]"
              )}
            >
              {label}
            </div>
          )
        })}
      </div>
      {visibleWeeks.map(({ week, index: wi }) => (
        <div role="row" key={wi} className="grid grid-cols-7 border-b border-[var(--Border-Low-Emphasis)] last:border-b-0">
          {week.map((key, di) => {
            if (!key) {
              return <div key={`empty-${di}`} role="gridcell" className="min-h-14 md:min-h-24 bg-[var(--Surface-Secondary)]" />
            }
            const d = parseKey(key)
            const weekday = d.getDay()
            const dayEvents = eventsByDate.get(key) ?? []
            const visible = dayEvents.slice(0, maxEventsPerDay)
            const hidden = dayEvents.length - visible.length
            const isToday = key === todayKey
            const isSelected = key === selectedDate
            // week の月をまたぐ週で、表示月の外の日（数字を控えめにする）
            const isOutside = !key.startsWith(`${displayedMonthKey}-`)
            return (
              // ksk-ds-lint-ignore P024 -- WAI-ARIA grid の gridcell は roving tabindex でセル自体がフォーカスを受け、キー操作は handleKeyDown が担う
              <div
                key={key}
                role="gridcell"
                data-date={key}
                data-today={isToday || undefined}
                data-selected={isSelected || undefined}
                data-outside-month={isOutside || undefined}
                tabIndex={key === activeKey ? 0 : -1}
                aria-selected={isSelected}
                aria-label={dayLabel(key, dayEvents)}
                onClick={() => {
                  setFocusKey(key)
                  onSelectDay?.(key)
                }}
                onKeyDown={(e) => handleKeyDown(e, key)}
                onFocus={() => setFocusKey(key)}
                className={cn(
                  "relative flex min-h-14 min-w-0 cursor-pointer flex-col gap-1 border-r border-[var(--Border-Low-Emphasis)] p-1 last:border-r-0 md:min-h-24",
                  "transition-colors duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)]",
                  "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--Focus-High-Emphasis)]",
                  isSelected
                    ? "bg-[var(--Surface-Accent-Primary-Light)] ring-1 ring-inset ring-[var(--Border-Accent-Primary)]"
                    : "bg-[var(--Surface-Primary)] hover:bg-[var(--Surface-Secondary)]"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-7 items-center justify-center self-center rounded-full typo-label-sm md:self-start",
                    isToday
                      ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
                      : isOutside
                        ? "text-[var(--Text-Medium-Emphasis)]"
                        : weekendTone && weekday === 0
                        ? "text-[var(--Text-Caution)]"
                        : weekendTone && weekday === 6
                          ? "text-[var(--Text-Accent-Primary)]"
                          : "text-[var(--Text-High-Emphasis)]"
                  )}
                >
                  {d.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <>
                    {/* md 未満: 色ドットだけ（最大 3）。読み上げはセルの aria-label が担う */}
                    <span aria-hidden="true" className="flex justify-center gap-0.5 md:hidden">
                      {dayEvents.slice(0, 3).map((e) => {
                        const accent = resolveEventAccent(e.accentColor)
                        return accent !== undefined ? (
                          <span
                            key={e.id}
                            data-accent=""
                            className={cn("size-1.5", ACCENT_DOT)}
                            style={{ "--ksk-calendar-accent": accent } as React.CSSProperties}
                          />
                        ) : (
                          <span key={e.id} className={cn("size-1.5 rounded-full", DOT_TONE[e.tone ?? "neutral"])} />
                        )
                      })}
                    </span>
                    {/* md 以上: 予定チップ + 「+n件」（ポインタ用の近道。キーボードは日の選択から辿る） */}
                    <span aria-hidden="true" className="hidden min-w-0 flex-col gap-0.5 md:flex">
                      {visible.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          tabIndex={-1}
                          data-slot="month-calendar-event"
                          title={e.label}
                          onClick={(ev) => {
                            ev.stopPropagation()
                            if (onSelectEvent) onSelectEvent(e)
                            else onSelectDay?.(key)
                          }}
                          className={cn(
                            "w-full min-w-0 cursor-pointer truncate rounded-sm px-1.5 py-0.5 text-left typo-label-xs",
                            CHIP_TONE[e.tone ?? "neutral"]
                          )}
                        >
                          {resolveEventAccent(e.accentColor) !== undefined ? (
                            // #716: 識別色の点 + 予定名（名前側で truncate する）
                            <span data-accent="" className="flex min-w-0 items-center gap-1">
                              <span
                                aria-hidden="true"
                                data-slot="month-calendar-event-dot"
                                className={cn("size-1.5", ACCENT_DOT)}
                                style={{ "--ksk-calendar-accent": resolveEventAccent(e.accentColor) } as React.CSSProperties}
                              />
                              <span className="min-w-0 flex-1 truncate">{renderEvent ? renderEvent(e) : e.label}</span>
                            </span>
                          ) : renderEvent ? (
                            renderEvent(e)
                          ) : (
                            e.label
                          )}
                        </button>
                      ))}
                      {hidden > 0 && (
                        <button
                          type="button"
                          tabIndex={-1}
                          data-slot="month-calendar-more"
                          onClick={(ev) => {
                            ev.stopPropagation()
                            if (onShowMore) onShowMore(key, dayEvents)
                            else onSelectDay?.(key)
                          }}
                          className="w-full cursor-pointer rounded-sm px-1.5 text-left typo-label-xs text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Tertiary)]"
                        >
                          {more(hidden)}
                        </button>
                      )}
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── MonthCalendarHeader（issue #721） ─────────────────────────────────────────

interface MonthCalendarHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** 表示中の月（MonthCalendar の month と同じ値）。title の既定「2026年10月」/「October 2026」に使う */
  month: Date | string
  /** 見出しの文言。既定は month から作る */
  title?: React.ReactNode
  /** 「今日へ」を押したとき。渡さなければボタンを出さない */
  onToday?: () => void
  /** 前の月へ。渡さなければボタンを出さない */
  onPrev?: () => void
  /** 次の月へ。渡さなければボタンを出さない */
  onNext?: () => void
  /**
   * 見出しの大きさ。
   * - "md"（既定）: typo-heading-md（スマホの週の帯の上）
   * - "lg": typo-heading-lg（PC の月グリッドの上）
   */
  size?: "md" | "lg"
  /** 見出しの要素。既定 "h2"。置き場所の見出し階層に合わせる */
  headingLevel?: "h2" | "h3"
  /**
   * 表示言語（title の既定の語順）。既定は KskLabelsProvider の locale（無ければ "ja"）。
   * title の既定は KskLabelsProvider の `calendarMonthTitle` で差し替えられる（Provider の locale と異なる locale を指定したときは
   * Provider の labels を使わず、指定した言語の既定）。ボタンの文言は `locale` では変わらず、Provider の labels に従う
   */
  locale?: "ja" | "en"
  /** 「今日へ」の文言。既定は KskLabelsProvider の calendarToday（無ければ「今日へ」） */
  todayLabel?: string
  /** 前の月ボタンの読み上げ名。既定は KskLabelsProvider の calendarPrevMonth（無ければ「前の月」） */
  prevLabel?: string
  /** 次の月ボタンの読み上げ名。既定は KskLabelsProvider の calendarNextMonth（無ければ「次の月」） */
  nextLabel?: string
  /**
   * 見出しの aria-live（月が変わったら読み上げる）を付けるか（issue #736）。既定 true。
   * 一覧のスクロールに合わせて月が変わる画面では、スクロールのたびに読み上げが走るので `false` にする
   */
  live?: boolean
  /**
   * 右側の並びの右端（前後の月ボタンの後ろ）に置く部品（issue #743）。
   * 「月／週」の切り替え（PillToggle size="sm"）や予定の追加ボタンなど。見出しの外で並びを自作しない。
   * 前後の月ボタンが無くても、trailing だけで右側の並びを出す
   */
  trailing?: React.ReactNode
}

/**
 * MonthCalendarHeader — 予定カレンダーの見出し（issue #721）
 *
 * 左に月の見出し + 「今日へ」、右に前後の月のアイコンボタン（aria-label 付き・44px の当たり判定）。
 * 見出しは aria-live="polite" で、月が変わると読み上げる。
 * MonthCalendar の root は role="grid" なので、見出しは grid の外（MonthCalendar の上）に置く。
 * 見出し・「今日へ」・前後ボタンを h2 + Button で自作しない。
 */
function MonthCalendarHeader({
  month,
  title,
  onToday,
  onPrev,
  onNext,
  size = "md",
  headingLevel: Heading = "h2",
  locale: localeProp,
  todayLabel,
  prevLabel,
  nextLabel,
  live = true,
  trailing,
  className,
  ...props
}: MonthCalendarHeaderProps) {
  const labels = useKskLabels()
  // 月の見出しの語順だけ locale prop に従う（ボタンの文言は従来どおり Provider の labels。locale prop は title の既定にだけ効く）
  const titleLabels = useKskLabelsFor(localeProp)
  const titleLocale = useKskLocaleFor(localeProp)
  const start = toMonthStart(month)
  const hasTrailing = trailing != null && trailing !== false
  const defaultTitle = formatCalendarMonth(start, titleLabels, titleLocale)
  return (
    <div
      data-slot="month-calendar-header"
      data-size={size}
      className={cn("flex min-w-0 items-center justify-between gap-3", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Heading
          // 前後の月・今日へで見出しが変わったことをスクリーンリーダーへ知らせる（ボタンを押した位置から動かずに分かる）
          aria-live={live ? "polite" : undefined}
          aria-atomic={live ? "true" : undefined}
          className={cn(
            "min-w-0 truncate tabular-nums text-[var(--Text-High-Emphasis)]",
            size === "lg" ? "typo-heading-lg" : "typo-heading-md"
          )}
        >
          {title ?? defaultTitle}
        </Heading>
        {onToday && (
          <Button type="button" variant="ghost" size="sm" data-slot="month-calendar-today" onClick={onToday}>
            {todayLabel ?? labels.calendarToday}
          </Button>
        )}
      </div>
      {(onPrev || onNext || hasTrailing) && (
        // icon-sm（見た目 32px・当たり判定 44px）を並べるので、見た目の端同士は 12px（gap-3）空ける
        <div data-slot="month-calendar-header-actions" className="flex shrink-0 items-center gap-3">
          {onPrev && (
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              data-slot="month-calendar-prev"
              aria-label={prevLabel ?? labels.calendarPrevMonth}
              onClick={onPrev}
            >
              <ArrowLeft2 size={16} aria-hidden="true" />
            </Button>
          )}
          {onNext && (
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              data-slot="month-calendar-next"
              aria-label={nextLabel ?? labels.calendarNextMonth}
              onClick={onNext}
            >
              <ArrowRight2 size={16} aria-hidden="true" />
            </Button>
          )}
          {hasTrailing && trailing}
        </div>
      )}
    </div>
  )
}

// ─── MonthCalendarExpandToggle（issue #721） ───────────────────────────────────

interface MonthCalendarExpandToggleProps extends Omit<ButtonProps, "children" | "onClick" | "variant" | "size"> {
  /** 月全体を表示中か（MonthCalendar の view="month" のとき true） */
  expanded: boolean
  /** 押したとき（次の expanded を渡す）。consumer は view を "month" ⇄ "week" に切り替える */
  onExpandedChange: (expanded: boolean) => void
  /**
   * 読み上げ名。開閉で変えない（状態は aria-expanded が伝える）。
   * 既定は KskLabelsProvider の calendarExpand（無ければ「月全体を表示」）
   */
  label?: string
}

/**
 * MonthCalendarExpandToggle — 週の帯 ⇄ 月全体の開閉ボタン（issue #721）
 *
 * MonthCalendar の下に置く全幅のボタン。読み上げ名は固定で、開閉の状態は aria-expanded だけが伝える。矢印は開いているとき上向きに回る
 * （Motion トークン）。開閉の状態は consumer が持ち、MonthCalendar の view に渡す。
 * aria-controls に MonthCalendar の id を渡すと結び付く。Button ghost icon-sm w-full で自作しない。
 */
function MonthCalendarExpandToggle({
  expanded,
  onExpandedChange,
  label,
  className,
  ...props
}: MonthCalendarExpandToggleProps) {
  const labels = useKskLabels()
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-slot="month-calendar-expand-toggle"
      data-expanded={expanded || undefined}
      aria-expanded={expanded}
      aria-label={label ?? labels.calendarExpand}
      onClick={() => onExpandedChange(!expanded)}
      className={cn("w-full", className)}
      {...props}
    >
      <ArrowDown2
        size={24}
        aria-hidden="true"
        className={cn(
          "transition-transform duration-[var(--Motion-Duration-Base)] ease-[var(--Motion-Easing-Standard)]",
          expanded && "rotate-180"
        )}
      />
    </Button>
  )
}

export { MonthCalendar, MonthCalendarExpandToggle, MonthCalendarHeader, buildMonthWeeks }
export type {
  MonthCalendarEvent,
  MonthCalendarEventTone,
  MonthCalendarExpandToggleProps,
  MonthCalendarHeaderProps,
  MonthCalendarProps,
  MonthCalendarView,
}
