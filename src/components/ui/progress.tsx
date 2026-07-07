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

/** masked=true のときに使う固定表示の割合（%）。value に一切依存しない。native 側と同じ値。 */
const MASKED_PROGRESS_PCT = 45

function clampProgressValue(value: number | null | undefined) {
  if (value == null) return 0
  return Math.min(100, Math.max(0, value))
}

/**
 * 描画に使う実効値を決める純粋関数。
 * masked=true のときは value を一切見ず常に同じ値を返す（バー幅からの逆算防止）。
 */
export function resolveProgressDisplayValue(value: number | null | undefined, masked: boolean | undefined): number {
  if (masked) return MASKED_PROGRESS_PCT
  return clampProgressValue(value)
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
  /**
   * true のとき、実 value に依存しない見た目にする（バー幅を固定表示にする）。
   * 未課金ユーザー向けティザー表示等、value からバー幅経由で実データを逆算されるのを防ぐための表示専用フラグ。
   * masked 時は value/autoColor を無視し、常に同じ幅・同じトーンで描画する。
   */
  masked?: boolean
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
  masked,
  ...props
}: ProgressProps) {
  const duration = DURATION_MS[transitionDuration]
  // masked 時は autoColor による色分岐も value に依存するため使わない（バー幅だけでなく色からの逆算も防ぐ）。
  const resolvedVariant = masked ? variant : getAutoProgressVariant(value, variant, autoColor)
  const displayValue = resolveProgressDisplayValue(value, masked)
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-variant={resolvedVariant}
      data-auto-color={autoColor ? "" : undefined}
      data-masked={masked ? "" : undefined}
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
