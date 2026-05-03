import * as React from "react"
import { cn } from "@/lib/utils"

interface NotificationBadgeProps extends React.ComponentProps<"span"> {
  count: number
  max?: number
  /**
   * バッジのサイズ。
   * - "xs"      : 最小（数字なし・ドット表示 6px）
   * - "sm"      : 小（16px、1〜2桁向け）
   * - "default" : 標準（20px）
   * @default "default"
   */
  size?: "xs" | "sm" | "default"
}

const sizeStyles: Record<NonNullable<NotificationBadgeProps["size"]>, string> = {
  xs:      "size-1.5 min-w-0 px-0",
  sm:      "min-w-4 h-4 px-1 typo-label-xs",
  default: "min-w-5 h-5 px-1.5 typo-label-xs",
}

function NotificationBadge({
  className,
  count,
  max = 99,
  size = "default",
  ...props
}: NotificationBadgeProps) {
  if (count <= 0) return null

  const displayCount = count > max ? `${max}+` : count

  return (
    <span
      data-slot="notification-badge"
      data-size={size}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)]",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {size !== "xs" && displayCount}
    </span>
  )
}

export { NotificationBadge }
