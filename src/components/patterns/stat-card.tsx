import * as React from "react"
import { cn } from "@/lib/utils"

type StatCardVariant = "default" | "success" | "caution" | "info" | "accent"

interface StatCardProps extends React.ComponentProps<"div"> {
  label: string
  value: string | number
  unit?: string
  trend?: { value: number; label?: string }
  icon?: React.ReactNode
  /**
   * カードのカラーバリアント。
   * - "default"  : 標準（白背景・低強調ボーダー）
   * - "success"  : 緑系（成功・達成指標）
   * - "caution"  : 赤系（注意・危険指標）
   * - "info"     : 青系（情報・参考指標）
   * - "accent"   : ブランド色（主要KPI）
   * @default "default"
   */
  variant?: StatCardVariant
}

const variantStyles: Record<StatCardVariant, { card: string; icon: string }> = {
  default:  { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",   icon: "text-[var(--Object-Medium-Emphasis)]" },
  success:  { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Success)]",   icon: "text-[var(--Object-Success)]" },
  caution:  { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Caution)]",   icon: "text-[var(--Object-Caution)]" },
  info:     { card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Info)]",      icon: "text-[var(--Text-Info)]" },
  accent:   { card: "border-[var(--Brand-Primary)]/20 bg-[var(--Surface-Accent-Primary-Light)]", icon: "text-[var(--Object-Accent-Primary)]" },
}

function StatCard({
  className,
  label,
  value,
  unit,
  trend,
  icon,
  variant = "default",
  ...props
}: StatCardProps) {
  const styles = variantStyles[variant]
  return (
    <div
      data-slot="stat-card"
      data-variant={variant}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 shadow-[var(--shadow-md)]",
        styles.card,
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="typo-body-sm text-[var(--Text-Medium-Emphasis)]">
          {label}
        </span>
        {icon && (
          <span className={styles.icon}>{icon}</span>
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
export type { StatCardProps, StatCardVariant }
