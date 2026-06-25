import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

type ProgressVariant = "default" | "success" | "warning" | "caution"
type ProgressDuration = "none" | "sm" | "md" | "lg"

interface ProgressAutoColorConfig {
  /** value がこの値未満なら success。未指定なら success 自動判定なし。 */
  successBelow?: number
  /** value がこの値以上なら warning。@default 80 */
  warningFrom?: number
  /** value がこの値未満なら warning。warningFrom より細かい範囲指定が必要な時に使用。 */
  warningBelow?: number
  /** value がこの値以上なら caution。@default 100 */
  cautionFrom?: number
}

const VARIANT_INDICATOR_BG: Record<ProgressVariant, string> = {
  default: "bg-[var(--Brand-Primary)]",
  success: "bg-[var(--Object-Success)]",
  warning: "bg-[var(--Object-Warning)]",
  caution: "bg-[var(--Object-Caution)]",
}

const DURATION_MS: Record<ProgressDuration, number> = {
  none: 0,
  sm: 150,
  md: 300,
  lg: 500,
}

const DEFAULT_AUTO_COLOR: ProgressAutoColorConfig = {
  warningFrom: 80,
  cautionFrom: 100,
}

function clampProgressValue(value: number | null | undefined) {
  if (value == null) return 0
  return Math.min(100, Math.max(0, value))
}

function getAutoProgressVariant(
  value: number | null | undefined,
  fallback: ProgressVariant,
  autoColor: boolean | ProgressAutoColorConfig | undefined
): ProgressVariant {
  if (!autoColor || value == null) return fallback
  const config: ProgressAutoColorConfig =
    autoColor === true
      ? DEFAULT_AUTO_COLOR
      : { ...DEFAULT_AUTO_COLOR, ...autoColor }

  if (config.successBelow != null && value < config.successBelow) return "success"
  if (config.cautionFrom != null && value >= config.cautionFrom) return "caution"
  if (config.warningFrom != null && value >= config.warningFrom) return "warning"
  if (config.warningBelow != null && value < config.warningBelow) return "warning"
  return fallback
}

export interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  /**
   * 色バリアント。autoColor=false の時はこの値がそのまま使われる。
   * @default "default"
   */
  variant?: ProgressVariant
  /**
   * 値に応じて success / warning / caution を自動切替。
   * true の既定閾値: 80 以上 warning、100 以上 caution。
   * 個別指定例: { successBelow: 80, warningBelow: 100, cautionFrom: 100 }
   */
  autoColor?: boolean | ProgressAutoColorConfig
  /**
   * indicator のトランジション時間プリセット。
   * - "none" : アニメーション無効
   * - "sm" (150ms) : 既定値、Tailwind デフォルトと同等
   * - "md" (300ms) : 緩やか
   * - "lg" (500ms) : 大幅変化向け (達成カードなど)
   * @default "sm"
   */
  transitionDuration?: ProgressDuration
  /** 進捗値（0〜100）。Radix v2 系で `React.ComponentProps` 経由だと型に出てこないため明示。 */
  value?: number | null
  className?: string
  id?: string
}

/**
 * Progress — 進捗バー。
 *
 * - value: 0-100
 * - variant: 色バリアント (default/success/warning/caution)
 * - transitionDuration: アニメ速度 (none/sm/md/lg)
 *
 * @example
 * <Progress value={42} />
 * <Progress value={120} variant="caution" />              // 予算超過
 * <Progress value={progress} transitionDuration="lg" />   // ホームの達成バー
 */
function Progress({
  className,
  value,
  variant = "default",
  autoColor,
  transitionDuration = "sm",
  ...props
}: ProgressProps) {
  const duration = DURATION_MS[transitionDuration]
  const resolvedVariant = getAutoProgressVariant(value, variant, autoColor)
  const displayValue = clampProgressValue(value)
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-variant={resolvedVariant}
      data-auto-color={autoColor ? "" : undefined}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[var(--Surface-Tertiary)]",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1", VARIANT_INDICATOR_BG[resolvedVariant])}
        style={{
          transform: `translateX(-${100 - displayValue}%)`,
          transition: duration === 0 ? "none" : `transform ${duration}ms ease-out`,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
export type { ProgressAutoColorConfig, ProgressDuration, ProgressVariant }
