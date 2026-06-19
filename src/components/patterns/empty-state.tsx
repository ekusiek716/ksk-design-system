import * as React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.ComponentProps<"div"> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  /** 表示密度。リスト内では compact / inline を使う。 */
  size?: "default" | "compact" | "inline"
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
  size = "default",
  iconClassName,
  ...props
}: EmptyStateProps) {
  const isInline = size === "inline"
  return (
    <div
      data-slot="empty-state"
      data-size={size}
      className={cn(
        "flex justify-center",
        size === "default" && "flex-col items-center py-16 px-4 text-center",
        size === "compact" && "flex-col items-center py-8 px-4 text-center",
        size === "inline" && "flex-row items-center gap-3 py-3 px-4 text-left",
        className
      )}
      {...props}
    >
      {icon && (
        <div className={cn(
          "text-[var(--Object-Low-Emphasis)]",
          isInline ? "shrink-0" : "mb-4",
          iconClassName,
        )}>{icon}</div>
      )}
      <div className={cn(isInline && "min-w-0 flex-1")}>
        <h3 className={cn(
          "text-[var(--Text-High-Emphasis)]",
          isInline ? "typo-label-md" : "typo-heading-md",
        )}>
          {title}
        </h3>
        {description && (
          <p className={cn(
            "text-[var(--Text-Medium-Emphasis)]",
            isInline ? "typo-body-sm mt-0.5" : "typo-body-md mt-2 max-w-sm",
          )}>
            {description}
          </p>
        )}
        {action && <div className={cn(isInline ? "mt-3" : "mt-6")}>{action}</div>}
      </div>
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
