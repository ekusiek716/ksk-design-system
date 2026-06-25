import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyLabel?: string
  disabled?: boolean
  className?: string
  /** トリガーボタンの aria-label */
  triggerLabel?: string
}

function Combobox({
  options,
  value,
  onChange,
  placeholder = "選択してください",
  searchPlaceholder = "検索...",
  emptyLabel = "該当なし",
  disabled = false,
  className,
  triggerLabel,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selected = options.find((o) => o.value === value)

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const handleSelect = (opt: ComboboxOption) => {
    if (opt.disabled) return
    onChange?.(opt.value)
    setOpen(false)
    setQuery("")
  }

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery("") }}>
      <PopoverTrigger asChild>
        <button
          data-slot="combobox-trigger"
          disabled={disabled}
          aria-expanded={open}
          aria-label={triggerLabel ?? placeholder}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-lg border bg-[var(--Surface-Primary)] px-3 typo-body-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
            open
              ? "border-[var(--Border-Accent-Primary)] ring-[3px] ring-[var(--Focus-High-Emphasis)]/50"
              : "border-[var(--Border-Medium-Emphasis)] hover:border-[var(--Border-High-Emphasis)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            selected ? "text-[var(--Text-High-Emphasis)]" : "text-[var(--Text-Low-Emphasis)]",
            className
          )}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={cn("shrink-0 text-[var(--Object-Medium-Emphasis)] transition-transform", open && "rotate-180")}
            aria-hidden
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => { e.preventDefault(); inputRef.current?.focus() }}
      >
        {/* Search */}
        <div className="flex items-center border-b border-[var(--Border-Low-Emphasis)] px-3 gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[var(--Object-Low-Emphasis)] shrink-0" aria-hidden>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex h-10 flex-1 bg-transparent focus-visible:outline-none typo-body-md text-[var(--Text-High-Emphasis)] placeholder:text-[var(--Text-Low-Emphasis)]"
          />
        </div>
        {/* List */}
        <div role="listbox" className="max-h-60 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center typo-body-sm text-[var(--Text-Low-Emphasis)]">{emptyLabel}</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                disabled={opt.disabled}
                onClick={() => handleSelect(opt)}
                className={cn(
                  "relative flex w-full cursor-default items-center rounded-sm py-2 pl-8 pr-2 typo-body-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 transition-colors text-left",
                  "hover:bg-[var(--Surface-Secondary)] focus:bg-[var(--Surface-Secondary)]",
                  "disabled:pointer-events-none disabled:opacity-50",
                  opt.value === value && "text-[var(--Text-Accent-Primary)]"
                )}
              >
                {opt.value === value && (
                  <span className="absolute left-2 flex size-4 items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                {opt.label}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
