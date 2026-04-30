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
  className?: string
}

function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  format,
  placeholder = "0",
  disabled = false,
  className,
}: NumberInputProps) {
  const [raw, setRaw] = React.useState(value !== undefined ? String(value) : "")
  const [focused, setFocused] = React.useState(false)

  // 外部 value が変わったら同期
  React.useEffect(() => {
    if (!focused && value !== undefined) setRaw(String(value))
  }, [value, focused])

  const commit = (str: string) => {
    const num = parseFloat(str.replace(/[^0-9.-]/g, ""))
    if (isNaN(num)) { setRaw(value !== undefined ? String(value) : ""); return }
    const clamped = Math.min(max, Math.max(min, num))
    setRaw(String(clamped))
    onChange?.(clamped)
  }

  const increment = () => {
    const current = parseFloat(raw) || 0
    const next = Math.min(max, current + step)
    setRaw(String(next))
    onChange?.(next)
  }

  const decrement = () => {
    const current = parseFloat(raw) || 0
    const next = Math.max(min, current - step)
    setRaw(String(next))
    onChange?.(next)
  }

  const displayValue = focused
    ? raw
    : (value !== undefined && format ? format(value) : raw)

  return (
    <div
      data-slot="number-input"
      className={cn(
        "flex h-12 w-full items-center rounded-lg border border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Primary)] overflow-hidden transition-colors",
        "focus-within:ring-[3px] focus-within:ring-[var(--Focus-High-Emphasis)]/50 focus-within:border-[var(--Border-Accent-Primary)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled || (value !== undefined && value <= min)}
        onClick={decrement}
        className="flex items-center justify-center w-10 h-full shrink-0 text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="減らす"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setRaw(e.target.value)}
        onFocus={() => { setFocused(true); setRaw(value !== undefined ? String(value) : "") }}
        onBlur={(e) => { setFocused(false); commit(e.target.value) }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur()
          if (e.key === "ArrowUp") { e.preventDefault(); increment() }
          if (e.key === "ArrowDown") { e.preventDefault(); decrement() }
        }}
        className="flex-1 h-full text-center typo-body-md text-[var(--Text-High-Emphasis)] bg-transparent outline-none placeholder:text-[var(--Text-Low-Emphasis)] disabled:cursor-not-allowed"
      />

      <button
        type="button"
        tabIndex={-1}
        disabled={disabled || (value !== undefined && value >= max)}
        onClick={increment}
        className="flex items-center justify-center w-10 h-full shrink-0 text-[var(--Object-Medium-Emphasis)] hover:text-[var(--Object-High-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="増やす"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

export { NumberInput }
export type { NumberInputProps }
