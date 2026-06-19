import * as React from "react"
import { cn } from "@/lib/utils"

type CelebrationTrigger = "confetti" | "emoji" | "both" | "none"
type CelebrationPlacement = "overlay" | "inline"

interface CelebrationProps extends React.ComponentProps<"div"> {
  active?: boolean
  trigger?: CelebrationTrigger
  placement?: CelebrationPlacement
  emoji?: string
  title?: string
  description?: string
  particleCount?: number
  durationMs?: number
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

function usePrefersReducedMotion() {
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

function Celebration({
  active = true,
  trigger = "confetti",
  placement = "overlay",
  emoji = "🎉",
  title,
  description,
  particleCount = 36,
  durationMs = 2600,
  onDone,
  className,
  ...props
}: CelebrationProps) {
  const reducedMotion = usePrefersReducedMotion()
  const particles = React.useMemo(
    () => Array.from({ length: particleCount }, (_, index) => ({
      id: index,
      left: Math.round(seededRatio(index + 1) * 100),
      delay: Math.round(seededRatio(index + 11) * 420),
      duration: Math.round(durationMs * (0.78 + seededRatio(index + 21) * 0.44)),
      drift: Math.round((seededRatio(index + 31) - 0.5) * 160),
      rotate: Math.round(seededRatio(index + 41) * 720),
      size: 6 + Math.round(seededRatio(index + 51) * 6),
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    })),
    [durationMs, particleCount],
  )

  React.useEffect(() => {
    if (!active || !onDone) return
    const id = window.setTimeout(onDone, durationMs)
    return () => window.clearTimeout(id)
  }, [active, durationMs, onDone])

  if (!active || trigger === "none") return null

  const showConfetti = !reducedMotion && (trigger === "confetti" || trigger === "both")
  const showMessage = trigger === "confetti" || trigger === "emoji" || trigger === "both"

  return (
    <div
      data-slot="celebration"
      data-trigger={trigger}
      data-placement={placement}
      data-reduced-motion={reducedMotion || undefined}
      role="status"
      aria-live="polite"
      aria-label={title ?? "達成しました"}
      className={cn(
        placement === "overlay"
          ? "pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          : "relative flex items-center justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      {showConfetti && (
        <div className="absolute inset-0" aria-hidden="true">
          {particles.map((piece) => (
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
          ))}
        </div>
      )}

      {showMessage && (
        <div
          className={cn(
            "pointer-events-auto mx-4 flex max-w-sm flex-col items-center rounded-2xl border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-6 py-5 text-center shadow-[var(--shadow-dialog)]",
            !reducedMotion && "animate-[celebration-pop_360ms_cubic-bezier(0.34,1.56,0.64,1)_both]",
          )}
        >
          {emoji && (
            <span className="mb-3 text-[32px] leading-none" aria-hidden="true">
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
        </div>
      )}
    </div>
  )
}

export { Celebration }
export type { CelebrationProps, CelebrationTrigger, CelebrationPlacement }
