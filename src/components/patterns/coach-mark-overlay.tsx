import * as React from "react"
import { createPortal } from "react-dom"
import { CoachMark, type CoachMarkVariant } from "../ui/coach-mark"
import { cn } from "@/lib/utils"

export interface CoachStep {
  /** querySelector で要素を特定。要素が無ければ画面中央にフォールバック表示。 */
  selector: string
  title: string
  desc: string
  /** ツールチップ位置。auto = 下に余白があれば下、なければ上 */
  placement?: "auto" | "top" | "bottom" | "left" | "right"
  /** spotlight outline の余白 (px、既定 8) */
  padding?: number
}

export interface CoachMarkOverlayProps {
  steps: CoachStep[]
  open: boolean
  onComplete: () => void
  onSkip?: () => void
  /** CoachMark の見た目（default / brand） */
  variant?: CoachMarkVariant
  /** spotlight ring 色（CSS variable も可、既定 var(--Brand-Primary)） */
  ringColor?: string
  /** content の最大幅 (px、既定 280) */
  maxWidth?: number
}

const COACH_KEY_DEFAULT = "ksk-coach-done"
const COACH_VERSION_DEFAULT = "v1"

/**
 * CoachMarkOverlay — 初回ユーザー向けの多ステップ onboarding ツアー。
 *
 * DS の単発 `<CoachMark>` をベースに、selector で複数要素を順番に
 * spotlight + tooltip 表示するツアー orchestrator。
 *
 * 仕組み:
 * 1. 各 step の DOM 要素を querySelector で取得 → BoundingRect の位置に
 *    invisible target を fixed 配置し `<CoachMark>` をアタッチ
 * 2. spotlight 効果は `outline + box-shadow: 0 0 0 9999px rgba(0,0,0,0.55)`
 *    で対象だけを切り抜き表示
 * 3. ツールチップは auto placement（下に余白あれば下、なければ上）
 * 4. 要素が見つからない step は画面中央に dark overlay 付きで表示
 *
 * 完了状態の永続化は `isCoachCompleted` / `markCoachCompleted` を使う:
 * ```tsx
 * import { CoachMarkOverlay, isCoachCompleted, markCoachCompleted } from "ksk-design-system"
 *
 * const [open, setOpen] = useState(false)
 * useEffect(() => {
 *   if (!isCoachCompleted()) setOpen(true)
 * }, [])
 *
 * <CoachMarkOverlay
 *   open={open}
 *   steps={[
 *     { selector: 'header', title: 'ここに日付', desc: '...' },
 *     { selector: '.fab-fixed', title: 'クイック追加', desc: '...' },
 *   ]}
 *   onComplete={() => { markCoachCompleted(); setOpen(false) }}
 *   onSkip={() => { markCoachCompleted(); setOpen(false) }}
 * />
 * ```
 */
export function CoachMarkOverlay({
  steps,
  open,
  onComplete,
  onSkip,
  variant = "default",
  ringColor = "var(--Brand-Primary)",
  maxWidth = 280,
}: CoachMarkOverlayProps) {
  const [idx, setIdx] = React.useState(0)
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const step = steps[idx]
    if (!step) return
    const update = () => {
      const el = document.querySelector(step.selector)
      setRect(el ? el.getBoundingClientRect() : null)
    }
    // 対象要素が画面外にあると spotlight が見えず進行不能になるため、
    // step 切替時に画面中央へスクロールしてから測定する。
    // behavior: "smooth" は scroll listener との競合で発火しないケースが
    // あったため、確実に位置決めできる "instant" を使用。
    const el = document.querySelector(step.selector)
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior })
    }
    update()
    // 要素が遅延描画される場合に備えて 1 回追従
    const t1 = setTimeout(update, 100)
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      clearTimeout(t1)
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [idx, open, steps])

  if (!open || !steps[idx] || !mounted) return null
  if (typeof document === "undefined") return null

  const step = steps[idx]
  const isLast = idx === steps.length - 1
  const padding = step.padding ?? 8

  // auto placement: 下に余白があれば下、なければ上
  const resolvedPlacement: "top" | "bottom" | "left" | "right" = (() => {
    if (step.placement && step.placement !== "auto") return step.placement
    if (rect && typeof window !== "undefined") {
      const spaceBottom = window.innerHeight - rect.bottom
      return spaceBottom > 200 ? "bottom" : "top"
    }
    return "bottom"
  })()

  const handleNext = () => {
    if (isLast) onComplete()
    else setIdx(idx + 1)
  }

  const hasSpotlight = !!rect
  const targetStyle: React.CSSProperties = hasSpotlight && rect
    ? {
        position: "fixed",
        top: Math.max(0, rect.top - padding),
        left: Math.max(0, rect.left - padding),
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        pointerEvents: "none",
        outline: `2px solid ${ringColor}`,
        outlineOffset: 0,
        borderRadius: 16,
        boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
        zIndex: 50,
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        width: 1,
        height: 1,
        pointerEvents: "none",
        zIndex: 50,
      }

  return createPortal(
    <div
      data-slot="coach-mark-overlay"
      data-step={idx + 1}
      data-total={steps.length}
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding coach mark"
    >
      {/* spotlight が無いとき (対象要素未発見) のフォールバック overlay */}
      {!hasSpotlight && (
        <div
          className="fixed inset-0 bg-black/55 z-50 pointer-events-none"
          aria-hidden="true"
        />
      )}
      <div style={targetStyle} />
      <CoachMark
        content={
          <div className={cn("max-w-xs")} style={{ maxWidth }}>
            <p className="typo-label-md text-[var(--Text-on-Inverse)] mb-1">{step.title}</p>
            <p className="typo-body-sm text-[var(--Text-on-Inverse)] opacity-90 whitespace-pre-line">
              {step.desc}
            </p>
          </div>
        }
        placement={resolvedPlacement}
        variant={variant}
        open
        step={idx + 1}
        totalSteps={steps.length}
        onNext={handleNext}
        showClose={!!onSkip}
        onClose={onSkip}
        className="py-4! px-4!"
      >
        <span
          className="fixed pointer-events-none"
          style={
            hasSpotlight && rect
              ? { top: rect.top, left: rect.left + rect.width / 2, width: 1, height: 1 }
              : { top: "50%", left: "50%" }
          }
          aria-hidden="true"
        />
      </CoachMark>
    </div>,
    document.body,
  )
}

/**
 * Onboarding 完了状態を localStorage で管理するヘルパー。
 * 複数アプリで使う際は keys を別にできるよう引数化可能。
 */

export function isCoachCompleted(key: string = COACH_KEY_DEFAULT, version: string = COACH_VERSION_DEFAULT): boolean {
  if (typeof window === "undefined") return true
  try {
    return localStorage.getItem(key) === version
  } catch {
    return true
  }
}

export function markCoachCompleted(key: string = COACH_KEY_DEFAULT, version: string = COACH_VERSION_DEFAULT): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, version)
  } catch {
    /* ignore */
  }
}

export function resetCoach(key: string = COACH_KEY_DEFAULT): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
