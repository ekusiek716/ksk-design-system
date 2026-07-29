import * as React from "react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: "sm" | "md" | "lg" | "xl"
  /** 右端に "2/5" 形式のテキストを表示 */
  showLabel?: boolean
  className?: string
}

const STAR_SIZE = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
} as const

const LABEL_SIZE = {
  sm: "typo-label-xs",
  md: "typo-label-sm",
  lg: "typo-label-md",
  xl: "typo-label-lg",
} as const

function StarIcon({ filled, half, className }: { filled: boolean; half?: boolean; className?: string }) {
  if (half) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#half-fill)"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarRating({
  value,
  onChange,
  max = 5,
  size = "md",
  showLabel = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const interactive = !!onChange
  const display = hovered ?? value

  return (
    <div
      data-slot="star-rating"
      // 非インタラクティブ時は role="img" にして aria-label（合計評価の要約）を
      // 単一のまとまりとして読み上げさせる（axe: aria-prohibited-attr 対策。
      // role なし div への aria-label は無効）。
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "評価" : `${value}/${max}点`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const filled = display >= starValue
        const half = !filled && display >= starValue - 0.5
        const starClassName = cn(
          "transition-colors text-[var(--Brand-Primary)]",
          STAR_SIZE[size],
          interactive
            ? "cursor-pointer hover:scale-110 transition-transform"
            : "cursor-default pointer-events-none",
          !filled && !half && "text-[var(--Border-Medium-Emphasis)]"
        )

        // 非インタラクティブ時は各星が装飾の一部（合計は親の role="img" +
        // aria-label で読み上げ済み）。<button disabled> にすると
        // button-name 違反（accessible name 無し）になるため span + aria-hidden にする。
        if (!interactive) {
          return (
            <span key={i} aria-hidden="true" className={starClassName}>
              <StarIcon filled={filled} half={half} className="w-full h-full" />
            </span>
          )
        }

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue}点`}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            className={starClassName}
          >
            <StarIcon
              filled={filled}
              half={half}
              className="w-full h-full"
            />
          </button>
        )
      })}
      {showLabel && (
        <span className={cn("ml-1 text-[var(--Text-Medium-Emphasis)]", LABEL_SIZE[size])}>
          {value}/{max}
        </span>
      )}
    </div>
  )
}

export { StarRating }
export type { StarRatingProps }
