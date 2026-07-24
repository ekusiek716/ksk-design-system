import * as React from "react"
import { cn } from "@/lib/utils"

type Granularity = "day" | "hour" | "minute" | "second"

interface CountdownTimerProps {
  /** カウントダウン先の日時 */
  targetDate: Date
  /**
   * 表示粒度（既定 "second"）。
   * - "day"   : 日のみ表示 (結婚式 / 旅行 / 出産予定日まで N 日)。1日1回ペースで再計算。
   * - "hour"  : 時間まで (1分ごとに再計算)
   * - "minute": 分まで (秒ごとに再計算)
   * - "second": 秒まで (旧デフォルト、競技的カウントダウン)
   */
  granularity?: Granularity
  /** ラベルテキスト（カウント中、既定 "残り"） */
  label?: string
  /** 終了時テキスト（既定 "受付終了"） */
  endedLabel?: string
  /** 当日 (残り 0 日) 時のテキスト。granularity="day" で使用（既定 "本日"） */
  todayLabel?: string
  variant?: "filled" | "ghost"
  /** [hh:mm:ss モードのみ] 時間を非表示にして 分:秒 のみ表示 */
  compact?: boolean
  className?: string
  onEnd?: () => void
  /** 日単位ラベル。granularity="day" で使用。@default "日" */
  dayUnit?: string
  /** 時間単位ラベル。@default "時間" */
  hourUnit?: string
  /** 分単位ラベル。@default "分" */
  minuteUnit?: string
  /** 秒単位ラベル。@default "秒" */
  secondUnit?: string
}

type State = "active" | "today" | "ended"

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

/** 残日数。今日が 0、明日が 1。負の値は終了。 */
function calcDaysLeft(target: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const t = new Date(target)
  t.setHours(0, 0, 0, 0)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((t.getTime() - today.getTime()) / msPerDay)
}

function DayCountdown({
  targetDate,
  label = "残り",
  endedLabel = "受付終了",
  todayLabel = "本日",
  variant = "filled",
  className,
  onEnd,
  dayUnit = "日",
}: CountdownTimerProps) {
  const [now, setNow] = React.useState(() => Date.now())
  const daysLeft = React.useMemo(() => {
    void now
    return calcDaysLeft(targetDate)
  }, [now, targetDate])
  React.useEffect(() => {
    // 翌日 0:00 で再計算 (シンプルに 1 時間ごと polling で済ませる)
    const id = setInterval(() => setNow(Date.now()), 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  React.useEffect(() => {
    if (daysLeft < 0) onEnd?.()
  }, [daysLeft, onEnd])

  if (daysLeft < 0) {
    return (
      <span
        data-slot="countdown-timer"
        data-granularity="day"
        data-state="ended"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg",
          "bg-[var(--Surface-Tertiary)] text-[var(--Text-Low-Emphasis)]",
          "typo-label-sm",
          className,
        )}
      >
        {endedLabel}
      </span>
    )
  }

  if (daysLeft === 0) {
    return (
      <span
        data-slot="countdown-timer"
        data-granularity="day"
        data-state="today"
        className={cn(
          "inline-flex items-center gap-1 px-3 py-2 rounded-lg font-variant-nums",
          variant === "filled"
            ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
            : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]",
          className,
        )}
      >
        <span className="typo-heading-xl leading-none">{todayLabel}</span>
      </span>
    )
  }

  return (
    <span
      data-slot="countdown-timer"
      data-granularity="day"
      data-state="active"
      data-variant={variant}
      aria-label={`${label} ${daysLeft}${dayUnit}`}
      className={cn(
        "inline-flex items-baseline gap-1 px-3 py-2 rounded-lg font-variant-nums",
        variant === "filled"
          ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
          : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]",
        className,
      )}
    >
      {label && <span className="typo-caption opacity-80 mr-1">{label}</span>}
      <span className="typo-heading-3xl leading-none tabular-nums">{daysLeft}</span>
      <span className="typo-label-sm opacity-80">{dayUnit}</span>
    </span>
  )
}

function TimeCountdown({
  targetDate,
  granularity = "second",
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
  const [state, setState] = React.useState<State>(() =>
    Date.now() >= targetDate.getTime() ? "ended" : "active",
  )
  const endedRef = React.useRef(false)

  const tickInterval = granularity === "hour" ? 60 * 1000 : granularity === "minute" ? 1000 : 1000

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
    const id = setInterval(tick, tickInterval)
    return () => clearInterval(id)
  }, [targetDate, onEnd, tickInterval])

  if (state === "ended") {
    return (
      <span
        data-slot="countdown-timer"
        data-granularity={granularity}
        data-state="ended"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg",
          "bg-[var(--Surface-Tertiary)] text-[var(--Text-Low-Emphasis)]",
          "typo-label-sm",
          className,
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

  const segments = (() => {
    if (granularity === "hour") {
      return [{ num: pad(h), unit: hourUnit }, { num: pad(m), unit: minuteUnit }]
    }
    if (granularity === "minute") {
      return [
        ...(h > 0 ? [{ num: pad(h), unit: hourUnit }] : []),
        { num: pad(m), unit: minuteUnit },
      ]
    }
    // second (default)
    return compact
      ? [{ num: pad(m), unit: minuteUnit }, { num: pad(s), unit: secondUnit }]
      : [
          ...(h > 0 ? [{ num: pad(h), unit: hourUnit }] : []),
          { num: pad(m), unit: minuteUnit },
          { num: pad(s), unit: secondUnit },
        ]
  })()

  const isFilled = variant === "filled"

  return (
    <span
      data-slot="countdown-timer"
      data-granularity={granularity}
      data-state="active"
      data-variant={variant}
      aria-live="off"
      aria-label={`${label} ${h}${hourUnit}${m}${minuteUnit}${s}${secondUnit}`}
      className={cn(
        "inline-flex items-center gap-1 px-3 py-2 rounded-lg font-variant-nums",
        isFilled
          ? "bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)]"
          : "border-2 border-[var(--Brand-Primary)] text-[var(--Brand-Primary)]",
        className,
      )}
    >
      {label && (
        <span className="typo-caption opacity-80 mr-1">{label}</span>
      )}
      {segments.map((seg, i) => (
        <React.Fragment key={seg.unit}>
          {i > 0 && (
            <span className="typo-heading-lg opacity-70 mb-1.5">:</span>
          )}
          <span className="flex flex-col items-center gap-0">
            <span className="typo-heading-xl leading-none tabular-nums">{seg.num}</span>
            <span className="typo-body-xs opacity-70 leading-none mt-0.5">{seg.unit}</span>
          </span>
        </React.Fragment>
      ))}
    </span>
  )
}

/**
 * CountdownTimer — granularity に応じて day / time モードを描画。
 * 各モードを別コンポーネントに分け、hooks を常に同じ順序で呼ぶ（Rules of Hooks 準拠）。
 */
function CountdownTimer(props: CountdownTimerProps) {
  if (props.granularity === "day") {
    return <DayCountdown {...props} />
  }
  return <TimeCountdown {...props} />
}

export { CountdownTimer }
export type { CountdownTimerProps }
