import * as React from "react"
import { cn } from "@/lib/utils"

interface CountdownHeroProps {
  /**
   * カウントダウン先の日付。"YYYY-MM-DD" 形式の文字列はローカルタイムの日付として
   * 解釈する（`new Date("YYYY-MM-DD")` は UTC midnight 扱いになり、UTC より西の
   * タイムゾーンで 1 日ずれるため自前でパースする）。それ以外の文字列は `new Date()` に委譲。
   */
  targetDate: Date | string
  /** 残り日数の上に表示するラベル（既定 "残り"） */
  label?: string
  /** 当日（残り 0 日）時のラベル（既定 "本日"） */
  todayLabel?: string
  /** 経過後（残り日数が負）のラベル（既定 "経過"） */
  pastLabel?: string
  /** 日数の単位テキスト（既定 "days"、装飾セリフ書体で表示） */
  unit?: string
  /** 右上に敷く装飾イラストスロット。wedding 画像等は消費側で用意する */
  illustration?: React.ReactNode
  className?: string
}

/** date-only 文字列はローカル日付として、それ以外は Date コンストラクタで解釈する */
function parseTargetDate(target: Date | string): Date {
  if (target instanceof Date) return target
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(target)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return new Date(target)
}

function toLocalMidnight(d: Date) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/** 残日数。今日が 0、明日が 1、過去日はマイナス。ローカルタイムで計算する。 */
function calcDaysLeft(target: Date): number {
  const today = toLocalMidnight(new Date())
  const t = toLocalMidnight(target)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((t.getTime() - today.getTime()) / msPerDay)
}

/**
 * CountdownHero — 装飾的な serif 数字で目標日までの残日数を表示するヒーロー表示。
 *
 * belle-todo の CountdownSection（src/components/home/CountdownSection.tsx 8-90行）を
 * 参考に、日付編集フォーム・イラスト画像・i18n・zustand は持ち込まず表示専用に再設計。
 * イラストは `illustration` スロットで受け取る（wedding 画像はここに持ち込まない）。
 *
 * serif フォントは DS に `--font-display-serif` トークンが存在しないため、
 * `var(--font-display-serif, Georgia, "Noto Serif JP", serif)` の形で
 * 標準 serif 総称へのフォールバックを明示する。消費側でトークンを定義すれば
 * そのまま差し替わる。
 *
 * 日数計算はローカルタイム基準（`new Date()` の解釈に依存）。
 * 既存の `CountdownTimer`（残日数ピル表示）とは別物で、こちらは装飾ヒーロー表示専用。
 */
function CountdownHero({
  targetDate,
  label = "残り",
  todayLabel = "本日",
  pastLabel = "経過",
  unit = "days",
  illustration,
  className,
}: CountdownHeroProps) {
  const target = React.useMemo(() => parseTargetDate(targetDate), [targetDate])
  const daysLeft = calcDaysLeft(target)
  const isToday = daysLeft === 0
  const isPast = daysLeft < 0
  const daysAbs = Math.abs(daysLeft)
  const displayLabel = isToday ? todayLabel : isPast ? pastLabel : label
  const valueText = isToday ? "0" : String(daysAbs)
  const serifFont = "var(--font-display-serif, Georgia, 'Noto Serif JP', serif)"

  return (
    <div
      data-slot="countdown-hero"
      data-state={isToday ? "today" : isPast ? "past" : "active"}
      className={cn("relative", className)}
    >
      {illustration && (
        <div
          className="pointer-events-none absolute right-0 top-0 select-none"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 25%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%)",
          }}
          aria-hidden="true"
        >
          {illustration}
        </div>
      )}
      <div className="relative">
        <p className="typo-caption leading-none text-[var(--Text-Low-Emphasis)]">
          {displayLabel}
        </p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span
            className={cn(
              "tabular-nums leading-none text-[var(--Text-Accent-Primary)]",
              daysAbs >= 100 ? "text-7xl" : "text-8xl",
            )}
            style={{ fontFamily: serifFont, fontWeight: 400 }}
          >
            {valueText}
          </span>
          {!isToday && (
            <span
              className="text-2xl leading-none text-[var(--Text-Accent-Primary)]"
              style={{ fontFamily: serifFont, fontWeight: 400 }}
            >
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export { CountdownHero }
export type { CountdownHeroProps }
