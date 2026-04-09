import * as React from "react"
import { cn } from "@/lib/utils"

interface ListItemProps extends React.ComponentProps<"div"> {
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  bottomSlot?: React.ReactNode
  title?: string
  description?: string
  interactive?: boolean
}

function ListItem({
  className,
  leftSlot,
  rightSlot,
  bottomSlot,
  title,
  description,
  interactive = false,
  children,
  ...props
}: ListItemProps) {
  return (
    <div
      data-slot="list-item"
      className={cn(
        "flex items-start gap-3 py-3 px-4 border-b border-[var(--Border-Low-Emphasis)]",
        interactive && "cursor-pointer hover:bg-[var(--Surface-Secondary)] transition-colors",
        className
      )}
      {...props}
    >
      {leftSlot && <div className="shrink-0">{leftSlot}</div>}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="typo-label-md text-[var(--Text-High-Emphasis)] truncate">
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
