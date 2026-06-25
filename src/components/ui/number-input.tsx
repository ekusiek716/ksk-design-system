import * as React from "react"
import { cn } from "@/lib/utils"

interface NumberInputProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** 数値フォーマッタ（例: 通貨表示） */
  format?: (value: number) => string
  placeholder?: string
  disabled?: boolean
  size?: "sm" | "md"
  className?: string
  /** 減算ボタンの aria-label。i18n 対応: 英語では "Decrease" を渡す。@default "減らす" */
  decrementLabel?: string
  /** 加算ボタンの aria-label。i18n 対応: 英語では "Increase" を渡す。@default "増やす" */
  incrementLabel?: string
}

const SIZE = {
  sm: { wrap: "h-9 gap-2", btn: "w-8 h-8", icon: 14, text: "typo-label-sm w-8" },
  md: { wrap: "h-12 gap-3", btn: "w-10 h-10", icon: 16, text: "typo-body-md w-10" },
} as const

function NumberInput({
  value = 0,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  format,
  placeholder = "0",
  disabled = false,
  size = "md",
  className,
  decrementLabel = "減らす",
  incrementLabel = "増やす",
}: NumberInputProps) {
  const [raw, setRaw] = React.useState(String(value))
  const [focused, setFocused] = React.useState(false)

  React.useEffect(() => {
    if (!focused) setRaw(String(value))
  }, [value, focused])

  const commit = (str: string) => {
    const num = parseFloat(str.replace(/[^0-9.-]/g, ""))
    if (isNaN(num)) { setRaw(String(value)); return }
    const clamped = Math.min(max, Math.max(min, num))
    setRaw(String(clamped))
    onChange?.(clamped)
  }

  const increment = () => {
    const next = Math.min(max, value + step)
    setRaw(String(next))
    onChange?.(next)
  }

  const decrement = () => {
    const next = Math.max(min, value - step)
    setRaw(String(next))
    onChange?.(next)
  }

  const displayValue = focused ? raw : (format ? format(value) : raw)
  const s = SIZE[size]

  const btnBase = cn(
    "flex items-center justify-center rounded-full border shrink-0 transition-colors select-none",
    s.btn,
    "border-[var(--Border-Medium-Emphasis)] text-[var(--Object-Medium-Emphasis)]",
    "hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)] hover:bg-[var(--Brand-Ultra-Light)]",
    "active:scale-95",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--Border-Medium-Emphasis)] disabled:hover:text-[var(--Object-Medium-Emphasis)] disabled:hover:bg-transparent"
  )

  return (
    <div
      data-slot="number-input"
      className={cn("inline-flex items-center", s.wrap, disabled && "opacity-50 pointer-events-none", className)}
    >
      {/* Decrement */}
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled || value <= min}
        onClick={decrement}
        aria-label={decrementLabel}
        className={btnBase}
      >
        <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Value */}
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setRaw(e.target.value)}
        onFocus={() => { setFocused(true); setRaw(String(value)) }}
        onBlur={(e) => { setFocused(false); commit(e.target.value) }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur()
          if (e.key === "ArrowUp") { e.preventDefault(); increment() }
          if (e.key === "ArrowDown") { e.preventDefault(); decrement() }
        }}
        className={cn(
          "text-center bg-transparent focus-visible:outline-none text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)] tabular-nums",
          s.text
        )}
      />

      {/* Increment */}
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled || value >= max}
        onClick={increment}
        aria-label={incrementLabel}
        className={btnBase}
      >
        <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

export { NumberInput }
export type { NumberInputProps }
