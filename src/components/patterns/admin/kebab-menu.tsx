import * as React from "react"
import { cn } from "@/lib/utils"
import { useKskLabels } from "../../ui/ksk-labels"
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
  /**
   * トリガーボタンの aria-label（DataTableActionCell.menuLabel と同名）。
   * 省略時は KskLabels の `menu`（Provider 無しなら「メニュー」、locale="en" なら「Menu」。issue #752）
   */
  menuLabel?: string
}

function isSeparator(item: KebabMenuItem): item is KebabMenuSeparatorItem {
  return item.type === "separator"
}

/**
 * 縦三点メニュー。DropdownMenu（Radix）を内部利用しており、
 * キーボード操作・Esc クローズ・フォーカス管理・role="menu" を備える。
 */
function KebabMenu({ items, className, menuLabel, ...props }: KebabMenuProps) {
  const defaultLabels = useKskLabels()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-slot="kebab-menu"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--Surface-Secondary)] transition-colors",
            // 見た目は 32px のまま、当たり判定を 44px に広げる（DetailSheetHeader の閉じるボタンと同じ透明な before。issue #752）。
            // relative は before の基準。consumer が className で absolute 等を渡せば tailwind-merge でそちらが勝ち、基準は保たれる
            "relative before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-full before:min-h-11 before:min-w-11 before:content-['']",
            className
          )}
          aria-label={menuLabel ?? defaultLabels.menu}
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
