import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

function formatDate(date: Date, fmt: string): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return fmt.replace("yyyy", String(y)).replace("MM", m).replace("dd", d)
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
    "flex h-12 w-full items-center justify-between rounded-lg border bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
    open
      ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50"
      : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    hasValue ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
    className
  )
}

interface DatePickerProps {
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
}

function DatePicker({
  value,
  onChange,
  placeholder = "日付を選択",
  disabled = false,
  className,
  dateFormat = "yyyy/MM/dd",
  triggerLabel,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const formatted = value ? formatDate(value, dateFormat) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          data-slot="date-picker-trigger"
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
          mode="single"
          selected={value}
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
}

function DateRangePicker({
  value,
  onChange,
  placeholder = "期間を選択",
  disabled = false,
  className,
  dateFormat = "yyyy/MM/dd",
  triggerLabel,
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
