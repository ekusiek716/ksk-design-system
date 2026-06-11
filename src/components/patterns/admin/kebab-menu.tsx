import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu"

interface KebabMenuItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  destructive?: boolean
}

interface KebabMenuProps extends React.ComponentProps<"button"> {
  items: KebabMenuItem[]
}

/**
 * 縦三点メニュー。DropdownMenu（Radix）を内部利用しており、
 * キーボード操作・Esc クローズ・フォーカス管理・role="menu" を備える。
 */
function KebabMenu({ items, className, ...props }: KebabMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-slot="kebab-menu"
          className={cn(
            "flex size-8 items-center justify-center rounded-lg hover:bg-[var(--Surface-Secondary)] transition-colors",
            className
          )}
          aria-label="メニュー"
          {...props}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--Text-Low-Emphasis)]">
            <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            variant={item.destructive ? "destructive" : "default"}
            onSelect={() => item.onClick?.()}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { KebabMenu }
export type { KebabMenuItem }
