import * as React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.ComponentProps<"div"> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  /**
   * アイコンの色クラスを上書きする。コンテキストに応じてアイコン色を変えたいとき。
   * @example iconClassName="text-[var(--Object-Caution)]"
   * @default "text-[var(--Object-Low-Emphasis)]"
   */
  iconClassName?: string
}

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  iconClassName,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className={cn("mb-4 text-[var(--Object-Low-Emphasis)]", iconClassName)}>{icon}</div>
      )}
      <h3 className="typo-heading-md text-[var(--Text-High-Emphasis)]">
        {title}
      </h3>
      {description && (
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export { EmptyState }
