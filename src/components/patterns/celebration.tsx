import * as React from "react"
import { cn } from "@/lib/utils"

type CelebrationTrigger = "confetti" | "emoji" | "both" | "none"
type CelebrationPlacement = "overlay" | "inline"
/**
 * confetti の演出モード。
 * - "fall"（既定）: 上から降ってくる既存挙動（後方互換）
 * - "burst": 中央から全方位（360°）に放射状に弾ける party popper（クラッカー）演出
 */
type CelebrationEffect = "fall" | "burst"

interface CelebrationProps extends React.ComponentProps<"div"> {
  active?: boolean
  trigger?: CelebrationTrigger
  placement?: CelebrationPlacement
  /**
   * confetti の演出モード。"fall"（既定・後方互換）または "burst"（クラッカー演出）。
   */
  effect?: CelebrationEffect
  emoji?: string
  title?: string
  description?: string
  actions?: React.ReactNode
  interactive?: boolean
  cardless?: boolean
  particleCount?: number
  durationMs?: number
  /**
   * confetti 1 粒あたりのアニメーション時間（ms）。未指定時は
   * effect="fall" では durationMs（autoDismissMs 優先）から算出される既存挙動を維持し、
   * effect="burst" では 900〜1400ms 程度（seededRatio でばらつき）を既定値とする。
   * 指定時はその値を基準にばらつき（0.78〜1.22倍）をかける。
   */
  duration?: number
  /**
   * confetti カラーパレット。CSS 変数文字列（"var(--...)"）推奨。
   * 未指定時は既定の DS セマンティックカラー 5 色を使用（後方互換）。
   */
  colors?: string[]
  /**
   * confetti の左右ドリフト幅（px）。粒ごとに ±driftRange/2 の範囲でランダム化。
   * 未指定時は既定の 160px を維持する。
   * effect="burst" では飛距離（120〜280px 基準）のばらつき幅としても再利用する
   * （driftRange が大きいほど burst の飛距離ばらつきが大きくなる）。
   */
  driftRange?: number
  /**
   * emoji 表示アニメーション。
   * - "pop"（既定）: 既存の celebration-pop と同時にフェード＋スケールインする控えめな挙動
   * - "bounce": emoji のみに弾むイージング（0→1.4→0.9→1 のスケール）を追加で適用
   */
  emojiAnimation?: "pop" | "bounce"
  autoDismissMs?: number
  onTapDismiss?: () => void
  onDone?: () => void
}

const CONFETTI_COLORS = [
  "var(--Brand-Primary)",
  "var(--Object-Success)",
  "var(--Object-Warning)",
  "var(--Object-Caution)",
  "var(--Object-Info)",
]

function seededRatio(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return reduced
}

const BURST_DURATION_MS = 1150
// 0°〜360° 全方位。中央発生源から均等に放射状へ飛び散らせる。
const BURST_ANGLE_MIN_DEG = 0
const BURST_ANGLE_MAX_DEG = 360
const BURST_DISTANCE_MIN = 120
const BURST_DISTANCE_MAX = 280
// 全方位のため重力 droop は控えめ（上方向コーンのように大きく下に垂らすと
// 上向きに飛んだ粒子だけ不自然に軌道が曲がって見えるため）。
const BURST_GRAVITY_DROOP_MIN = 12
const BURST_GRAVITY_DROOP_MAX = 28

