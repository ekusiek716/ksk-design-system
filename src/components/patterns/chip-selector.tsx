import * as React from "react"
import { cn } from "@/lib/utils"
import { Chip } from "@/components/patterns/chip"

interface ChipSelectorOption<T extends string = string> {
  label: string
  value: T
  icon?: React.ReactNode
}

interface ChipSelectorProps<T extends string = string> {
  options: ChipSelectorOption<T>[]
  value: T[]
  onChange: (value: T[]) => void
  /** true: 複数選択可 / false: 1つのみ */
  multiple?: boolean
  /** 最大選択数（multiple=true 時のみ有効） */
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

function ChipSelector<T extends string = string>({
  options,
  value,
  onChange,
  multiple = true,
  max,
  size = "md",
  className,
}: ChipSelectorProps<T>) {
  const toggle = React.useCallback((v: T) => {
    if (multiple) {
      if (value.includes(v)) {
        onChange(value.filter((x) => x !== v))
      } else {
        if (max && value.length >= max) return
        onChange([...value, v])
      }
    } else {
      onChange(value.includes(v) ? [] : [v])
    }
  }, [value, onChange, multiple, max])

  return (
    <div
      data-slot="chip-selector"
      role="group"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((opt) => {
        const selected = value.includes(opt.value)
        const disabled = !selected && !!max && value.length >= max
        return (
          <Chip
            key={opt.value}
            size={size}
            variant={selected ? "accent" : "outline"}
            selected={selected}
            disabled={disabled}
            removable={selected && multiple}
            onRemove={() => onChange(value.filter((x) => x !== opt.value))}
            onClick={() => toggle(opt.value)}
            aria-pressed={selected}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            {opt.label}
          </Chip>
        )
      })}
    </div>
  )
}

export { ChipSelector }
export type { ChipSelectorProps, ChipSelectorOption }
