import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

function formatDate(date: Date, fmt: string): string {
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
    EEEE: `${["日", "月", "火", "水", "木", "金", "土"][weekday]}曜日`,
    EEE: ["日", "月", "火", "水", "木", "金", "土"][weekday],
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
    "flex h-12 w-full items-center justify-between rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
    open
      ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50"
      : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
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
   * i18n 対応: 英語では "Select date"、日本語では "日付を選択" を渡す。
   * @default "日付を選択"
   */
  placeholder?: string
  disabled?: boolean
  className?: string
  dateFormat?: string
  /**
   * トリガーボタンのアクセシビリティラベル。
   * カレンダーポップアップを開くボタンの読み上げテキスト。
   * @default placeholder と同じ値
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
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
}

function DatePicker({
  id,
  value,
  onChange,
  placeholder = "日付を選択",
  disabled = false,
  className,
  dateFormat = "yyyy/MM/dd",
  triggerLabel,
  defaultMonth,
  min,
  max,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const formatted = value ? formatDate(value, dateFormat) : null
  // ポインタ（マウス/タップ）で日付を選んで閉じたかの記録。
  // その場合 Radix のフォーカス返却でトリガーの focus-visible リングが一瞬点灯し、
  // open 中リングの消灯と重なって明滅（ちらつき）して見えるため、返却を抑止する。
  // キーボード操作（Enter で選択）ではフォーカス返却を維持する（a11y）。
  const pointerSelectionRef = React.useRef(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          data-slot="date-picker-trigger"
          disabled={disabled}
          aria-expanded={open}
          aria-label={triggerLabel ?? placeholder}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          className={triggerClass(open, !!formatted, className)}
        >
          <span>{formatted ?? placeholder}</span>
          {calendarIcon}
        </button>
      </PopoverTrigger>
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
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur()
            }
          }
        }}
      >
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={defaultMonth ?? value ?? undefined}
          startMonth={min}
          endMonth={max}
          disabled={[
            ...(min ? [{ before: min }] : []),
            ...(max ? [{ after: max }] : []),
          ]}
          onSelect={(date) => {
            onChange?.(date)
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
   * @default "期間を選択"
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
  placeholder = "期間を選択",
  disabled = false,
  className,
  dateFormat = "yyyy/MM/dd",
  triggerLabel,
  defaultMonth,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const formatted = value?.from
    ? value.to
      ? `${formatDate(value.from, dateFormat)} 〜 ${formatDate(value.to, dateFormat)}`
      : formatDate(value.from, dateFormat)
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
