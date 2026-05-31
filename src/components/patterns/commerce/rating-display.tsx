import * as React from "react"
import { cn } from "@/lib/utils"

interface RatingDisplayProps extends React.ComponentProps<"div"> {
  /** 評価値（0〜5） */
  rating: number
  /** レビュー件数 */
  reviewCount?: number
  /** 表示サイズ */
  size?: "sm" | "md" | "lg"
  /** レビュー件数を表示するか */
  showCount?: boolean
  /** 評価値を数値で表示するか */
  showValue?: boolean
}

/** 標準の5角星アイコン */
function StarIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M8 1.3l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9L4.4 12.3l.7-4L2.2 5.5l4-.6L8 1.3z" />
    </svg>
  )
}

/** サイズごとのアイコン・テキストサイズ定義 */
const sizeMap = {
  sm: { icon: 12, val: "typo-label-sm", cnt: "typo-body-xs" },
  md: { icon: 14, val: "typo-label-md", cnt: "typo-body-sm" },
  lg: { icon: 18, val: "typo-label-lg", cnt: "typo-body-md" },
} as const

function RatingDisplay({ className, rating, reviewCount, size = "sm", showCount = true, showValue = true, ...props }: RatingDisplayProps) {
  /** 0〜5の範囲にクランプ */
  const clamped = Math.max(0, Math.min(5, rating))
  const { icon, val, cnt } = sizeMap[size]

  return (
    <div data-slot="rating-display" className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`評価 ${clamped.toFixed(1)} / 5${reviewCount != null ? ` (${reviewCount}件)` : ""}`} {...props}>
      {/* 星アイコン */}
      <StarIcon size={icon} className="text-[var(--Object-High-Emphasis)]" />
      {/* 評価値 */}
      {showValue && <span className={cn("text-[var(--Text-High-Emphasis)]", val)}>{clamped.toFixed(2)}</span>}
      {/* レビュー件数 */}
      {showCount && reviewCount != null && <span className={cn("text-[var(--Text-Low-Emphasis)]", cnt)}>({reviewCount.toLocaleString("ja-JP")})</span>}
    </div>
  )
}

export { RatingDisplay }
