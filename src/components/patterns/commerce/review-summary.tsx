import { cn } from "@/lib/utils"
import { StarRow } from "./review-card"

interface ReviewSummaryProps {
  /** 平均評価 (0-5) */
  averageRating: number
  /** 総レビュー数 */
  totalCount: number
  /** 各星評価の件数 [5星, 4星, 3星, 2星, 1星] */
  distribution: [number, number, number, number, number]
  className?: string
}

function ReviewSummary({
  averageRating,
  totalCount,
  distribution,
  className,
}: ReviewSummaryProps) {
  const max = Math.max(...distribution, 1)

  return (
    <div
      data-slot="review-summary"
      className={cn(
        "bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] p-4",
        className
      )}
    >
      {/* Score */}
      <div className="flex items-end gap-3 mb-3">
        <span className="text-4xl font-black text-[var(--Text-High-Emphasis)] leading-none tabular-nums">
          {averageRating.toFixed(1)}
        </span>
        <div className="pb-0.5">
          <StarRow rating={Math.round(averageRating)} size={16} />
          <p className="typo-body-xs text-[var(--Text-Low-Emphasis)] mt-0.5">
            {totalCount.toLocaleString()}件の口コミ
          </p>
        </div>
      </div>

      {/* Gauge bars */}
      <div className="flex flex-col gap-1.5">
        {distribution.map((count, idx) => {
          const star = 5 - idx
          const pct = Math.round((count / max) * 100)
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="typo-body-xs text-[var(--Text-Medium-Emphasis)] w-3 text-right">
                {star}
              </span>
              <div className="flex-1 h-1.5 bg-[var(--Surface-Tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--Object-Rating)] rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="typo-body-xs text-[var(--Text-Low-Emphasis)] w-6 text-right">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ReviewSummary }
export type { ReviewSummaryProps }
