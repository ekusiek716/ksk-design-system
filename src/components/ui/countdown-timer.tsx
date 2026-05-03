import * as React from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  /** カウントダウン先の日時 */
  targetDate: Date
  /** 表示前テキスト（開始前） */
  beforeLabel?: string
  /** ラベルテキスト（カウント中） */
  label?: string
  /** 終了時テキスト */
  endedLabel?: string
  variant?: "filled" | "ghost"
  /** 時間を非表示にして 分:秒 のみ表示 */
  compact?: boolean
  className?: string
  onEnd?: () => void
  /** 時間単位ラベル。i18n 対応: 英語では "h" を渡す。@default "時間" */
  hourUnit?: string
  /** 分単位ラベル。i18n 対応: 英語では "m" を渡す。@default "分" */
  minuteUnit?: string
  /** 秒単位ラベル。i18n 対応: 英語では "s" を渡す。@default "秒" */
  secondUnit?: string
}

type State = "before" | "active" | "ended"

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function calcRemaining(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now())
  const totalSec = Math.floor(diff / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return { h, m, s, totalSec }
}

function CountdownTimer({
  targetDate,
  beforeLabel,
  label = "残り",
  endedLabel = "受付終了",
  variant = "filled",
  compact = false,
  className,
  onEnd,
  hourUnit = "時間",
  minuteUnit = "分",
  secondUnit = "秒",
}: CountdownTimerProps) {
  const [remaining, setRemaining] = React.useState(() => calcRemaining(targetDate))
  const [state, setState] = React.useState<State>(() => {
    const now = Date.now()
    const start = targetDate.getTime() - (beforeLabel ? 0 : 0)
    if (now >= targetDate.getTime()) return "ended"
    return "active"
  })
  const endedRef = React.useRef(false)

  React.useEffect(() => {
    endedRef.current = false
    const tick = () => {
      const r = calcRemaining(targetDate)
      setRemaining(r)
      if (r.totalSec === 0 && !endedRef.current) {
        endedRef.current = true
        setState("ended")
        onEnd?.()
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate, onEnd])

  if (state === "ended") {
    return (
      <span
        data-slot="countdown-timer"
        data-state="ended"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg",
          "bg-[var(--Surface-Tertiary)] text-[var(--Text-Low-Emphasis)]",
          "typo-label-sm",
          className
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 4v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {endedLabel}
      </span>
    )
  }

  const { h, m, s } = remaining

  const segments = compact
    ? [{ num: pad(m), unit: minuteUnit }, { num: pad(s), unit: secondUnit }]
    : [
        ...(h > 0 ? [{ num: pad(h), unit: hourUnit }] : []),
        { num: pad(m), unit: minuteUnit },
        { num: pad(s), unit: secondUnit },
      ]

  const isFilled = variant === "filled"

  return (
    <span
      data-slot="countdown-timer"
      data-state="active"
      data-variant={variant}
      aria-live="off"
      aria-label={`${label} ${h}${hourUnit}${m}${minuteUnit}${s}${secondUnit}`}
      className={cn(
        "inline-flex items-center gap-1 px-3 py-2 rounded-lg font-variant-nums",
        isFilled
          ? "bg-[var(--Brand-Primary)] text-white"
          : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]",
        className
      )}
    >
      {label && (
        <span className="text-[11px] font-semibold opacity-80 mr-1">{label}</span>
      )}
      {segments.map((seg, i) => (
        <React.Fragment key={seg.unit}>
          {i > 0 && (
            <span className="text-[18px] font-bold opacity-70 mb-1.5">:</span>
          )}
          <span className="flex flex-col items-center gap-0">
            <span className="text-[22px] font-black leading-none tabular-nums">{seg.num}</span>
            <span className="text-[9px] font-semibold opacity-70 leading-none mt-0.5">{seg.unit}</span>
          </span>
        </React.Fragment>
      ))}
    </span>
  )
}

export { CountdownTimer }
export type { CountdownTimerProps }
