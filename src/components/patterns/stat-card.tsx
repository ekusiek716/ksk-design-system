import * as React from "react"
import { cn } from "@/lib/utils"

interface StatCardProps extends React.ComponentProps<"div"> {
  label: string
  value: string | number
  unit?: string
  trend?: { value: number; label?: string }
  icon?: React.ReactNode
}

function StatCard({
  className,
  label,
  value,
  unit,
  trend,
  icon,
  ...props
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-4 shadow-[var(--shadow-md)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          {label}
        </span>
        {icon && (
          <span className="text-[var(--Object-Medium-Emphasis)]">{icon}</span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">
          {value}
        </span>
        {unit && (
          <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
            {unit}
          </span>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "typo-body-sm flex items-center gap-1",
            trend.value >= 0
              ? "text-[var(--Text-Success)]"
              : "text-[var(--Text-Caution)]"
          )}
        >
          <span>
            {trend.value >= 0 ? "+" : ""}
            {trend.value}%
          </span>
          {trend.label && (
            <span className="text-[var(--Text-Low-Emphasis)]">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { StatCard }
