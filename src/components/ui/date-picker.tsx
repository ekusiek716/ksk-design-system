import { getActiveElement } from "@/lib/active-element"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { useKskLabels, useKskLocale, type KskLocale, type ResolvedKskLabels } from "./ksk-labels"
import { longWeekdays, shortWeekdays } from "@/lib/calendar-labels"

/**
 * 書式トークン（yyyy / MM / M / dd / d / EEE / EEEE）で日付を文字にする。
 * 曜日名（EEE=短い形・EEEE=長い形）は KskLabelsProvider の `calendarWeekdaysShort` / `calendarWeekdaysLong`
 * （Provider の locale="en" で "Sun" / "Sunday"。Provider 無しは「日」/「日曜日」。labels で差し替え可）。
 */
function formatDate(
  date: Date,
  fmt: string,
  labels: Pick<ResolvedKskLabels, "calendarWeekdaysShort" | "calendarWeekdaysLong">,
  locale: KskLocale
): string {
  const y = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = date.getDay()
  const values: Record<string, string> = {
    yyyy: String(y),
    MM: String(month).padStart(2, "0"),
    M: String(month),
    dd: String(day).padStart(2, "0"),
    d: String(day),
    EEEE: longWeekdays(labels, locale)[weekday],
    EEE: shortWeekdays(labels, locale)[weekday],
  }
  return fmt.replace(/yyyy|EEEE|EEE|MM|M|dd|d/g, (token) => values[token])
}

const calendarIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-[var(--Object-Medium-Emphasis)] shrink-0"
    aria-hidden
  >
    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 7h12" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

function triggerClass(open: boolean, hasValue: boolean, className?: string) {
  return cn(
    "flex h-[var(--Field-Height-Md)] w-full items-center justify-between rounded-[var(--Field-Radius)] border border-[var(--Border-Control,var(--Border-Medium-Emphasis))] bg-[var(--Surface-Primary)] px-[var(--Field-Padding-X-Md)] typo-body-md transition-colors focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]",
    open
      ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]"
      : "border-[var(--Border-Control,var(--Border-Medium-Emphasis))] hover:border-[var(--Border-High-Emphasis)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-[var(--Border-Caution)] aria-invalid:ring-[var(--Caution-Base)] aria-invalid:focus-visible:ring-[var(--Caution-Base)]",
    hasValue ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
    className
  )
}

interface DatePickerProps {
  id?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  /**
   * トリガーボタンのプレースホルダーテキスト。
   * 省略時は KskLabelsProvider の `datePickerPlaceholder`（Provider 無しは "日付を選択"。locale="en" で "Select date"）。
   */
  placeholder?: string
  disabled?: boolean
  className?: string
  /**
   * 表示の書式。トークン: yyyy / MM / M / dd / d / EEE（曜日・短）/ EEEE（曜日・長）。既定 "yyyy/MM/dd"。
   * 曜日名は KskLabelsProvider の `calendarWeekdaysShort` / `calendarWeekdaysLong`（Provider 無しは「日」「日曜日」）
   */
  dateFormat?: string
  /**
   * トリガーボタンのアクセシビリティラベル。
   * カレンダーポップアップを開くボタンの読み上げテキスト。
   * 未指定時は選択済みの日付、未選択なら placeholder が読み上げられる。
   */
  triggerLabel?: string
  /**
   * ポップアップを開いたときに最初に表示する月。
   * 未指定なら選択値（value）の月、value も無ければ今月を表示する。
   * 優先順: defaultMonth > value > 今月。
   */
  defaultMonth?: Date
  /** 選択可能な最小日時。Calendar では日単位で判定する。 */
  min?: Date
  /** 選択可能な最大日時。Calendar では日単位で判定する。 */
  max?: Date
  /**
   * 値があるとき、トリガーの右側（カレンダーアイコンの左）に日付のクリアボタンを出す。
   * 押すと `onChange(undefined)` を呼ぶ。既定 false。
   *
   * カレンダーで選択中の日をもう一度押しても値は外れない（ポップオーバーを閉じるだけ）。
   * 任意項目などで利用者に値を消させたい画面はこの prop でクリア手段を明示する（issue #803。
   * 以前は react-day-picker の既定動作で再押下が選択解除になり、確かめるつもりで同じ日を
   * 押しただけで値が消えていた）。disabled のときは出さない。
   *
   * クリアボタンは見た目 24px・当たり判定 44px。トリガー内に空けた場所の実位置を測って重ねるので、
   * `className` で幅・横 padding を変えても追従する。`clearable` のときはトリガーを幅いっぱいの枠
   * （`relative w-full`）で包むため、flex 行で幅を決めるときは親要素側で決める。
   */
  clearable?: boolean
  /**
   * クリアボタンの aria-label。
   * 省略時は KskLabelsProvider の `datePickerClear`（Provider 無しは "日付をクリア"。locale="en" で "Clear date"）。
   */
  clearLabel?: string
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/**
 * クリアボタンを、トリガー内に空けた場所（spacer）へ重ねる位置を測る（issue #803）。
 * className でトリガーの幅・余白・横 padding が変わっても（DataTableDateCell の `px-2` 等）
 * spacer の実位置に合わせて追従する。測る前（SSR・初回描画）は null で、既定 padding 前提の位置を使う。
 */
function useClearButtonPosition(
  enabled: boolean,
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  spacerRef: React.RefObject<HTMLSpanElement | null>
) {
  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(null)
  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const spacer = spacerRef.current
    if (!enabled || !wrapper || !spacer) return
    const measure = () => {
      const w = wrapper.getBoundingClientRect()
      const r = spacer.getBoundingClientRect()
      // 寸法が取れない環境（jsdom 等）では既定位置のままにする
      if (r.width === 0 && r.height === 0) return
      // ボタン（24px）を spacer（44px 幅）の中央に置く。当たり判定（44px）が spacer にぴったり重なる
      const next = { left: r.left - w.left + (r.width - 24) / 2, top: r.top - w.top + (r.height - 24) / 2 }
      setPos((prev) => (prev && prev.left === next.left && prev.top === next.top ? prev : next))
    }
    measure()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)
    observer.observe(spacer)
    return () => observer.disconnect()
  }, [enabled, wrapperRef, spacerRef])
  return pos
}

