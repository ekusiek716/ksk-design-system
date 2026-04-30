import * as React from "react"
import { cn } from "@/lib/utils"

const SIZE_MAP = {
  sm: { size: 32, stroke: 3 },
  md: { size: 48, stroke: 4 },
  lg: { size: 64, stroke: 5 },
  xl: { size: 96, stroke: 6 },
}

interface ProgressRingProps {
  /** 0〜100 */
  value: number
  size?: keyof typeof SIZE_MAP
  /** 中央テキスト（省略時は % 表示） */
  label?: React.ReactNode
  showLabel?: boolean
  className?: string
}

function ProgressRing({
  value,
  size = "md",
  label,
  showLabel = true,
  className,
}: ProgressRingProps) {
  const { size: px, stroke } = SIZE_MAP[size]
  const radius = (px - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, value))
  const dashOffset = circumference * (1 - clamped / 100)

  return (
    <div
      data-slot="progress-ring"
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: px, height: px }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={px} height={px} className="-rotate-90">
        {/* Track */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          stroke="var(--Border-Low-Emphasis)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          fill="none"
          stroke="var(--Brand-Primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      {showLabel && (
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            size === "sm" ? "typo-label-xs" : size === "md" ? "typo-label-sm" : "typo-label-md",
            "text-[var(--Text-High-Emphasis)] font-semibold"
          )}
        >
          {label ?? `${Math.round(clamped)}%`}
        </span>
      )}
    </div>
  )
}

export { ProgressRing }
export type { ProgressRingProps }
