import { cn } from "@/lib/utils"

interface ReviewCardProps {
  reviewer: string
  /** アバターの頭文字（画像がない場合） */
  avatarChar?: string
  avatarSrc?: string
  rating: number
  title?: string
  body: string
  date: string
  helpfulCount?: number
  onHelpful?: () => void
  /** helpful 済みかどうか */
  helpful?: boolean
  className?: string
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating}点 / 5点`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.2 3.8 11l.6-3.6L2 4.9l3.6-.5L7 1z"
            fill={i <= rating ? "var(--Object-Rating)" : "var(--Border-Medium-Emphasis)"}
          />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({
  reviewer,
  avatarChar,
  avatarSrc,
  rating,
  title,
  body,
  date,
  helpfulCount = 0,
  onHelpful,
  helpful = false,
  className,
}: ReviewCardProps) {
  const initials = avatarChar ?? reviewer.slice(0, 1)

  return (
    <div
      data-slot="review-card"
      className={cn(
        "bg-[var(--Surface-Primary)] rounded-xl border border-[var(--Border-Low-Emphasis)] p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden bg-[var(--Brand-Primary)] flex items-center justify-center">
          {avatarSrc ? (
            <img src={avatarSrc} alt={reviewer} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[var(--Text-on-Inverse)] typo-label-md">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="typo-label-sm text-[var(--Text-High-Emphasis)] truncate">{reviewer}</p>
          <p className="typo-body-xs text-[var(--Text-Low-Emphasis)]">{date}</p>
        </div>
        <StarRow rating={rating} />
      </div>

      {/* Content */}
      {title && (
        <p className="typo-label-sm text-[var(--Text-High-Emphasis)] mb-1">{title}</p>
      )}
      <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] leading-relaxed">{body}</p>

      {/* Helpful */}
      {onHelpful && (
        <button
          onClick={onHelpful}
          aria-pressed={helpful}
          className={cn(
            "inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border typo-label-xs transition-colors",
            helpful
              ? "border-[var(--Brand-Primary)] text-[var(--Brand-Primary)] bg-[var(--Brand-Ultra-Light)]"
              : "border-[var(--Border-Medium-Emphasis)] text-[var(--Text-Low-Emphasis)] hover:border-[var(--Brand-Primary)] hover:text-[var(--Brand-Primary)]"
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 8V5.5L5 2l.5 2H10l-.5 5H3.5L2 8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          参考になった {helpfulCount > 0 && `(${helpfulCount})`}
        </button>
      )}
    </div>
  )
}

export { ReviewCard, StarRow }
export type { ReviewCardProps }
