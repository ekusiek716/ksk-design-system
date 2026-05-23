import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * ListItem の意味づけ。
 * - "default"     : 通常のリスト項目（既定）。
 * - "destructive" : 削除・ログアウトなど取り返しのつかない操作。
 *                   title を Caution 色にし、interactive=true の場合は
 *                   hover を薄い caution 背景に切り替える。
 *                   leftSlot のアイコンは呼び出し側で色付けする想定
 *                   （currentColor を継承させたい場合は className で調整）。
 */
type ListItemVariant = "default" | "destructive"

interface ListItemProps extends React.ComponentProps<"div"> {
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  bottomSlot?: React.ReactNode
  title?: string
  description?: string
  interactive?: boolean
  variant?: ListItemVariant
}

function ListItem({
  className,
  leftSlot,
  rightSlot,
  bottomSlot,
  title,
  description,
  interactive = false,
  variant = "default",
  children,
  ...props
}: ListItemProps) {
  const isDestructive = variant === "destructive"
  return (
    <div
      data-slot="list-item"
      data-variant={variant}
      className={cn(
        "flex items-start gap-3 py-3 px-4 border-b border-[var(--Border-Low-Emphasis)]",
        interactive && (
          isDestructive
            ? "cursor-pointer hover:bg-[var(--Surface-Caution-Subtle)] transition-colors"
            : "cursor-pointer hover:bg-[var(--Surface-Secondary)] transition-colors"
        ),
        className
      )}
      {...props}
    >
      {leftSlot && <div className="shrink-0">{leftSlot}</div>}
      <div className="flex-1 min-w-0">
        {title && (
          <p
            className={cn(
              "typo-label-md truncate",
              isDestructive
                ? "text-[var(--Caution-Base)]"
                : "text-[var(--Text-High-Emphasis)]"
            )}
          >
            {title}
          </p>
        )}
        {description && (
          <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-0.5">
            {description}
          </p>
        )}
        {children}
        {bottomSlot && <div className="mt-2">{bottomSlot}</div>}
      </div>
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  )
}

export { ListItem }
export type { ListItemProps, ListItemVariant }
