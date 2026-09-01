import * as React from "react"
import { createPortal } from "react-dom"
import { CoachMark, type CoachMarkVariant } from "../ui/coach-mark"
import { cn } from "@/lib/utils"
import { useFocusTrap } from "@/lib/use-focus-trap"

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
  /**
   * 表示文言。i18n はアプリ側で解決して string で渡す（issue #477）。
   * 未指定キーは既定値（日本語 + aria-label は英語）を使う。
   */
  labels?: {
    /** 次へボタン（既定 "次へ →"）。矢印は文言に含まれるため、渡すと矢印も置き換わる */
    next?: string
    /** 最終ステップの次へボタン（未指定なら next にフォールバック） */
    done?: string
    /** スキップボタン（既定 "スキップ"） */
    skip?: string
    /** overlay の aria-label（既定 "Onboarding coach mark"） */
    ariaLabel?: string
  }
  /**
   * 表示時に最初の操作子（スキップ/次へ）へフォーカスを移すか（既定 true）。
   * ref を渡すとその要素へ移す。false で自動フォーカスしない（#504）。
   *
   * この面は `aria-modal="true"` を名乗るため、既定では Tab / Shift+Tab を
   * 面の中に閉じ込める（背面のボタンへ抜けない）。
   */
  autoFocus?: boolean | React.RefObject<HTMLElement | null>
  /** 閉じたあと、開く前のフォーカス位置へ戻すか（既定 true。#504）。 */
  restoreFocusOnClose?: boolean
  /**
   * Escape で終了できるようにするか（既定 true。#504）。
   * 押されたときは `onSkip`（未指定なら `onComplete`）を呼ぶ
   * ＝「ツアーを離脱する」扱いで、次のステップへは進めない。
   */
  closeOnEsc?: boolean
}

const DEFAULT_LABELS = {
  next: "次へ →",
  skip: "スキップ",
  ariaLabel: "Onboarding coach mark",
} as const

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
 *
 * ボタン文言・aria-label は labels prop で上書きできる（i18n はアプリ側で解決して渡す）:
 * ```tsx
 * <CoachMarkOverlay
 *   labels={{
 *     next: t("coach.next"),      // "Next →"
 *     done: t("coach.done"),      // 最終ステップだけ "Done"
 *     skip: t("coach.skip"),      // "Skip"
 *     ariaLabel: t("coach.aria_label"),
 *   }}
 *   ...
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
  labels,
  autoFocus = true,
  restoreFocusOnClose = true,
  closeOnEsc = true,
}: CoachMarkOverlayProps) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels }
  const [idx, setIdx] = React.useState(0)
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  // #504: aria-modal="true" を名乗る以上、Tab は面の中に閉じ込める。
  // 操作子（スキップ/次へ）は CoachMark が Portal で外に描画するので、
  // overlay のルートだけでは掴めない。バルーンの実体も併せてトラップ対象にする。
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [balloonNode, setBalloonNode] = React.useState<HTMLElement | null>(null)
  const trapContainers = React.useMemo(
    () => [rootRef, balloonNode],
    [balloonNode]
  )
  const handleEscape = React.useCallback(() => {
    // ツアーの離脱。onSkip が無いアプリでは完了扱いにする（開いたままにしない）。
    if (onSkip) onSkip()
    else onComplete()
  }, [onSkip, onComplete])
  useFocusTrap({
    active: open,
    containers: trapContainers,
    autoFocus,
    restoreFocusOnClose,
    onEscape: closeOnEsc ? handleEscape : undefined,
  })
  const mounted = React.useSyncExternalStore(
    React.useCallback(() => () => {}, []),
    React.useCallback(() => true, []),
    React.useCallback(() => false, []),
  )

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
        // boxShadow で周囲を暗くするスポットライトが scrim を兼ねる。
        // Dialog / Sheet の上にオンボーディングを重ねることがあるため、
        // Modal より上の専用段に置く（下だとモーダルが暗転しない）。
        zIndex: "var(--Z-Coachmark-Overlay)",
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        width: 1,
        height: 1,
        pointerEvents: "none",
        zIndex: "var(--Z-Coachmark-Overlay)",
      }

  return createPortal(
    <div
      ref={rootRef}
      data-slot="coach-mark-overlay"
      data-step={idx + 1}
      data-total={steps.length}
      role="dialog"
      aria-modal="true"
      aria-label={resolvedLabels.ariaLabel}
    >
      {/* spotlight が無いとき (対象要素未発見) のフォールバック overlay */}
      {!hasSpotlight && (
        <div
          className="fixed inset-0 bg-black/55 z-[var(--Z-Coachmark-Overlay)] pointer-events-none"
          aria-hidden="true"
        />
      )}
      <div style={targetStyle} />
      <CoachMark
        content={
          <div className={cn("max-w-xs")} style={{ maxWidth }}>
            <p className="typo-label-md text-[var(--Text-on-Inverse)] mb-1">{step.title}</p>
            <p className="typo-body-sm text-[var(--Text-on-Inverse)] whitespace-pre-line">
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
        nextLabel={isLast ? (resolvedLabels.done ?? resolvedLabels.next) : resolvedLabels.next}
        skipLabel={resolvedLabels.skip}
        ariaLabel={resolvedLabels.ariaLabel}
        showClose={!!onSkip}
        onClose={onSkip}
        contentRef={setBalloonNode}
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
