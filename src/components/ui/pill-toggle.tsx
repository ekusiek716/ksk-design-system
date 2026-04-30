import * as React from "react"
import { cn } from "@/lib/utils"

interface PillToggleOption<T extends string = string> {
  label: string
  value: T
  icon?: React.ReactNode
}

interface PillToggleProps<T extends string = string> {
  options: PillToggleOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: "sm" | "md"
  className?: string
}

const SIZE = {
  sm: "h-8 px-3 typo-label-xs gap-1",
  md: "h-9 px-4 typo-label-sm gap-1.5",
} as const

function PillToggle<T extends string = string>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: PillToggleProps<T>) {
  return (
    <div
      data-slot="pill-toggle"
      role="group"
      className={cn(
        "inline-flex items-center rounded-full p-0.5",
        "bg-[var(--Surface-Tertiary)]",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center justify-center rounded-full transition-all",
              SIZE[size],
              active
                ? "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-sm font-medium"
                : "text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)]"
            )}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export { PillToggle }
export type { PillToggleProps, PillToggleOption }
