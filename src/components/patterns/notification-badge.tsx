import * as React from "react"
import { cn } from "@/lib/utils"

interface NotificationBadgeProps extends React.ComponentProps<"span"> {
  count: number
  max?: number
}

function NotificationBadge({
  className,
  count,
  max = 99,
  ...props
}: NotificationBadgeProps) {
  if (count <= 0) return null

  const displayCount = count > max ? `${max}+` : count

  return (
    <span
      data-slot="notification-badge"
      className={cn(
        "inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full typo-label-xs",
        "bg-[var(--Caution-Base)] text-[var(--Text-on-Inverse)]",
        className
      )}
      {...props}
    >
      {displayCount}
    </span>
  )
}

export { NotificationBadge }
