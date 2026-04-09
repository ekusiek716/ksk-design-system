import * as React from "react"
import { cn } from "@/lib/utils"

interface KebabMenuItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  destructive?: boolean
}

interface KebabMenuProps extends React.ComponentProps<"div"> {
  items: KebabMenuItem[]
}

function KebabMenu({ items, className, ...props }: KebabMenuProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div data-slot="kebab-menu" ref={ref} className={cn("relative", className)} {...props}>
      <button
        type="button"
        className="flex size-8 items-center justify-center rounded-lg hover:bg-[var(--Surface-Secondary)] transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="メニュー"
        aria-expanded={open}
      >
        {/* 縦三点アイコン */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--Text-Low-Emphasis)]">
          <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 typo-body-md text-left transition-colors hover:bg-[var(--Surface-Secondary)]",
                item.destructive ? "text-[var(--Text-Caution)]" : "text-[var(--Text-High-Emphasis)]"
              )}
              onClick={() => { item.onClick?.(); setOpen(false) }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { KebabMenu }
export type { KebabMenuItem }
