import { cn } from "@/lib/utils"
import { useKskLabels } from "../../ui/ksk-labels"

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
            "px-3 py-1 rounded-full typo-label-xs border border-[var(--Border-Control,var(--Border-Medium-Emphasis))] transition-colors whitespace-nowrap shrink-0",
            opt.value === value
              ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] border-[var(--Brand-Primary)]"
              : "border-[var(--Border-Control,var(--Border-Medium-Emphasis))] text-[var(--Text-Medium-Emphasis)] bg-[var(--Surface-Primary)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
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
  const defaultLabels = useKskLabels()
  const granularityOptions: { label: string; value: Granularity }[] = [
    { label: defaultLabels.chartGranularityHour, value: "hour" },
    { label: defaultLabels.chartGranularityDay, value: "day" },
    { label: defaultLabels.chartGranularityWeek, value: "week" },
    { label: defaultLabels.chartGranularityMonth, value: "month" },
  ]
  const periodOptions: { label: string; value: Period }[] = [
    { label: defaultLabels.chartPeriod7d, value: "7d" },
    { label: defaultLabels.chartPeriod30d, value: "30d" },
    { label: defaultLabels.chartPeriod90d, value: "90d" },
    { label: defaultLabels.chartPeriod1y, value: "1y" },
    { label: defaultLabels.chartPeriodCustom, value: "custom" },
  ]
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
          <span className="typo-label-xs text-[var(--Text-Low-Emphasis)] min-w-10 shrink-0 pt-1.5">{defaultLabels.chartControlsGranularity}</span>
          <ChipGroup
            options={granularityOptions}
            value={granularity}
            onChange={onGranularityChange}
          />
        </div>
      )}

      {/* Period */}
      {onPeriodChange && (
        <div className="flex items-start gap-3">
          <span className="typo-label-xs text-[var(--Text-Low-Emphasis)] min-w-10 shrink-0 pt-1.5">{defaultLabels.chartControlsPeriod}</span>
          <ChipGroup
            options={periodOptions}
            value={period}
            onChange={handlePeriodChange}
          />
        </div>
      )}

      {/* Comparison toggle */}
      {onComparisonChange && (
        <div className="flex items-start gap-3">
          <span className="typo-label-xs text-[var(--Text-Low-Emphasis)] min-w-10 shrink-0 pt-1.5">{defaultLabels.chartControlsComparison}</span>
          <button
            onClick={() => onComparisonChange(!showComparison)}
            aria-pressed={showComparison}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--Border-Control,var(--Border-Medium-Emphasis))] typo-label-xs transition-colors",
              showComparison
                ? "bg-[var(--Brand-Ultra-Light)] border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]"
                : "border-[var(--Border-Control,var(--Border-Medium-Emphasis))] text-[var(--Text-Medium-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
            )}
          >
            <span className={cn(
              "w-2 h-2 rounded-full",
              showComparison ? "bg-[var(--Brand-Primary)]" : "bg-[var(--Border-Control,var(--Border-Medium-Emphasis))]"
            )} />
            {defaultLabels.chartControlsShowComparison}
          </button>
        </div>
      )}
    </div>
  )
}

export { ChartControls }
export type { ChartControlsProps, Granularity, Period }
