import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: "sm" | "md" | "lg" | "xl"
  /** 右端に "2/5" 形式のテキストを表示 */
  showLabel?: boolean
  /**
   * 有効時、現在値と同じ星を再度クリック/タップすると onChange(0) を渡し
   * 未評価状態に戻せるようにする（既定 false = 従来どおり再クリックでも値は変わらない）。
   *
   * 注: WAI-ARIA の radiogroup 慣習（radio はユーザー操作で未選択に戻せない）からの
   * 意図的な逸脱。クリア後は aria-checked がすべて false になる。
   */
  allowClear?: boolean
  /** interactive 時（onChange 指定時）の radiogroup 全体の aria-label。既定は "評価"。 */
  label?: string
  /** read-only 時の aria-label を組み立てる関数。既定は `${value}/${max}点`。 */
  valueLabel?: (value: number, max: number) => string
  /** interactive 時の各星（radio）の aria-label を組み立てる関数。既定は `${value}点`。 */
  starLabel?: (value: number) => string
  className?: string
}

const STAR_SIZE = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
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
  allowClear = false,
  label = "評価",
  valueLabel = (v, m) => `${v}/${m}点`,
  starLabel = (v) => `${v}点`,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const starRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const interactive = !!onChange
  const display = hovered ?? value
  const selectedValue =
    Number.isInteger(value) && value >= 1 && value <= max ? value : 1

  const selectByKeyboard = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentValue: number,
  ) => {
    let nextValue: number
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        nextValue = Math.max(1, currentValue - 1)
        break
      case "ArrowRight":
      case "ArrowDown":
        nextValue = Math.min(max, currentValue + 1)
        break
      case "Home":
        nextValue = 1
        break
      case "End":
        nextValue = max
        break
      default:
        return
    }

    event.preventDefault()
    onChange?.(nextValue)
    starRefs.current[nextValue - 1]?.focus()
  }

  return (
    <div
      data-slot="star-rating"
      // 非インタラクティブ時は role="img" にして aria-label（合計評価の要約）を
      // 単一のまとまりとして読み上げさせる（axe: aria-prohibited-attr 対策。
      // role なし div への aria-label は無効）。
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? label : valueLabel(value, max)}
      className={cn("inline-flex items-center gap-1", className)}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1
        const filled = display >= starValue
        const half = !filled && display >= starValue - 0.5
        const starClassName = cn(
          "transition-colors text-[var(--Brand-Primary)]",
          STAR_SIZE[size],
          !interactive && "cursor-default pointer-events-none",
          !filled && !half && "text-[var(--Border-Medium-Emphasis)]"
        )

        // 非インタラクティブ時は各星が装飾の一部（合計は親の role="img" +
        // aria-label で読み上げ済み）。<button disabled> にすると
        // button-name 違反（accessible name 無し）になるため span + aria-hidden にする。
        if (!interactive) {
          return (
            <span key={i} aria-hidden="true" className={starClassName}>
              <StarIcon filled={filled} half={half} className="size-full" />
            </span>
          )
        }

        return (
          <Button
            key={i}
            ref={(node) => {
              starRefs.current[i] = node
            }}
            type="button"
            variant="ghost"
            size="icon-xl"
            role="radio"
            aria-checked={value === starValue}
            aria-label={starLabel(starValue)}
            tabIndex={starValue === selectedValue ? 0 : -1}
            onClick={() => {
              const clearing = allowClear && value === starValue
              // クリア時は hover プレビューも消す。残すとポインタ/タッチ端末で
              // display = hovered ?? value のまま星が塗られて見え、クリアの
              // 視覚フィードバックが出ない。
              if (clearing) setHovered(null)
              onChange?.(clearing ? 0 : starValue)
            }}
            onKeyDown={(event) => selectByKeyboard(event, starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "shrink-0 text-[var(--Brand-Primary)]",
              !filled && !half && "text-[var(--Border-Medium-Emphasis)]",
            )}
          >
            <StarIcon
              filled={filled}
              half={half}
              className={STAR_SIZE[size]}
            />
          </Button>
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
