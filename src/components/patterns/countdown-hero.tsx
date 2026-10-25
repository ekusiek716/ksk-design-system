import * as React from "react"
import { cn } from "@/lib/utils"
import { useKskLabels } from "../ui/ksk-labels"

interface CountdownHeroProps {
  /**
   * カウントダウン先の日付。"YYYY-MM-DD" 形式の文字列はローカルタイムの日付として
   * 解釈する（`new Date("YYYY-MM-DD")` は UTC midnight 扱いになり、UTC より西の
   * タイムゾーンで 1 日ずれるため自前でパースする）。それ以外の文字列は `new Date()` に委譲。
   */
  targetDate: Date | string
  /** 残り日数の上に表示するラベル。省略時は KskLabelsProvider の `countdownRemaining`（Provider 無しは "残り"） */
  label?: string
  /** 当日（残り 0 日）時のラベル。省略時は KskLabelsProvider の `countdownToday`（Provider 無しは "本日"） */
  todayLabel?: string
  /** 経過後（残り日数が負）のラベル。省略時は KskLabelsProvider の `countdownPast`（Provider 無しは "経過"。locale="en" で "Elapsed"） */
  pastLabel?: string
  /** 日数の単位テキスト（既定 "days"、装飾セリフ書体で表示） */
  unit?: string
  /**
   * 数字の下に表示する目標日そのもの（例 "2027.01.03 (日)"）。
   * 曜日・ロケール等のフォーマットは消費側の責務（DS はドメイン非依存を保つ）。
   * 未指定なら日付行を出さない。
   */
  dateLabel?: string
  /**
   * 当日（残り 0 日）に、数字 "0" の代わりに表示する値（例 "本日"）。
   * 指定時は単位（unit）も表示しない。未指定なら従来どおり "0 <unit>" 表示。
   */
  todayValue?: string
  /** 右上に敷く装飾イラストスロット。wedding 画像等は消費側で用意する */
  illustration?: React.ReactNode
  /**
   * 指定するとヒーロー全体が押せるボタンになる（issue #672。例: 日付の編集画面を開く）。
   * ヒーロー全面を覆う不可視の `<button>` を重ねる stretched link 構造で、Enter / Space で発火し、
   * DS 標準のフォーカスリングと押下表現（押している間だけ薄くなる）を持つ。
   * 呼び出し側で `<Button unstyled>` に包んだり `active:opacity-*` を足したりしない。
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  /** 指定するとヒーロー全体が遷移リンクになる（issue #672）。`onClick` と併用しない */
  href?: string
  /**
   * 押せるときのアクセシブルネーム（issue #672）。未指定ならヒーローに表示している文言
   * （ラベル・日数・単位・dateLabel）がそのまま名前になる。操作の意味を足したいとき
   * （「挙式日を編集」等）に指定する。
   */
  "aria-label"?: string
  /** 押せるときに操作を止める（issue #672） */
  disabled?: boolean
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
  label: labelProp,
  todayLabel: todayLabelProp,
  pastLabel: pastLabelProp,
  unit = "days",
  dateLabel,
  todayValue,
  illustration,
  onClick,
  href,
  "aria-label": ariaLabel,
  disabled = false,
  className,
}: CountdownHeroProps) {
  const defaultLabels = useKskLabels()
  const label = labelProp ?? defaultLabels.countdownRemaining
  const todayLabel = todayLabelProp ?? defaultLabels.countdownToday
  const pastLabel = pastLabelProp ?? defaultLabels.countdownPast
  const contentId = React.useId()
  const actionable = Boolean(onClick || href)
  const target = React.useMemo(() => parseTargetDate(targetDate), [targetDate])
  const daysLeft = calcDaysLeft(target)
  const isToday = daysLeft === 0
  const isPast = daysLeft < 0
  const daysAbs = Math.abs(daysLeft)
  const displayLabel = isToday ? todayLabel : isPast ? pastLabel : label
  // today 時は todayValue（指定時）を数字の代わりに表示。単位は従来どおり today では出さない。
  const valueText = isToday ? (todayValue ?? "0") : String(daysAbs)
  const serifFont = "var(--font-display-serif, Georgia, 'Noto Serif JP', serif)"

  return (
    <div
      data-slot="countdown-hero"
      data-state={isToday ? "today" : isPast ? "past" : "active"}
      data-interactive={actionable || undefined}
      className={cn(
        "relative",
        // 押下表現: ヒーロー全面を覆うボタンを押している間だけ薄くする（:active は祖先にも乗る）。
        actionable && !disabled &&
          "rounded-[var(--Radius-Surface)] transition-opacity duration-[var(--Motion-Duration-Fast)] ease-[var(--Motion-Easing-Standard)] active:opacity-70",
        actionable && disabled && "opacity-50",
        className,
      )}
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
      <div className="relative" id={actionable ? contentId : undefined}>
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
        {dateLabel && (
          <p className="mt-0.5 typo-caption tabular-nums text-[var(--Text-Low-Emphasis)]">
            {dateLabel}
          </p>
        )}
      </div>
      {actionable && <CountdownHeroAction
        href={href}
        onClick={onClick}
        disabled={disabled}
        ariaLabel={ariaLabel}
        labelledBy={contentId}
      />}
    </div>
  )
}

/**
 * ヒーロー全面を覆う不可視の a / button（stretched link・ThumbnailCard / ListItem と同じ構造）。
 * 中身の `<p>` / `<div>` を `<button>` の子にすると不正な HTML になるため、兄弟として重ねる。
 * 名前は aria-label（指定時）か、表示中の文言（aria-labelledby で本文を指す）。
 */
function CountdownHeroAction({
  href,
  onClick,
  disabled,
  ariaLabel,
  labelledBy,
}: {
  href?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled: boolean
  ariaLabel?: string
  labelledBy: string
}) {
  const className = cn(
    "absolute inset-0 z-[1] rounded-[var(--Radius-Surface)]",
    "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
    disabled ? "cursor-not-allowed" : "cursor-pointer",
  )
  const nameProps = ariaLabel ? { "aria-label": ariaLabel } : { "aria-labelledby": labelledBy }
  if (href) {
    return (
      <a
        href={href}
        data-slot="countdown-hero-action"
        {...nameProps}
        aria-disabled={disabled || undefined}
        className={className}
        onClick={(event) => {
          if (disabled) event.preventDefault()
        }}
      />
    )
  }
  return (
    <button
      type="button"
      data-slot="countdown-hero-action"
      {...nameProps}
      disabled={disabled}
      className={className}
      onClick={onClick}
    />
  )
}

export { CountdownHero }
export type { CountdownHeroProps }
