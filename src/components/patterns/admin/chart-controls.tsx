import { cn } from "@/lib/utils"

type Granularity = "hour" | "day" | "week" | "month"
type Period = "7d" | "30d" | "90d" | "1y" | "custom"

interface ChartControlsProps {
  granularity?: Granularity
  onGranularityChange?: (value: Granularity) => void
  period?: Period
  onPeriodChange?: (value: Period) => void
  showComparison?: boolean
  onComparisonChange?: (value: boolean) => void
  /** カスタム期間ボタンクリック */
  onCustomPeriod?: () => void
  className?: string
}

const GRANULARITY_OPTIONS: { label: string; value: Granularity }[] = [
  { label: "時間", value: "hour" },
  { label: "日", value: "day" },
  { label: "週", value: "week" },
  { label: "月", value: "month" },
]

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "7日", value: "7d" },
  { label: "30日", value: "30d" },
  { label: "90日", value: "90d" },
  { label: "1年", value: "1y" },
  { label: "カスタム", value: "custom" },
]

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1" role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          aria-pressed={opt.value === value}
          className={cn(
            "px-3 py-1 rounded-full typo-label-xs border transition-colors whitespace-nowrap shrink-0",
            opt.value === value
              ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] border-[var(--Brand-Primary)]"
              : "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] bg-[var(--Surface-Primary)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function ChartControls({
  granularity = "day",
  onGranularityChange,
  period = "7d",
  onPeriodChange,
  showComparison = false,
  onComparisonChange,
  onCustomPeriod,
  className,
}: ChartControlsProps) {
  const handlePeriodChange = (v: Period) => {
    if (v === "custom") {
      onCustomPeriod?.()
      return
    }
    onPeriodChange?.(v)
  }

  return (
    <div
      data-slot="chart-controls"
      className={cn("flex flex-col gap-2.5", className)}
    >
      {/* Granularity */}
      {onGranularityChange && (
        <div className="flex items-start gap-3">
          <span className="typo-label-xs text-[var(--Text-Low-Emphasis)] w-10 shrink-0 pt-1.5">粒度</span>
          <ChipGroup
            options={GRANULARITY_OPTIONS}
            value={granularity}
            onChange={onGranularityChange}
          />
        </div>
      )}

      {/* Period */}
      {onPeriodChange && (
        <div className="flex items-start gap-3">
          <span className="typo-label-xs text-[var(--Text-Low-Emphasis)] w-10 shrink-0 pt-1.5">期間</span>
          <ChipGroup
            options={PERIOD_OPTIONS}
            value={period}
            onChange={handlePeriodChange}
          />
        </div>
      )}

      {/* Comparison toggle */}
      {onComparisonChange && (
        <div className="flex items-start gap-3">
          <span className="typo-label-xs text-[var(--Text-Low-Emphasis)] w-10 shrink-0 pt-1.5">比較</span>
          <button
            onClick={() => onComparisonChange(!showComparison)}
            aria-pressed={showComparison}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border typo-label-xs transition-colors",
              showComparison
                ? "bg-[var(--Brand-Ultra-Light)] border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]"
                : "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
            )}
          >
            <span className={cn(
              "w-2 h-2 rounded-full",
              showComparison ? "bg-[var(--Brand-Primary)]" : "bg-[var(--Border-Medium-Emphasis)]"
            )} />
            前期比を表示
          </button>
        </div>
      )}
    </div>
  )
}

export { ChartControls }
export type { ChartControlsProps, Granularity, Period }
