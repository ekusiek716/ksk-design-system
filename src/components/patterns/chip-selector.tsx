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
  /**
   * 複数選択を許可するか。
   *
   * ⚠️ **デフォルトは `true`（複数選択）**。サイズ・カテゴリ等の **単一選択**で使う場合は
   * **必ず `multiple={false}` を渡すこと**。渡し忘れると選択が「置き換え」でなく「追加」になり、
   * `onChange` が常に複数値の配列を返すため、`value[0]` を読む実装だと選択が反映されず
   * サイレントに壊れる（よくある footgun。issue #39）。
   *
   * @default true
   */
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
