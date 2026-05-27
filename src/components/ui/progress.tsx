import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

type ProgressVariant = "default" | "success" | "warning" | "caution"
type ProgressDuration = "none" | "sm" | "md" | "lg"

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

export interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  /**
   * 色バリアント。値の閾値に応じて呼び出し側で切り替える想定 (例: 100% 超で caution)。
   * @default "default"
   */
  variant?: ProgressVariant
  /**
   * indicator のトランジション時間プリセット。
   * - "none" : アニメーション無効
   * - "sm" (150ms) : 既定値、Tailwind デフォルトと同等
   * - "md" (300ms) : 緩やか
   * - "lg" (500ms) : 大幅変化向け (達成カードなど)
   * @default "sm"
   */
  transitionDuration?: ProgressDuration
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
  transitionDuration = "sm",
  ...props
}: ProgressProps) {
  const duration = DURATION_MS[transitionDuration]
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-variant={variant}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[var(--Surface-Tertiary)]",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1", VARIANT_INDICATOR_BG[variant])}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          transition: duration === 0 ? "none" : `transform ${duration}ms ease-out`,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
