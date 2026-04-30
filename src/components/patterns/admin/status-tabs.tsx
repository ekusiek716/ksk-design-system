import * as React from "react"
import { cn } from "@/lib/utils"

interface StatusTabItem {
  label: string
  count: number
}

interface StatusTabsProps extends Omit<React.ComponentProps<"div">, "onSelect"> {
  items: StatusTabItem[]
  activeIndex?: number
  onSelect?: (index: number) => void
}

function StatusTabs({ items, activeIndex = 0, onSelect, className, ...props }: StatusTabsProps) {
  return (
    <div data-slot="status-tabs" className={cn("flex gap-2 overflow-x-auto scrollbar-hide", className)} role="tablist" {...props}>
      {items.map((item, i) => (
        <button
          key={item.label}
          type="button"
          role="tab"
          aria-selected={activeIndex === i}
          onClick={() => onSelect?.(i)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3 h-8 typo-label-sm transition-colors whitespace-nowrap",
            activeIndex === i
              ? "bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-Accent-Primary)]"
              : "bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] hover:opacity-80"
          )}
        >
          {item.label}
          {/* 件数バッジ */}
          <span className={cn(
            "inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full typo-label-xs",
            activeIndex === i
              ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
              : "bg-[var(--Surface-Quaternary)] text-[var(--Text-Medium-Emphasis)]"
          )}>
            {item.count}
          </span>
        </button>
      ))}
    </div>
  )
}

export { StatusTabs }
export type { StatusTabItem }