const clearIcon = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
    <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

function DatePicker({
  id,
  value,
  onChange,
  placeholder: placeholderProp,
  disabled = false,
  className,
  dateFormat = "yyyy/MM/dd",
  triggerLabel,
  defaultMonth,
  min,
  max,
  clearable = false,
  clearLabel: clearLabelProp,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: DatePickerProps) {
  const defaultLabels = useKskLabels()
  const placeholder = placeholderProp ?? defaultLabels.datePickerPlaceholder
  const clearLabel = clearLabelProp ?? defaultLabels.datePickerClear
  const locale = useKskLocale() ?? "ja"
  const [open, setOpen] = React.useState(false)
  const formatted = value ? formatDate(value, dateFormat, defaultLabels, locale) : null
  // ポインタ（マウス/タップ）で日付を選んで閉じたかの記録。
  // その場合 Radix のフォーカス返却でトリガーの focus-visible リングが一瞬点灯し、
  // open 中リングの消灯と重なって明滅（ちらつき）して見えるため、返却を抑止する。
  // キーボード操作（Enter で選択）ではフォーカス返却を維持する（a11y）。
  const pointerSelectionRef = React.useRef(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const showClear = clearable && !!value && !disabled
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const spacerRef = React.useRef<HTMLSpanElement>(null)
  const clearPos = useClearButtonPosition(showClear, wrapperRef, spacerRef)

  const trigger = (
    <PopoverTrigger asChild>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        data-slot="date-picker-trigger"
        disabled={disabled}
        aria-expanded={open}
        aria-label={triggerLabel ?? (formatted ? undefined : placeholder)}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        className={triggerClass(open, !!formatted, className)}
      >
        <span>{formatted ?? placeholder}</span>
        {/* クリアボタン（トリガーの兄弟として重ねる）の当たり判定 44px の分だけ文字の右側を空ける。
            幅を当たり判定と同じにして、広げた判定がカレンダーアイコンや文字に掛からないようにする */}
        {showClear && <span ref={spacerRef} aria-hidden className="ml-auto h-6 w-11 shrink-0" />}
        {calendarIcon}
      </button>
    </PopoverTrigger>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {clearable ? (
        // button の中に button は置けないので、クリアはトリガーの兄弟にして上に重ねる
        // （MultiSelect / FilterPill と同じ構成）。clearable でない既定の DOM は変えない。
        <div ref={wrapperRef} className="relative w-full">
          {trigger}
          {showClear && (
            <button
              type="button"
              data-slot="date-picker-clear"
              aria-label={clearLabel}
              onClick={() => {
                onChange?.(undefined)
                // 値が空になるとクリアボタン自体が消えるので、フォーカスを body に落とさずトリガーへ戻す
                triggerRef.current?.focus()
              }}
              // 位置はトリガー内の spacer を測って合わせる（測る前は既定 padding 前提の位置）
              style={clearPos ? { left: clearPos.left, top: clearPos.top } : undefined}
              className={cn(
                "absolute z-[1] flex size-6 items-center justify-center rounded-full text-[var(--Object-Low-Emphasis)] transition-colors hover:bg-[var(--Surface-Secondary)] hover:text-[var(--Object-High-Emphasis)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]",
                // 見た目は 24px のまま、当たり判定だけ 44px に広げる（タップ領域 44pt の基準）
                "before:absolute before:-inset-2.5 before:content-['']",
                !clearPos && "right-[calc(var(--Field-Padding-X-Md)_+_1.625rem)] top-1/2 -translate-y-1/2"
              )}
            >
              {clearIcon}
            </button>
          )}
        </div>
      ) : (
        trigger
      )}
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onPointerDownCapture={() => {
          pointerSelectionRef.current = true
        }}
        onCloseAutoFocus={(e) => {
          if (pointerSelectionRef.current) {
            pointerSelectionRef.current = false
            e.preventDefault()
            // フォーカスを閉じかけのカレンダー内に残さない（unmount 時の唐突な
            // フォーカス移動を避け、明示的に手放す）
            const active = getActiveElement()
            if (active instanceof HTMLElement) active.blur()
          }
        }}
      >
        <Calendar
          mode="single"
          // required: 選択中の日の再押下で選択を外さない（issue #803）。react-day-picker は
          // required が無いと再押下で onSelect(undefined) を呼び、値が消えていた。
          // 値を消す手段は clearable のクリアボタンに分ける。
          required
          selected={value}
          defaultMonth={defaultMonth ?? value ?? undefined}
          startMonth={min}
          endMonth={max}
          disabled={[
            ...(min ? [{ before: min }] : []),
            ...(max ? [{ after: max }] : []),
          ]}
          onSelect={(date: Date | undefined) => {
            // 選択中の日を押したときは値を変えずに閉じるだけにする。同じ日で onChange を
            // 呼ぶと、onChange で即保存する画面が無駄に保存し、DateTimePicker では
            // min/max の丸めで時刻が動きうる。
            if (date && !(value && isSameDay(date, value))) onChange?.(date)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangePickerProps {
  value?: { from?: Date; to?: Date }
  onChange?: (range: { from?: Date; to?: Date } | undefined) => void
  /**
   * トリガーボタンのプレースホルダーテキスト。
   * 省略時は KskLabelsProvider の `dateRangePickerPlaceholder`（Provider 無しは "期間を選択"。locale="en" で "Select date range"）。
   */
  placeholder?: string
  /**
   * 開始日フィールドのプレースホルダー（分割レイアウト用）。
   * @default "開始日"
   */
  fromPlaceholder?: string
  /**
   * 終了日フィールドのプレースホルダー（分割レイアウト用）。
   * @default "終了日"
   */
  toPlaceholder?: string
  disabled?: boolean
  className?: string
  /**
   * 表示の書式。トークン: yyyy / MM / M / dd / d / EEE（曜日・短）/ EEEE（曜日・長）。既定 "yyyy/MM/dd"。
   * 曜日名は KskLabelsProvider の `calendarWeekdaysShort` / `calendarWeekdaysLong`（Provider 無しは「日」「日曜日」）
   */
  dateFormat?: string
  /** アクセシビリティラベル */
  triggerLabel?: string
  /**
   * ポップアップを開いたときに最初に表示する月。
   * 未指定なら開始日（value.from）の月、それも無ければ今月を表示する。
   * 優先順: defaultMonth > value.from > 今月。
   */
  defaultMonth?: Date
}

function DateRangePicker({
  value,
  onChange,
  placeholder: placeholderProp,
  disabled = false,
  className,
  dateFormat = "yyyy/MM/dd",
  triggerLabel,
  defaultMonth,
}: DateRangePickerProps) {
  const defaultLabels = useKskLabels()
  const placeholder = placeholderProp ?? defaultLabels.dateRangePickerPlaceholder
  const locale = useKskLocale() ?? "ja"
  const [open, setOpen] = React.useState(false)
  const formatted = value?.from
    ? value.to
      ? `${formatDate(value.from, dateFormat, defaultLabels, locale)}${defaultLabels.dateRangePickerSeparator}${formatDate(value.to, dateFormat, defaultLabels, locale)}`
      : formatDate(value.from, dateFormat, defaultLabels, locale)
    : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-slot="date-range-picker-trigger"
          disabled={disabled}
          aria-expanded={open}
          aria-label={triggerLabel ?? placeholder}
          className={triggerClass(open, !!formatted, className)}
        >
          <span>{formatted ?? placeholder}</span>
          {calendarIcon}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value?.from ? { from: value.from, to: value.to } : undefined}
          defaultMonth={defaultMonth ?? value?.from ?? undefined}
          onSelect={(r) => onChange?.(r ? { from: r.from, to: r.to } : undefined)}
          numberOfMonths={2}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, DateRangePicker }
export type { DatePickerProps, DateRangePickerProps }
