import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "../../ui/dropdown-menu"

interface KebabMenuActionItem {
  type?: "item"
  label: string
  icon?: React.ReactNode
  description?: string
  shortcut?: string
  disabled?: boolean
  onClick?: () => void
  destructive?: boolean
}

interface KebabMenuSeparatorItem {
  type: "separator"
}

type KebabMenuItem = KebabMenuActionItem | KebabMenuSeparatorItem

interface KebabMenuProps extends React.ComponentProps<"button"> {
  items: KebabMenuItem[]
}

function isSeparator(item: KebabMenuItem): item is KebabMenuSeparatorItem {
  return item.type === "separator"
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="text-[var(--Text-Low-Emphasis)]"
          >
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {items.map((item, index) =>
          isSeparator(item) ? (
            <DropdownMenuSeparator key={`separator-${index}`} />
          ) : (
            <DropdownMenuItem
              key={`${item.label}-${index}`}
              variant={item.destructive ? "destructive" : "default"}
              disabled={item.disabled}
              onSelect={() => item.onClick?.()}
              className={cn("justify-between gap-4", item.description ? "items-start" : "items-center")}
            >
              <span className={cn("flex min-w-0 gap-2", item.description ? "items-start" : "items-center")}>
                {item.icon && <span className={cn("shrink-0", item.description && "mt-0.5")}>{item.icon}</span>}
                <span className="min-w-0">
                  <span className="block typo-body-md">{item.label}</span>
                  {item.description && (
                    <span className="block typo-body-sm text-[var(--Text-Low-Emphasis)]">
                      {item.description}
                    </span>
                  )}
                </span>
              </span>
              {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { KebabMenu }
export type { KebabMenuItem, KebabMenuActionItem, KebabMenuSeparatorItem }
