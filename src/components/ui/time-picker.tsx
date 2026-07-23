import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@/lib/utils"

export interface TimePickerProps {
  id?: string
  /** "HH:mm" 形式の値。例: "09:30" */
  value?: string
  onChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
  /** 分の刻み幅。@default 1 */
  minuteStep?: number
  className?: string
  /** トリガーボタンの aria-label。@default placeholder */
  triggerLabel?: string
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
}

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function parseTime(v?: string): { h: number; m: number } | null {
  if (!v) return null
  const [hStr, mStr] = v.split(":")
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  if (isNaN(h) || isNaN(m)) return null
  return { h: Math.min(23, Math.max(0, h)), m: Math.min(59, Math.max(0, m)) }
}

const clockIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--Object-Medium-Emphasis)] shrink-0" aria-hidden>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function TimePickerColumn({
  items,
  selected,
  onSelect,
}: {
  items: number[]
  selected: number
  onSelect: (v: number) => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current?.querySelector(`[data-selected="true"]`) as HTMLElement | null
    el?.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [selected])

  return (
    <div ref={ref} className="flex flex-col overflow-y-auto h-48 scrollbar-hide snap-y snap-mandatory">
      {items.map((v) => (
        <button
          key={v}
          type="button"
          data-selected={v === selected}
          onClick={() => onSelect(v)}
          className={cn(
            "shrink-0 h-10 flex items-center justify-center rounded-lg typo-body-md transition-colors snap-center",
            v === selected
              ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
              : "text-[var(--Text-High-Emphasis)] hover:bg-[var(--Surface-Secondary)]"
          )}
        >
          {pad2(v)}
        </button>
      ))}
    </div>
  )
}

function TimePicker({
  id,
  value,
  onChange,
  placeholder = "時刻を選択",
  disabled = false,
  minuteStep = 1,
  className,
  triggerLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const parsed = parseTime(value)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => i * minuteStep
  )

  const currentH = parsed?.h ?? 0
  const currentM = parsed?.m ?? 0

  const handleH = (h: number) => onChange?.(`${pad2(h)}:${pad2(currentM)}`)
  const handleM = (m: number) => onChange?.(`${pad2(currentH)}:${pad2(m)}`)

  const displayValue = parsed ? `${pad2(parsed.h)}:${pad2(parsed.m)}` : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          data-slot="time-picker-trigger"
          disabled={disabled}
          aria-expanded={open}
          aria-label={triggerLabel ?? placeholder}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
            open
              ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50"
              : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            displayValue ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
            className
          )}
        >
          <span>{displayValue ?? placeholder}</span>
          {clockIcon}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-3" align="start">
        <div className="flex gap-2 items-start">
          {/* Hour column */}
          <div className="flex-1">
            <div className="typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1">時</div>
            <TimePickerColumn items={hours} selected={currentH} onSelect={handleH} />
          </div>
          <div className="flex items-center justify-center h-48 typo-heading-md text-[var(--Text-Low-Emphasis)] select-none pt-6">:</div>
          {/* Minute column */}
          <div className="flex-1">
            <div className="typo-label-xs text-[var(--Text-Low-Emphasis)] text-center mb-1">分</div>
            <TimePickerColumn items={minutes} selected={currentM} onSelect={handleM} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { TimePicker }
