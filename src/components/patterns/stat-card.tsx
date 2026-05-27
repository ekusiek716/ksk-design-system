import * as React from "react"
import { cn } from "@/lib/utils"

type StatCardVariant = "default" | "success" | "caution" | "info" | "accent"

interface StatCardProps extends Omit<React.ComponentProps<"div">, "onClick"> {
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
  /**
   * Interactive モード: true にすると card が button のように振る舞う。
   * - `role=button` / `tabIndex=0` / focus-visible ring / active:scale を自動付与
   * - onClick / onKeyDown (Enter/Space) を有効化
   * - hover で軽い陰り、cursor-pointer
   *
   * onClick だけ渡しても interactive=true 扱いする。
   */
  interactive?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const variantStyles: Record<StatCardVariant, { card: string; icon: string; hoverBg: string }> = {
  default:  {
    card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
    icon: "text-[var(--Object-Medium-Emphasis)]",
    hoverBg: "hover:bg-[var(--Surface-Secondary)]",
  },
  success:  {
    card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Success)]",
    icon: "text-[var(--Object-Success)]",
    hoverBg: "hover:brightness-[0.98]",
  },
  caution:  {
    card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Caution)]",
    icon: "text-[var(--Object-Caution)]",
    hoverBg: "hover:brightness-[0.98]",
  },
  info:     {
    card: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Info)]",
    icon: "text-[var(--Text-Info)]",
    hoverBg: "hover:brightness-[0.98]",
  },
  accent:   {
    card: "border-[var(--Brand-Primary)]/20 bg-[var(--Surface-Accent-Primary-Light)]",
    icon: "text-[var(--Object-Accent-Primary)]",
    hoverBg: "hover:brightness-[0.98]",
  },
}

/**
 * StatCard — KPI / メトリクス表示用の小さなカード。
 *
 * - `label` + `value` (+ optional `unit`, `trend`, `icon`) でデータ部を表現
 * - `variant` で色 (default / success / caution / info / accent)
 * - `interactive` (または `onClick`) でボタン化 — タップでナビゲートする
 *   ホーム画面のメトリクスタイル等に最適
 */
function StatCard({
  className,
  label,
  value,
  unit,
  trend,
  icon,
  variant = "default",
  interactive,
  onClick,
  ...props
}: StatCardProps) {
  const styles = variantStyles[variant]
  const isInteractive = interactive ?? !!onClick

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive || !onClick) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
    }
  }

  return (
    <div
      data-slot="stat-card"
      data-variant={variant}
      data-interactive={isInteractive || undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 shadow-[var(--shadow-md)]",
        styles.card,
        isInteractive && [
          "cursor-pointer transition-all",
          styles.hoverBg,
          "active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)] focus-visible:ring-offset-2",
        ],
        className,
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