function Celebration({
  active = true,
  trigger = "confetti",
  placement = "overlay",
  effect = "fall",
  emoji = "🎉",
  title,
  description,
  actions,
  interactive = false,
  cardless = false,
  particleCount = 36,
  durationMs = 2600,
  duration,
  colors,
  driftRange = 160,
  emojiAnimation = "pop",
  autoDismissMs,
  onTapDismiss,
  onDone,
  className,
  ...props
}: CelebrationProps) {
  const reducedMotion = usePrefersReducedMotion()
  const resolvedDurationMs = autoDismissMs ?? durationMs
  const isBurst = effect === "burst"
  const particleDurationBase = duration ?? (isBurst ? BURST_DURATION_MS : resolvedDurationMs)
  const palette = colors && colors.length > 0 ? colors : CONFETTI_COLORS
  const particles = React.useMemo(
    () => Array.from({ length: particleCount }, (_, index) => {
      const base = {
        id: index,
        delay: isBurst
          ? Math.round(seededRatio(index + 11) * 80)
          : Math.round(seededRatio(index + 11) * 420),
        duration: Math.round(particleDurationBase * (0.78 + seededRatio(index + 21) * 0.44)),
        rotate: Math.round(seededRatio(index + 41) * 720),
        size: 6 + Math.round(seededRatio(index + 51) * 6),
        color: palette[index % palette.length],
      }

      if (isBurst) {
        const angleDeg =
          BURST_ANGLE_MIN_DEG + seededRatio(index + 61) * (BURST_ANGLE_MAX_DEG - BURST_ANGLE_MIN_DEG)
        const angleRad = (angleDeg * Math.PI) / 180
        const distanceJitter = (seededRatio(index + 31) - 0.5) * driftRange
        const distance = Math.max(
          40,
          BURST_DISTANCE_MIN +
            seededRatio(index + 71) * (BURST_DISTANCE_MAX - BURST_DISTANCE_MIN) +
            distanceJitter,
        )
        const droop =
          BURST_GRAVITY_DROOP_MIN + seededRatio(index + 81) * (BURST_GRAVITY_DROOP_MAX - BURST_GRAVITY_DROOP_MIN)
        const finalX = Math.round(Math.cos(angleRad) * distance)
        const finalY = Math.round(Math.sin(angleRad) * distance + droop)
        return {
          ...base,
          left: 0,
          drift: 0,
          finalX,
          finalY,
          midX: Math.round(finalX * 0.85),
          midY: Math.round(Math.sin(angleRad) * distance * 0.85),
        }
      }

      return {
        ...base,
        left: Math.round(seededRatio(index + 1) * 100),
        drift: Math.round((seededRatio(index + 31) - 0.5) * driftRange),
        finalX: 0,
        finalY: 0,
        midX: 0,
        midY: 0,
      }
    }),
    [particleCount, particleDurationBase, driftRange, palette, isBurst],
  )

  React.useEffect(() => {
    if (!active || !onDone) return
    const id = window.setTimeout(onDone, resolvedDurationMs)
    return () => window.clearTimeout(id)
  }, [active, onDone, resolvedDurationMs])

  if (!active || trigger === "none") return null

  const showConfetti = !reducedMotion && (trigger === "confetti" || trigger === "both")
  const showMessage = !cardless && (trigger === "confetti" || trigger === "emoji" || trigger === "both")
  const canTapDismiss = Boolean(onTapDismiss || interactive)
  const accessibleText = [title ?? "達成しました", description].filter(Boolean).join(" ")
  const handleTapDismiss = () => {
    if (onTapDismiss) {
      onTapDismiss()
      return
    }
    if (interactive) onDone?.()
  }

  return (
    <div
      data-slot="celebration"
      data-trigger={trigger}
      data-placement={placement}
      data-reduced-motion={reducedMotion || undefined}
      data-cardless={cardless || undefined}
      role="status"
      aria-live="polite"
      aria-label={accessibleText}
      className={cn(
        placement === "overlay"
          ? "pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          : "relative flex items-center justify-center",
        className,
      )}
      {...props}
    >
      {canTapDismiss && (
        <button
          type="button"
          aria-label="閉じる"
          className="pointer-events-auto absolute inset-0 cursor-pointer"
          onClick={handleTapDismiss}
        />
      )}

      {showConfetti && (
        // confetti の飛散だけをクリップする。ルート要素側で overflow-hidden に
        // すると placement="inline" のカード drop shadow（shadow-dialog）が
        // 欠けてしまうため、クリップはこのレイヤーに閉じ込める。
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {particles.map((piece) =>
            isBurst ? (
              <span
                key={piece.id}
                className="absolute left-1/2 top-1/2 rounded-sm opacity-0"
                style={{
                  width: piece.size,
                  height: Math.max(4, piece.size - 2),
                  backgroundColor: piece.color,
                  animation: `celebration-confetti-burst ${piece.duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${piece.delay}ms forwards`,
                  "--celebration-burst-x": `${piece.finalX}px`,
                  "--celebration-burst-y": `${piece.finalY}px`,
                  "--celebration-burst-mid-x": `${piece.midX}px`,
                  "--celebration-burst-mid-y": `${piece.midY}px`,
                  "--celebration-rotate": `${piece.rotate}deg`,
                } as React.CSSProperties}
              />
            ) : (
              <span
                key={piece.id}
                className="absolute top-0 rounded-sm opacity-0"
                style={{
                  left: `${piece.left}%`,
                  width: piece.size,
                  height: Math.max(4, piece.size - 2),
                  backgroundColor: piece.color,
                  animation: `celebration-confetti-fall ${piece.duration}ms ease-in ${piece.delay}ms forwards`,
                  "--celebration-drift": `${piece.drift}px`,
                  "--celebration-rotate": `${piece.rotate}deg`,
                } as React.CSSProperties}
              />
            )
          )}
        </div>
      )}

      {showMessage && (
        <div
          onClick={canTapDismiss ? handleTapDismiss : undefined}
          className={cn(
            "pointer-events-auto relative z-[1] mx-4 flex max-w-sm flex-col items-center rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-6 py-5 text-center shadow-[var(--shadow-dialog)]",
            !reducedMotion && "animate-[celebration-pop_360ms_cubic-bezier(0.34,1.56,0.64,1)_both]",
            canTapDismiss && "cursor-pointer",
          )}
        >
          {emoji && (
            <span
              className={cn(
                "typo-display-lg mb-3 leading-none",
                !reducedMotion &&
                  emojiAnimation === "bounce" &&
                  "animate-[celebration-emoji-pop_600ms_ease-out_200ms_both]",
              )}
              aria-hidden="true"
            >
              {emoji}
            </span>
          )}
          {title && (
            <p className="typo-heading-md text-[var(--Text-High-Emphasis)]">
              {title}
            </p>
          )}
          {description && (
            <p className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">
              {description}
            </p>
          )}
          {actions && (
            <div
              className="mt-4 flex flex-wrap justify-center gap-2"
              onClick={(event) => event.stopPropagation()}
            >
              {actions}
            </div>
          )}
        </div>
      )}
      {cardless && <span className="sr-only">{accessibleText}</span>}
    </div>
  )
}

export { Celebration }
export type { CelebrationProps, CelebrationTrigger, CelebrationPlacement, CelebrationEffect }
