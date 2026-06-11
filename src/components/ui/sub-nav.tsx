import * as React from "react"
import { cn } from "@/lib/utils"

interface SubNavItem {
  label: string
  value: string
  badge?: number
}

interface SubNavProps {
  items: SubNavItem[]
  value: string
  onChange: (value: string) => void
  variant?: "underline" | "chip"
  /** スクロール時に上部に固定 */
  sticky?: boolean
  className?: string
}

function SubNav({
  items,
  value,
  onChange,
  variant = "underline",
  sticky = false,
  className,
}: SubNavProps) {
  const activeRef = React.useRef<HTMLButtonElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // アクティブ項目を中央にスクロール
  React.useEffect(() => {
    const el = activeRef.current
    const container = scrollRef.current
    if (!el || !container) return
    const elCenter = el.offsetLeft + el.offsetWidth / 2
    const containerCenter = container.clientWidth / 2
    container.scrollTo({ left: elCenter - containerCenter, behavior: "smooth" })
  }, [value])

  if (variant === "chip") {
    return (
      <div
        data-slot="sub-nav"
        data-variant="chip"
        ref={scrollRef}
        className={cn(
          "flex gap-2 overflow-x-auto scrollbar-none px-1 py-3",
          sticky && "sticky top-0 z-30 bg-[var(--Surface-Primary)]",
          className
        )}
        role="tablist"
      >
        {items.map((item) => {
          const isActive = item.value === value
          return (
            <button
              key={item.value}
              ref={isActive ? activeRef : undefined}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.value)}
              className={cn(
                "flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full border typo-label-md transition-colors",
                isActive
                  ? "bg-[var(--Brand-Primary)] border-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] font-bold"
                  : "border-transparent bg-[var(--Surface-Tertiary)] text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Quaternary)] hover:text-[var(--Text-High-Emphasis)]"
              )}
            >
              {item.label}
              {item.badge !== undefined && (
                <span className={cn(
                  "inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold",
                  isActive ? "bg-[var(--Object-on-Inverse)]/30 text-[var(--Text-on-Inverse)]" : "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // underline variant
  return (
    <div
      data-slot="sub-nav"
      data-variant="underline"
      className={cn(
        "border-b border-[var(--Border-Low-Emphasis)]",
        sticky && "sticky top-0 z-30 bg-[var(--Surface-Primary)]",
        className
      )}
    >
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-none px-1"
        role="tablist"
      >
        {items.map((item) => {
          const isActive = item.value === value
          return (
            <button
              key={item.value}
              ref={isActive ? activeRef : undefined}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.value)}
              className={cn(
                "flex items-center gap-1.5 shrink-0 px-4 py-3 typo-label-md transition-colors border-b-[3px] -mb-px",
                isActive
                  ? "border-[var(--Brand-Primary)] text-[var(--Brand-Primary)] font-bold"
                  : "border-transparent text-[var(--Text-Medium-Emphasis)] hover:text-[var(--Text-High-Emphasis)]"
              )}
            >
              {item.label}
              {item.badge !== undefined && (
                <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { SubNav }
export type { SubNavProps, SubNavItem }
