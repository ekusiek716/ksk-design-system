import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { usePortalContainer } from "./portal-container"
import { DescribedByLinker, useDescribedByLink } from "@/lib/described-by"
import {
  ModalStackRegistrar,
  modalContentZ,
  modalOverlayZ,
} from "@/lib/modal-stack"
import {
  TitleSurfaceScaleProvider,
  useTitleTypoClass,
  type TitleLevel,
} from "../../lib/title-level"

type LayerAutoFocusTarget = "first-input" | "title" | React.RefObject<HTMLElement | null> | false

function getFocusableTarget(container: HTMLElement, target: LayerAutoFocusTarget, titleSlot: string) {
  if (target === false) return null
  if (target === "title") {
    return container.querySelector<HTMLElement>(`[data-slot="${titleSlot}"]`)
  }
  if (target === "first-input") {
    return container.querySelector<HTMLElement>(
      [
        "input:not([disabled])",
        "textarea:not([disabled])",
        "select:not([disabled])",
        "button:not([disabled])",
        "[href]",
        "[tabindex]:not([tabindex='-1'])",
      ].join(", ")
    )
  }
  return target.current
}

function focusLayerTarget(container: HTMLElement | null, target: LayerAutoFocusTarget | undefined, titleSlot: string) {
  if (!container || target == null) return
  const el = getFocusableTarget(container, target, titleSlot)
  if (!el) return
  if (el.tabIndex < 0 && target === "title") {
    el.tabIndex = -1
  }
  el.focus()
}

function captureRestoreFocus(ref: React.RefObject<HTMLElement | null> | undefined) {
  if (!ref || ref.current != null || typeof document === "undefined") return
  ref.current = document.activeElement as HTMLElement | null
}

// ============================================================================
// Snap points context
// ----------------------------------------------------------------------------
// When `snapPoints` is provided to <Sheet>, descendant <SheetContent
// side="bottom"> renders in "snap mode": the sheet height is fixed to the
// largest snap, and translateY is computed from the active snap. Drag on the
// indicator moves the sheet, release snaps to the nearest point. Dragging
// below the smallest snap (with dismissible) closes the sheet.
//
// Snap points are accepted as numbers (viewport ratio 0..1) for now; string
// values like "450px" are accepted but treated as their parsed ratio against
// window.innerHeight.
// ============================================================================

type SnapPoint = number | string

interface SheetSnapContextValue {
  snapPoints: SnapPoint[]
  /** normalized snap ratios (0..1) parallel to `snapPoints` */
  snapRatios: number[]
  activeSnapPoint: SnapPoint | null
  setActiveSnapPoint: (s: SnapPoint | null) => void
  dismissible: boolean
  fadeFromIndex: number
  /** When false, render no backdrop overlay (push-up / inline mode). */
  overlay: boolean
  close: () => void
}

const SheetSnapContext = React.createContext<SheetSnapContextValue | null>(null)

// Always-on context provided by <Sheet> so descendant content can request a
// close without rendering a hidden <DialogPrimitive.Close>. Used by snap-mode
// drag-dismiss and by non-snap `swipeToClose`.
interface SheetRootContextValue {
  close: () => void
}
const SheetRootContext = React.createContext<SheetRootContextValue | null>(null)

// ============================================================================
// Virtual keyboard handling (visualViewport)
// ----------------------------------------------------------------------------
// Bottom-anchored fixed sheets are positioned against the *layout* viewport,
// which on mobile does NOT shrink when the on-screen keyboard opens (the
// dvh/svh/lvh units don't account for the keyboard either). The keyboard then
// overlaps the sheet from the bottom and, for a sheet taller than the visible
// area, pushes its top edge (title / drag handle / top bar) out of view.
//
// We observe window.visualViewport — the region actually visible above the
// keyboard — and report:
//   - keyboardInset: px to lift the sheet's bottom edge above the keyboard
//                    (offset of the keyboard top from the layout bottom)
//   - visibleHeight: height of the visible region, to cap the sheet height so
//                    its top edge stays on-screen
// Both are inert (0 / null) when no keyboard is shown — on desktop, when the
// API is unavailable, or before any input is focused — so callers fall back to
// their default CSS (max-h-[90dvh], bottom-0). SSR-safe: the effect is a no-op
// on the server, where window is undefined.
// ============================================================================
interface VisualViewportInset {
  keyboardInset: number
  visibleHeight: number | null
}

function computeVisualViewportInset(
  layoutHeight: number,
  visualHeight: number,
  visualOffsetTop: number
): VisualViewportInset {
  const inset = Math.max(0, layoutHeight - visualHeight - visualOffsetTop)
  // Treat a sub-pixel inset as "no keyboard" to avoid jitter from rounding or
  // browser-chrome (address bar) animations being misread as a keyboard.
  if (inset < 1) return { keyboardInset: 0, visibleHeight: null }
  return { keyboardInset: inset, visibleHeight: visualHeight }
}

/**
 * Inline style that lifts a bottom-anchored sheet above the on-screen keyboard
 * and caps its height to the visible region (see {@link computeVisualViewportInset}).
 *
 * Mirrors the CSS fallback shipped in styles/sheet-keyboard.css (#150):
 *   - "bottom" (the lift) applies to every bottom sheet, snap mode included —
 *     lifting a snap sheet above the keyboard is always safe.
 *   - "maxHeight" (the cap) is skipped in snap mode (snapActive), because a
 *     snap sheet manages its own height via the active snap ratio; capping it
 *     here would fight that. This is the JS twin of the CSS
 *     :not([data-snap-active]) branch.
 *
 * Returns undefined when no keyboard is present (keyboardInset <= 0) so the
 * caller falls back to the variant default CSS (bottom-0 / max-h-[90dvh]).
 *
 * Exported for unit testing only — not part of the public package API.
 */
function resolveBottomSheetKeyboardStyle(
  keyboardInset: number,
  visibleHeight: number | null,
  snapActive: boolean
): { bottom: number; maxHeight?: number } | undefined {
  if (keyboardInset <= 0) return undefined
  if (snapActive) return { bottom: keyboardInset }
  return { bottom: keyboardInset, maxHeight: visibleHeight ?? undefined }
}

/**
 * float 系シート（`float` / `float-glass`）の外周マージン。
 * バリアントの `inset-x-3` / `bottom-3`（0.75rem = 12px）と同値。
 */
const FLOAT_SHEET_GAP_PX = 12

/**
 * float 系シートのキーボード追従スタイル（#337）。
 *
 * bottom 系と違い float は画面端に貼り付かず 12px の余白を持つため、
 *   - lift は「キーボード高さ + 下マージン」
 *   - 高さキャップは「可視領域 − 上下マージン − 上部セーフエリア」
 * になる。iOS ではキーボード表示時にページ全体が視覚シフトするため、
 * 背の高い float シートはこの補正が無いと上端が画面外へ抜ける。
 * belle-todo が globals.css で入れていた回避策と等価。
 *
 * キーボード非表示時は undefined を返し、バリアント既定の CSS
 * （bottom-3 / 高さ無制限）にフォールバックする。
 *
 * Exported for unit testing only — not part of the public package API.
 */
function resolveFloatSheetKeyboardStyle(
  keyboardInset: number,
  visibleHeight: number | null
): { bottom: number; maxHeight?: string } | undefined {
  if (keyboardInset <= 0) return undefined
  const bottom = keyboardInset + FLOAT_SHEET_GAP_PX
  if (visibleHeight == null) return { bottom }
  // 極端に背の高いキーボードでキャップが負にならないよう 0 で下限を切る
  // （負値だと「上端が抜ける」不具合を「中身が高さ 0 で消える」不具合に
  // すり替えるだけになる）。
  const cap = Math.max(0, visibleHeight - FLOAT_SHEET_GAP_PX * 2)
  return {
    bottom,
    maxHeight: `max(0px, calc(${cap}px - env(safe-area-inset-top, 0px)))`,
  }
}

function useVisualViewportInset(): VisualViewportInset {
  const [inset, setInset] = React.useState<VisualViewportInset>({
    keyboardInset: 0,
    visibleHeight: null,
  })
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const vv = window.visualViewport
    if (!vv) return
    const update = () =>
      setInset(
        computeVisualViewportInset(window.innerHeight, vv.height, vv.offsetTop)
      )
    update()
    vv.addEventListener("resize", update)
    vv.addEventListener("scroll", update)
    return () => {
      vv.removeEventListener("resize", update)
      vv.removeEventListener("scroll", update)
    }
  }, [])
  return inset
}

/**
 * Pure decision for the full-surface swipe-to-close gesture, shared by the
 * touch and pointer paths in {@link SwipeToCloseBottomSheet}.
 *
 * Given the cumulative offset from the gesture's start (`dy`/`dx`) and whether
 * the touched scroll region is at its top (`atTop`), classify the gesture:
 *   - `null`   — below the 6px slop; intent is still ambiguous, keep waiting.
 *   - `"drag"` — a downward, vertical-dominant gesture starting at the top;
 *                drives the close-drag.
 *   - `"scroll"` — anything else (upward, horizontal, or not at the top); the
 *                content keeps its own scroll gesture.
 *
 * Exported for unit testing only — not part of the public package API.
 */
function decideSwipeGesture(dy: number, dx: number, atTop: boolean): "drag" | "scroll" | null {
  if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return null
  if (dy > 0 && dy > Math.abs(dx) && atTop) return "drag"
  return "scroll"
}

/**
 * A single drag sample: vertical position (`y`, px) at a moment in time
 * (`t`, ms — any monotonic clock; `event.timeStamp` in practice).
 */
interface DragSample {
  y: number
  t: number
}

/** Trailing window (ms) used to measure the release "flick" velocity. */
const FLICK_VELOCITY_WINDOW_MS = 100
/**
 * Downward velocity (px/ms) at release that dismisses regardless of distance.
 * 0.5px/ms ≈ a brisk iOS flick; tuned to fire on intentional flicks while
 * ignoring slow drags that stop short of the distance threshold.
 */
const FLICK_VELOCITY_THRESHOLD = 0.5

/**
 * Velocity of the drag (px/ms, positive = downward) over the trailing
 * {@link FLICK_VELOCITY_WINDOW_MS} ending at `releaseT`.
 *
 * Only samples within the window *before release* count, so a flick followed
 * by a pause-then-release reads ~0 (the finger was still at release) and does
 * not register as a flick. Returns 0 when there are fewer than two qualifying
 * samples or the time delta is non-positive.
 *
 * Exported for unit testing only — not part of the public package API.
 */
function computeFlickVelocity(
  samples: DragSample[],
  releaseT: number,
  windowMs: number = FLICK_VELOCITY_WINDOW_MS
): number {
  const recent = samples.filter((s) => releaseT - s.t <= windowMs)
  if (recent.length < 2) return 0
  const first = recent[0]
  const last = recent[recent.length - 1]
  const dt = last.t - first.t
  if (dt <= 0) return 0
  return (last.y - first.y) / dt
}

/**
 * Pure release decision for the swipe-to-close gesture: dismiss the sheet when
 * either the drag passed the distance threshold (>30% of the sheet height,
 * falling back to 200px when the height is unknown) OR the release was a fast
 * downward flick ({@link FLICK_VELOCITY_THRESHOLD}) — mirroring iOS sheets,
 * which close on a short fast flick even below the distance threshold.
 *
 * `velocity` is downward-positive px/ms (see {@link computeFlickVelocity}); the
 * flick branch also requires a net downward drag so an upward flick never
 * dismisses.
 *
 * Exported for unit testing only — not part of the public package API.
 */
function decideSwipeDismiss(
  dragY: number,
  sheetHeight: number,
  velocity: number
): boolean {
  const distanceThreshold = sheetHeight > 0 ? sheetHeight * 0.3 : 200
  if (dragY > distanceThreshold) return true
  if (dragY > 0 && velocity > FLICK_VELOCITY_THRESHOLD) return true
  return false
}

/**
 * Project a raw pointer delta onto a side drawer's "close axis" so the shared
 * swipe helpers ({@link decideSwipeGesture}, {@link computeFlickVelocity},
 * {@link decideSwipeDismiss}) can drive a horizontal drawer the same way they
 * drive the bottom sheet.
 *
 * `primary` is the distance along the close direction (positive = toward the
 * anchored edge = closing): rightward for a `side="right"` drawer, leftward for
 * `side="left"`. `cross` is the perpendicular (vertical) delta — a large cross
 * means the user is scrolling the body, not closing the drawer.
 *
 * Exported for unit testing only — not part of the public package API.
 */
function projectCloseAxisDelta(
  dx: number,
  dy: number,
  side: "left" | "right"
): { primary: number; cross: number } {
  // right: closing moves right (+dx). left: closing moves left (−dx).
  return { primary: side === "right" ? dx : -dx, cross: dy }
}

/**
 * Signed CSS translateX (px) that moves a side drawer toward its anchored edge
 * by `primary` px of close-axis drag. Right drawers slide right (+), left
 * drawers slide left (−).
 *
 * Exported for unit testing only — not part of the public package API.
 */
function closeAxisTranslate(primary: number, side: "left" | "right"): number {
  return side === "right" ? primary : -primary
}

function snapToRatio(snap: SnapPoint): number {
  if (typeof snap === "number") return Math.min(1, Math.max(0, snap))
  // "450px" → 450 / window.innerHeight
  const px = parseFloat(snap)
  if (Number.isNaN(px)) return 0.9
  if (typeof window === "undefined") return 0.9
  return Math.min(1, Math.max(0, px / window.innerHeight))
}

interface SheetProps
  extends React.ComponentProps<typeof DialogPrimitive.Root> {
  snapPoints?: SnapPoint[]
  activeSnapPoint?: SnapPoint | null
  setActiveSnapPoint?: (s: SnapPoint | null) => void
  /** index in `snapPoints` from which the backdrop overlay starts to fade in */
  fadeFromIndex?: number
  dismissible?: boolean
  /**
   * When false, the backdrop overlay is not rendered. Use for "push-up"
   * layouts where the sheet shares the viewport with other UI (e.g. a
   * video that resizes as the sheet expands).
   * Default: true.
   */
  overlay?: boolean
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
}

function Sheet({
  snapPoints,
  activeSnapPoint: activeSnapPointProp,
  setActiveSnapPoint: setActiveSnapPointProp,
  fadeFromIndex,
  dismissible = true,
  overlay = true,
  onOpenChange,
  open,
  defaultOpen,
  ...props
}: SheetProps) {
  const snapRatios = React.useMemo(
    () => (snapPoints ?? []).map(snapToRatio),
    [snapPoints]
  )

  // open は controlled / uncontrolled 両対応。未指定時は内部 state を持つことで、
  // 自前の close()（スワイプ dismiss / snap 下スワイプ）が Trigger 開きでも機能する。
  // defaultOpen は Radix に渡さず内部 state の初期値として引き継ぐ
  // （Root には常に open を渡す＝制御モードになるため）。
  const isControlledOpen = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const actualOpen = isControlledOpen ? open : internalOpen

  const isControlledSnap = activeSnapPointProp !== undefined
  // Uncontrolled default = the *lowest* snap (peek). Callers who want
  // a different initial state pass `activeSnapPoint` (controlled).
  const defaultSnap: SnapPoint | null = snapPoints?.[0] ?? null
  const [internalSnap, setInternalSnap] = React.useState<SnapPoint | null>(defaultSnap)
  const activeSnapPoint = isControlledSnap ? activeSnapPointProp! : internalSnap
  const setActiveSnapPoint = React.useCallback(
    (s: SnapPoint | null) => {
      if (!isControlledSnap) setInternalSnap(s)
      setActiveSnapPointProp?.(s)
    },
    [isControlledSnap, setActiveSnapPointProp]
  )

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      // Same logic on close: only reset our internal state if we own it.
      if (!next && !isControlledSnap && snapPoints && snapPoints.length > 0) {
        setInternalSnap(snapPoints[0])
      }
      if (!isControlledOpen) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, snapPoints, isControlledSnap, isControlledOpen]
  )

  const ctx = React.useMemo<SheetSnapContextValue | null>(() => {
    if (!snapPoints || snapPoints.length === 0) return null
    return {
      snapPoints,
      snapRatios,
      activeSnapPoint,
      setActiveSnapPoint,
      dismissible,
      fadeFromIndex: fadeFromIndex ?? 0,
      overlay,
      close: () => handleOpenChange(false),
    }
  }, [
    snapPoints,
    snapRatios,
    activeSnapPoint,
    setActiveSnapPoint,
    dismissible,
    fadeFromIndex,
    overlay,
    handleOpenChange,
  ])

  const rootCtx = React.useMemo<SheetRootContextValue>(
    () => ({ close: () => handleOpenChange(false) }),
    [handleOpenChange]
  )

  return (
    <SheetRootContext.Provider value={rootCtx}>
      <SheetSnapContext.Provider value={ctx}>
        <DialogPrimitive.Root
          data-slot="sheet"
          open={actualOpen}
          onOpenChange={handleOpenChange}
          {...props}
        />
      </SheetSnapContext.Provider>
    </SheetRootContext.Provider>
  )
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ container, ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  // 明示 container（SheetContent.container）> PortalContainerProvider >
  // document.body（#360）。既存の container prop の挙動は不変。
  const resolvedContainer = usePortalContainer(container)
  return <DialogPrimitive.Portal data-slot="sheet-portal" container={resolvedContainer} {...props} />
}

// ============================================================================
// Nested-modal z-index stacking (#158 / #166 / #340)
// ----------------------------------------------------------------------------
// 実体は `@/lib/modal-stack` に移動した（#340）。Sheet だけがスタックに参加して
// いると、多段 Sheet（content = 60 + 段数*20）の上に Dialog(60) を開いたときに
// 後から開いた Dialog が確実に隠れてしまうため、Sheet / Dialog / AlertDialog が
// 同じ 1 本のスタックを共有する形にした。ここでの Sheet 側の使い方（Registrar を
// DialogPrimitive.Content の子として置き、z をインライン style で当てる）は
// 変わっていない。詳しい経緯は modal-stack.ts のコメントを参照。
// ============================================================================

interface SheetOverlayProps extends React.ComponentProps<typeof DialogPrimitive.Overlay> {
  /**
   * true: Liquid Glass オーバーレイ
   * （真っ暗なスクリムの代わりに軽いすりガラス風）
   */
  glass?: boolean
  /** 0..1 — controlled opacity for snap-mode overlays */
  opacity?: number
  /**
   * ネスト段数(0=最初に開いたシート)。指定時は z-index を
   * `--Z-Overlay + stackLevel*20` で上書きする（#158: 多段 Sheet の overlay 暗転対策）。
   * 未指定時は --Z-Overlay 固定。
   */
  stackLevel?: number
  /**
   * escape hatch: z-index を明示指定したい consumer 向け。指定時は
   * stackLevel による自動算出より優先する。
   */
  zIndex?: number
}

function SheetOverlay({
  className,
  glass = false,
  opacity,
  style,
  stackLevel,
  zIndex,
  ...props
}: SheetOverlayProps) {
  const controlled = opacity != null
  const resolvedZ =
    zIndex ?? (stackLevel != null ? modalOverlayZ(stackLevel) : undefined)
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // Overlay sits *under* SheetContent (--Z-Modal). Using --Z-Overlay prevents
        // the glass scrim from covering the sheet content. When resolvedZ is
        // set (stackLevel/zIndex prop) the inline style below overrides this
        // base value per-instance (#158 nested sheets).
        "fixed inset-0 z-[var(--Z-Overlay)]",
        // For "glass" sheets, the sheet itself provides the frosted-glass
        // visual via its own backdrop-filter. Doubling that with a blurred
        // overlay washes out the sheet completely. Use a subtle dark scrim
        // (no backdrop blur) instead — the glass sheet on top reads clearly.
        glass ? "bg-black/30" : "bg-black/40",
        // When opacity is not controlled, fall back to a simple opacity
        // transition (no fade-in-0 keyframes which can leave the layer
        // permanently at opacity 0 in some Tailwind / animate plugin combos).
        !controlled && "transition-opacity duration-[var(--Motion-Duration-Base)]",
        className
      )}
      style={{
        ...style,
        ...(controlled ? { opacity } : null),
        ...(resolvedZ != null ? { zIndex: resolvedZ } : null),
      }}
      {...props}
    />
  )
}

/** ドラッグインジケーター（Apple HIG: 36×5pt, gray, centered） */
function SheetDragIndicator() {
  return (
    <div className="flex justify-center pt-4 pb-1 flex-shrink-0">
      <div className="w-9 h-[5px] rounded-full bg-[var(--Object-Disable)] opacity-50" />
    </div>
  )
}

const sheetVariants = cva(
  // ksk-squircle: 角丸のあるシート（bottom / float 等）の角を連続曲率にする。
  // radius 0 の side（top / left / right の平辺）では no-op。
  "fixed z-[var(--Z-Modal)] ksk-squircle text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-dialog)] transition ease-[var(--Motion-Easing-Standard)]",
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 border-b border-[var(--Border-Low-Emphasis)]",
          "bg-[var(--Surface-Primary)]",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-top data-[state=open]:duration-[var(--Motion-Duration-Base)]",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=closed]:duration-[var(--Motion-Duration-Fast)]",
        ].join(" "),
        bottom: [
          "inset-x-0 bottom-0 rounded-t-[var(--Radius-Sheet)]",
          "bg-[var(--Surface-Primary)]",
          // 高さ制約: viewport より高いシートで top が画面外にはみ出るのを防ぐ。
          // snap mode は activeSnapPoint で独自に高さ制御するため、このバリアント
          // (snap モード以外の bottom シート) にのみ適用される。
          "max-h-[90dvh] overflow-y-auto",
        ].join(" "),
        left: [
          "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-[var(--Border-Low-Emphasis)]",
          "bg-[var(--Surface-Primary)]",
          "data-[state=open]:animate-slide-in-left",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left",
        ].join(" "),
        right: [
          "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-[var(--Border-Low-Emphasis)]",
          "bg-[var(--Surface-Primary)]",
          "data-[state=open]:animate-slide-in-right",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
        ].join(" "),
        /**
         * フローティングボトムシート
         * 左右・下に余白を持つカード型。モバイルの入力シートに最適。
         */
        float: [
          "inset-x-3 bottom-3 rounded-[var(--Radius-Sheet)] max-w-lg mx-auto",
          "bg-[var(--Surface-Primary)]",
          // #337: キーボード表示時に maxHeight でキャップされるため、
          // 溢れた分をシート内でスクロールできるようにしておく。
          "overflow-y-auto",
        ].join(" "),
        /**
         * Liquid Glass フローティングシート
         * 背景が透けるガラス素材。写真・グラデーション上での
         * アクション確認シートに最適。
         */
        "float-glass": [
          "inset-x-3 bottom-3 rounded-[var(--Radius-Sheet)] max-w-lg mx-auto",
          "glass glass-specular",
          // #337: スクロール可能化は Tailwind の overflow-y-auto では効かない。
          // glass.css は非レイヤー CSS として読まれ、`.glass-specular` の
          // `overflow: hidden` が @layer utilities のユーティリティを常に
          // 踏み潰すため（glass.css のインシデント記録参照）。代わりに
          // styles/sheet-keyboard.css の非レイヤー規則で上書きしている。
        ].join(" "),
        /**
         * Liquid Glass ボトムシート
         * 下から全幅で出るガラス素材シート。
         */
        "bottom-glass": [
          "inset-x-0 bottom-0 rounded-t-[var(--Radius-Sheet)]",
          "glass-strong",
        ].join(" "),
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

const glassSides = new Set(["float-glass", "bottom-glass"])

interface SheetContentProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "autoFocus">,
    VariantProps<typeof sheetVariants> {
  /** オーバーレイをガラス調にする（glass系 side では自動で true） */
  glassOverlay?: boolean
  /**
   * Portal target element. When provided, the sheet portals into this element
   * instead of document.body. Useful for inheriting CSS transforms (e.g. forced
   * landscape rotation in mobile apps). Defaults to document.body if omitted.
   */
  container?: HTMLElement | null
  /**
   * シートのデフォルト内側余白（p-6）を制御。
   * - true（既定）: p-6 を付与（従来通り）
   * - false       : p-0。スクロール領域＋固定フッタなど自前で内側レイアウトを
   *                 組むときに使用。これまで padding を強制上書きしていた
   *                 ケースを正規化する。
   */
  padding?: boolean
  /**
   * Swipe-to-close gesture. Supported for bottom-anchored sheets
   * (`side="bottom"` / `"bottom-glass"`) and side drawers (`side="left"` /
   * `"right"`); ignored for other sides.
   *
   * Bottom sheets: <SheetDragIndicator /> is auto-rendered at the top and a
   * downward swipe dragging past ~30% of the sheet height calls
   * onOpenChange(false). The swipe works across the whole sheet surface, not
   * just the indicator: a downward drag dismisses when it starts on the handle,
   * or while the touched scroll region is at its top. Mid-scroll and horizontal
   * gestures stay with the content, so it never hijacks scrolling.
   *
   * Side drawers: the close direction follows `side` — a `right` drawer closes
   * on a rightward drag, a `left` drawer on a leftward drag (dragging past ~30%
   * of the drawer width, or a fast flick). Vertical-dominant gestures stay with
   * the content's scroll. No drag indicator is rendered.
   *
   * Ignored when the parent <Sheet> uses `snapPoints` (snap mode handles its
   * own drag).
   */
  swipeToClose?: boolean
  /**
   * Optional screen-reader description.
   * - string / ReactNode: sr-only な <SheetDescription> を自動レンダリングし
   *   `aria-describedby` に紐付ける
   * - undefined（既定）: `aria-describedby={undefined}` を明示して
   *   Radix の "Missing Description" 警告を抑制。description が概念上
   *   不要なシート（クイック追加 FAB、設定 sheet 等）用。
   * 可視の description を出したい場合は、この prop を使わず子要素として
   * `<SheetDescription>` を直接置く（#485 以降、子に置いた Description は
   * 自動で `aria-describedby` に紐付く。id の手当ては不要）。
   */
  description?: React.ReactNode
  /**
   * open 時の初期フォーカス。未指定時は Radix の既定挙動。
   * - "first-input": 最初の入力/操作可能要素
   * - "title": SheetTitle
   * - ref: 任意要素
   * - false: 自動フォーカスを抑制
   */
  autoFocus?: LayerAutoFocusTarget
  /** close 後に open 前の要素へ focus を戻す。既定 true。 */
  restoreFocusOnClose?: boolean
  /** Esc キーで閉じる。既定 true。 */
  closeOnEsc?: boolean
  /**
   * Sheet 表示中に body scroll を抑止する。既定 true。
   * 実際の抑止は modal Sheet（Radix Dialog）標準の scroll lock が「開いている間
   * だけ」行うため、この prop は後方互換のために受けるのみ（DOM へは流さない）。
   * 背景スクロールを許可したい場合は非 modal な Sheet を使う。
   */
  bodyScrollLock?: boolean
  /**
   * #158: 多段 Sheet の z-index escape hatch。
   * 未指定時は開いている Sheet の順序（グローバルスタック）から自動算出
   * （overlay = 40 + depth*20 / content = 50 + depth*20）されるため通常は不要。
   * 自動算出が想定と異なる場合（他ライブラリの overlay と揃えたい等）にのみ
   * 明示指定する。
   */
  zIndex?: number
  /** overlay 要素にのみ追加の className を当てたい場合の escape hatch。 */
  overlayClassName?: string
  /**
   * safe-area（ノッチ・ステータスバー・ホームインジケータ）の回避を
   * 有効にするか。既定 true。
   * - `side="top"`: 上端に `env(safe-area-inset-top)` 分の内側余白を確保
   * - `side="float"` / `"float-glass"`: キーボード非表示時にも上端が画面外へ
   *   抜けないよう既定の max-height を確保（可視領域 − 上下マージン1.5rem −
   *   上部safe-area。キーボード表示時の追従 (#337) とは独立で、そちらが
   *   優先される）
   * false にすると回避を無効化する（consumer が自前で safe-area を管理する
   * 場合のオプトアウト。安全側の既定を壊さないよう既定は true）。他の side
   * では効果を持たない（`data-safe-area` 属性自体は side に関わらず出る）。
   */
  safeArea?: boolean
}

const swipeSides = new Set(["bottom", "bottom-glass"])
const sideDrawerSwipeSides = new Set(["left", "right"])

function SheetContent({
  className,
  children,
  side = "right",
  glassOverlay,
  container,
  padding = true,
  swipeToClose,
  description,
  autoFocus,
  restoreFocusOnClose = true,
  closeOnEsc = true,
  bodyScrollLock: _bodyScrollLock = true,
  zIndex,
  overlayClassName,
  safeArea = true,
  ...props
}: SheetContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const restoreFocusRef = React.useRef<HTMLElement | null>(null)
  // body scroll lock は Radix (modal Dialog) の react-remove-scroll が
  // 「開いている間だけ」担うため、ここでは何もしない。bodyScrollLock prop は
  // API 互換のため残し、DOM へ流さないよう分割代入で受けるだけにしている。
  // 以前ここにあった手動ロックは、直後のコメントにある通り SheetContent が
  // 開閉に関係なく毎回レンダリングされる（=フックが常時走る）ため、Sheet が
  // 閉じていても body に overflow:hidden を出しっぱなしにし、その Sheet を含む
  // ページ／Storybook 全体のスクロールを殺していた。
  // #158/#166: claim this sheet's depth in the global open-sheet stack so
  // nested sheets escalate z-index instead of colliding at the fixed 40/50
  // pair. Unlike the pre-#166 version, `SheetContent` itself does NOT call
  // useSheetStackLevel (it renders unconditionally regardless of open state).
  // Instead each branch below mounts a <ModalStackRegistrar> *inside* its
  // `DialogPrimitive.Content`, which Radix's Presence only mounts while the
  // sheet is actually open — so the stack reflects open order, not tree
  // order, and claim/release live entirely in effects (see useSheetStackLevel
  // doc comment). `stackLevel` here starts at 0 and is updated one effect
  // tick after mount by the registrar; the resulting z-index lag is a single
  // frame, resolved before the open animation is visible.
  const [stackLevel, setStackLevel] = React.useState(0)
  const resolvedContentZ = zIndex ?? modalContentZ(stackLevel)
  const hasInternalDesc = description != null && description !== false
  // #341: 素の Sheet は「全画面のページ」ではないので、配下の SheetTitle の
  // 既定を従来サイズに保つ文脈を明示的に流す（外側の全画面サーフェスの文脈を
  // 引き継いでネストしたシートのタイトルが大きくなるのを防ぐ）。全画面級の
  // preset を持つ BottomSheetFrame は、children をさらに内側で "page" 文脈に
  // 包み直すことでこれを上書きする。
  const scopedChildren = (
    <TitleSurfaceScaleProvider scale="dialog">{children}</TitleSurfaceScaleProvider>
  )
  const snapCtx = React.useContext(SheetSnapContext)
  // The drag indicator is an iOS HIG "this can be dragged" affordance.
  // Auto-rendered in two cases:
  //   1. Snap mode (parent <Sheet> has `snapPoints`).
  //   2. `swipeToClose` is set and `side` is a bottom-anchored variant.
  // In any other case the indicator is hidden — rendering it without
  // backing drag behavior is a misleading hint. Consumers can still
  // render <SheetDragIndicator /> manually if they wire their own drag.
  const useGlassOverlay = glassOverlay ?? glassSides.has(side as string)
  // Lift bottom-anchored sheets above the on-screen keyboard (see
  // useVisualViewportInset). The hook is inert for non-keyboard / non-bottom
  // cases, and is called unconditionally here to keep hook order stable across
  // the early-return branches below.
  const { keyboardInset, visibleHeight } = useVisualViewportInset()
  const handleOpenAutoFocus = (event: Event) => {
    captureRestoreFocus(restoreFocusRef)
    props.onOpenAutoFocus?.(event)
    if (event.defaultPrevented || autoFocus == null) return
    event.preventDefault()
    if (autoFocus === false) return
    window.requestAnimationFrame(() => {
      focusLayerTarget(contentRef.current, autoFocus, "sheet-title")
    })
  }
  const handleCloseAutoFocus = (event: Event) => {
    props.onCloseAutoFocus?.(event)
    if (event.defaultPrevented) return
    if (!restoreFocusOnClose) {
      event.preventDefault()
      return
    }
    if (restoreFocusRef.current) {
      event.preventDefault()
      restoreFocusRef.current.focus()
    }
  }
  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    props.onEscapeKeyDown?.(event)
    if (!closeOnEsc) event.preventDefault()
  }

  // Snap mode kicks in only for `side="bottom"` when the parent Sheet was
  // given `snapPoints`. Other sides ignore snap entirely (per spec).
  if (snapCtx && side === "bottom") {
    return (
      <SnapBottomSheetContent
        snapCtx={snapCtx}
        className={className}
        glassOverlay={useGlassOverlay}
        overlayClassName={overlayClassName}
        stackLevel={stackLevel}
        onStackLevelChange={setStackLevel}
        contentZIndex={resolvedContentZ}
        container={container}
        description={description}
        autoFocus={autoFocus}
        restoreFocusOnClose={restoreFocusOnClose}
        closeOnEsc={closeOnEsc}
        restoreFocusRef={restoreFocusRef}
        {...props}
      >
        {scopedChildren}
      </SnapBottomSheetContent>
    )
  }

  if (swipeToClose && swipeSides.has(side as string)) {
    return (
      <SwipeToCloseBottomSheet
        side={side as "bottom" | "bottom-glass"}
        className={className}
        glassOverlay={useGlassOverlay}
        overlayClassName={overlayClassName}
        stackLevel={stackLevel}
        onStackLevelChange={setStackLevel}
        contentZIndex={resolvedContentZ}
        container={container}
        padding={padding}
        description={description}
        autoFocus={autoFocus}
        restoreFocusOnClose={restoreFocusOnClose}
        closeOnEsc={closeOnEsc}
        restoreFocusRef={restoreFocusRef}
        {...props}
      >
        {scopedChildren}
      </SwipeToCloseBottomSheet>
    )
  }

  // Side drawers (`left` / `right`) dismiss by dragging toward the anchored
  // edge — rightward for `side="right"`, leftward for `side="left"` — matching
  // the direction the sheet slides out. Vertical-dominant gestures stay with
  // the content's own scroll.
  if (swipeToClose && sideDrawerSwipeSides.has(side as string)) {
    return (
      <SwipeToCloseSideDrawer
        side={side as "left" | "right"}
        className={className}
        glassOverlay={useGlassOverlay}
        overlayClassName={overlayClassName}
        stackLevel={stackLevel}
        onStackLevelChange={setStackLevel}
        contentZIndex={resolvedContentZ}
        container={container}
        padding={padding}
        description={description}
        autoFocus={autoFocus}
        restoreFocusOnClose={restoreFocusOnClose}
        closeOnEsc={closeOnEsc}
        restoreFocusRef={restoreFocusRef}
        {...props}
      >
        {scopedChildren}
      </SwipeToCloseSideDrawer>
    )
  }

  // Bottom-anchored sheets (`bottom` / `bottom-glass`) share the same
  // keyboard-overlap problem as the swipeToClose path: while the keyboard is
  // open, lift the sheet above it and cap its height to the visible region,
  // overriding the variant's `bottom-0` / `max-h-[90dvh]`.
  //
  // float 系（`float` / `float-glass`）も同じ問題を持つが、画面端に 12px の
  // 余白を残す配置なので専用の補正を使う（#337）。
  const isBottomAnchored = side === "bottom" || side === "bottom-glass"
  const isFloating = side === "float" || side === "float-glass"
  const isTopSheet = side === "top"
  const keyboardStyle = isBottomAnchored
    ? resolveBottomSheetKeyboardStyle(keyboardInset, visibleHeight, false)
    : isFloating
      ? resolveFloatSheetKeyboardStyle(keyboardInset, visibleHeight)
      : undefined
  const {
    "aria-describedby": ariaDescribedBy,
    ...contentProps
  } = props
  const { setContentNode, applyDescribedBy } = useDescribedByLink(
    contentRef,
    "sheet-description",
    !hasInternalDesc && ariaDescribedBy == null
  )

  // side="top" の safe-area 回避。padding true/false それぞれで完結した
  // クラス集合を選ぶ（ショートハンドの padding と方向指定の padding を同時に
  // 混ぜると twMerge がどちらも残してしまい CSS 生成順に結果が左右されるため
  // 避ける。dialog.tsx の fullscreen 分岐と同じ理由）。
  const topSafeAreaPaddingClass = isTopSheet
    ? padding
      ? safeArea
        ? "px-6 pb-6 pt-[calc(1.5rem_+_env(safe-area-inset-top,0px))]"
        : "p-6"
      : safeArea
        ? "pt-[env(safe-area-inset-top,0px)]"
        : undefined
    : padding
      ? "p-6"
      : undefined
  // side="float"/"float-glass" のキーボード非表示時デフォルト高さキャップ。
  // #337 のキーボード追従 (resolveFloatSheetKeyboardStyle) と同じ余白配分
  // （上下マージン1.5rem・上部safe-area控除）で、キーボード非表示時にも
  // 背の高いコンテンツの上端が画面外へ抜けるのを防ぐ。JS のキーボード検知が
  // 発火した場合は inline style（keyboardStyle）が優先して上書きする。
  const floatSafeAreaMaxHeightClass =
    isFloating && safeArea
      ? "max-h-[max(0px,calc(100dvh_-_1.5rem_-_env(safe-area-inset-top,0px)))]"
      : undefined

  return (
    <SheetPortal container={container}>
      <SheetOverlay glass={useGlassOverlay} className={overlayClassName} stackLevel={stackLevel} />
      <DialogPrimitive.Content
        ref={setContentNode}
        data-side={side}
        data-safe-area={safeArea}
        className={cn(
          sheetVariants({ side }),
          topSafeAreaPaddingClass,
          floatSafeAreaMaxHeightClass,
          className
        )}
        {...contentProps}
        // data-slot は spread より後ろに置く（#339）。前に置くと consumer が
        // data-slot を渡したときに上書きでき、styles/sheet-keyboard.css の
        // `[data-slot="sheet-content"]` 系のルールが丸ごと外れる。
        data-slot="sheet-content"
        style={{
          ...props.style,
          ...keyboardStyle,
          zIndex: resolvedContentZ,
        }}
        {...(!hasInternalDesc && { "aria-describedby": ariaDescribedBy })}
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
        onEscapeKeyDown={handleEscapeKeyDown}
      >
        <ModalStackRegistrar onLevelChange={setStackLevel} />
        <DescribedByLinker contentRef={contentRef} applyDescribedBy={applyDescribedBy} />
        {hasInternalDesc && (
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}
        {scopedChildren}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

// ============================================================================
// swipeToClose bottom sheet (non-snap)
// ----------------------------------------------------------------------------
// Content-sized sheet (height auto). On pointer-down over the drag indicator
// we capture the pointer, translate the sheet downward while the pointer
// moves down, and on release either dismiss (dragged > 30% of sheet height)
// or spring back to translate 0. Mirrors snap-mode semantics: position-only
// threshold, no velocity, no rubber-band, no reduced-motion branch. Upward
// drags are clamped at 0 (same as snap mode clamping at maxSnap).
// ============================================================================

// Nearest vertically-scrollable ancestor (inclusive of `start`), bounded by
// `root`. Used by the full-surface swipe-to-close gesture to decide whether a
// downward swipe belongs to the content (scroll) or should dismiss the sheet:
// we only start a close-drag when the touched scroll region is already at its
// top (scrollTop 0) — or there is nothing scrollable under the finger.
function findScrollableAncestor(
  start: EventTarget | null,
  root: HTMLElement | null
): HTMLElement | null {
  let node = start instanceof HTMLElement ? start : null
  while (node) {
    const overflowY = getComputedStyle(node).overflowY
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      return node
    }
    if (node === root) break
    node = node.parentElement
  }
  return null
}

interface SwipeToCloseBottomSheetProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "autoFocus"> {
  side: "bottom" | "bottom-glass"
  className?: string
  glassOverlay?: boolean
  /** #158: overlay 要素への追加 className（escape hatch）。 */
  overlayClassName?: string
  /** #158: グローバル open-sheet スタックでの深度（0=最初に開いたシート）。 */
  stackLevel?: number
  /** #166: stackLevel の変更を親（SheetContent）へ伝える。Registrar 用。 */
  onStackLevelChange?: (level: number) => void
  /** #158: このシートの content z-index（自動算出 or zIndex prop で上書き済みの値）。 */
  contentZIndex?: number
  container?: HTMLElement | null
  padding?: boolean
  description?: React.ReactNode
  autoFocus?: LayerAutoFocusTarget
  restoreFocusOnClose?: boolean
  closeOnEsc?: boolean
  restoreFocusRef?: React.RefObject<HTMLElement | null>
  children?: React.ReactNode
}

function SwipeToCloseBottomSheet({
  side,
  className,
  glassOverlay,
  overlayClassName,
  stackLevel,
  onStackLevelChange,
  contentZIndex,
  container,
  padding = true,
  description,
  autoFocus,
  restoreFocusOnClose = true,
  closeOnEsc = true,
  restoreFocusRef,
  children,
  style,
  ...props
}: SwipeToCloseBottomSheetProps) {
  const hasInternalDesc = description != null && description !== false
  const {
    "aria-describedby": ariaDescribedBy,
    ...contentProps
  } = props
  const rootCtx = React.useContext(SheetRootContext)
  const [dragY, setDragY] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  // transform transition は「ドラッグのスプリングバック」専用。マウント直後は
  // 無効のままにする（bottom variant は open アニメを持たないため、開いた瞬間に
  // transition が走ると「下へズレてから戻る」ちらつきになる）。最初のドラッグ
  // 開始で有効化＝必要な時だけ効く（RAF / タブ可視状態に依存しない）。
  const [everDragged, setEverDragged] = React.useState(false)
  const startYRef = React.useRef(0)
  const startXRef = React.useRef(0)
  // Per-gesture decision: null = undecided, "drag" = closing the sheet,
  // "scroll" = let the content scroll (we stay out of the way).
  const decisionRef = React.useRef<null | "drag" | "scroll">(null)
  // Mirror of `dragging` readable synchronously from the non-passive
  // touchmove listener (state is async).
  const draggingRef = React.useRef(false)
  // Synchronous mirror of `dragY` so the touch listeners (bound once, with a
  // stale render closure) can read the live drag distance at release time.
  const dragYRef = React.useRef(0)
  // Trailing (y, t) samples of the active drag, used to measure release
  // velocity for the flick-to-dismiss path. Reset on each gesture start and
  // trimmed so it never grows unbounded across a long drag.
  const samplesRef = React.useRef<DragSample[]>([])
  const scrollerRef = React.useRef<HTMLElement | null>(null)
  const onHandleRef = React.useRef(false)
  const sheetRef = React.useRef<HTMLDivElement>(null)
  const { applyDescribedBy } = useDescribedByLink(
    sheetRef,
    "sheet-description",
    !hasInternalDesc && ariaDescribedBy == null
  )
  // `close()` lives on a context value whose identity can change; mirror it in
  // a ref so the once-bound touch listeners always call the current one. Synced
  // in an effect (not during render) to respect React's no-ref-writes-in-render
  // rule — the listeners only read it at gesture-end, long after commit.
  const rootCtxRef = React.useRef(rootCtx)
  React.useEffect(() => {
    rootCtxRef.current = rootCtx
  }, [rootCtx])
  // Keep the sheet inside the region above the on-screen keyboard so its top
  // edge (title / drag handle) never scrolls off the top of the viewport.
  const { keyboardInset, visibleHeight } = useVisualViewportInset()
  const handleOpenAutoFocus = (event: Event) => {
    captureRestoreFocus(restoreFocusRef)
    props.onOpenAutoFocus?.(event)
    if (event.defaultPrevented || autoFocus == null) return
    event.preventDefault()
    if (autoFocus === false) return
    window.requestAnimationFrame(() => {
      focusLayerTarget(sheetRef.current, autoFocus, "sheet-title")
    })
  }
  const handleCloseAutoFocus = (event: Event) => {
    props.onCloseAutoFocus?.(event)
    if (event.defaultPrevented) return
    if (!restoreFocusOnClose) {
      event.preventDefault()
      return
    }
    if (restoreFocusRef?.current) {
      event.preventDefault()
      restoreFocusRef.current.focus()
    }
  }
  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    props.onEscapeKeyDown?.(event)
    if (!closeOnEsc) event.preventDefault()
  }

  const setDrag = React.useCallback((v: number) => {
    dragYRef.current = v
    setDragY(v)
  }, [])

  // ── Unified pointer/touch gesture ──────────────────────────────────────────
  // The close-drag must work anywhere on the sheet, not just the handle. On
  // touch devices the scrollable body has an effective `touch-action: pan-y`,
  // so the browser claims a vertical drag as a scroll/overscroll and fires
  // `pointercancel` before our pointer-based drag commits — the sheet only
  // "twitches" and springs back. The robust fix is to drive the gesture from a
  // non-passive `touchmove` listener and `preventDefault()` once we decide it's
  // a close-drag: that both blocks native scrolling and keeps touch events
  // flowing. Pointer handlers stay for mouse only (no cancellation problem).
  const beginGesture = React.useCallback(
    (clientX: number, clientY: number, target: EventTarget | null, t: number) => {
      startYRef.current = clientY
      startXRef.current = clientX
      decisionRef.current = null
      draggingRef.current = false
      samplesRef.current = [{ y: clientY, t }]
      // The drag indicator is always a valid grab target regardless of scroll
      // position; elsewhere the gesture must start at the top of the content.
      onHandleRef.current =
        target instanceof HTMLElement &&
        target.closest("[data-sheet-drag-handle]") != null
      scrollerRef.current = findScrollableAncestor(target, sheetRef.current)
    },
    []
  )

  // Returns true once the gesture is claimed as a close-drag (caller should
  // `preventDefault()` for touch so the browser stops scrolling).
  const moveGesture = React.useCallback(
    (clientX: number, clientY: number, t: number): boolean => {
      if (decisionRef.current === "scroll") return false
      const dy = clientY - startYRef.current
      const dx = clientX - startXRef.current
      if (decisionRef.current === null) {
        // A close-drag may begin on the drag handle regardless of scroll
        // position; elsewhere it must start while the touched scroll region is
        // at its top (otherwise the gesture belongs to the content's scroll).
        const atTop =
          onHandleRef.current ||
          !scrollerRef.current ||
          scrollerRef.current.scrollTop <= 0
        const decision = decideSwipeGesture(dy, dx, atTop)
        if (decision === null) return false // below slop — keep waiting
        decisionRef.current = decision
        if (decision === "drag") {
          draggingRef.current = true
          setEverDragged(true)
          setDragging(true)
        } else {
          return false
        }
      }
      if (draggingRef.current) {
        // Track the trailing samples for release-velocity (flick) detection.
        const s = samplesRef.current
        s.push({ y: clientY, t })
        if (s.length > 12) s.shift()
        // Downward only — upward drags are clamped at 0 (matches snap-mode
        // clamping at maxSnap; no rubber-band for consistency).
        setDrag(Math.max(0, dy))
        return true
      }
      return false
    },
    [setDrag]
  )

  const endGesture = React.useCallback((t: number) => {
    const wasDragging = draggingRef.current
    draggingRef.current = false
    decisionRef.current = null
    if (!wasDragging) return
    setDragging(false)
    const h = sheetRef.current?.offsetHeight ?? 0
    // Dismiss on either a long-enough drag OR a fast downward flick at release
    // (iOS-style). Velocity is measured over the trailing window ending now.
    const velocity = computeFlickVelocity(samplesRef.current, t)
    samplesRef.current = []
    if (decideSwipeDismiss(dragYRef.current, h, velocity)) {
      rootCtxRef.current?.close()
    }
    // Always spring back. If close succeeded the sheet unmounts and this
    // is a no-op visually; if it didn't (controlled parent kept open) the
    // sheet returns to its rest position.
    setDrag(0)
  }, [setDrag])

  // Touch path: non-passive so `preventDefault()` actually suppresses native
  // scroll. Bound imperatively because React's synthetic touch listeners are
  // passive and cannot preventDefault.
  //
  // Attached from a CALLBACK REF, not a mount effect. This component mounts
  // while the dialog is still closed — DialogPrimitive.Content renders null
  // until open — so a mount-time effect saw `sheetRef.current === null`,
  // returned early, and (its deps being stable callbacks) never ran again:
  // the listeners never attached and swipe-to-close silently no-oped on
  // every touch device. The mouse pointer path (React props, bound whenever
  // the node exists) kept working, which masked the bug on desktop. The
  // callback ref fires exactly when the node appears/disappears, so the
  // listeners' lifecycle tracks the DOM node instead of this component.
  const detachTouchRef = React.useRef<(() => void) | null>(null)
  const attachTouchListeners = React.useCallback(
    (el: HTMLDivElement | null) => {
      sheetRef.current = el
      // #485: ノードが DOM に現れたその瞬間に aria-describedby を確定させる
      // （初期フォーカス前に紐付けたいので effect まで待たない）。
      applyDescribedBy()
      detachTouchRef.current?.()
      detachTouchRef.current = null
      if (!el) return
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) return
        const t = e.touches[0]
        beginGesture(t.clientX, t.clientY, e.target, e.timeStamp)
      }
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length !== 1) return
        const t = e.touches[0]
        if (moveGesture(t.clientX, t.clientY, e.timeStamp)) e.preventDefault()
      }
      const onTouchEnd = (e: TouchEvent) => endGesture(e.timeStamp)
      el.addEventListener("touchstart", onTouchStart, { passive: true })
      el.addEventListener("touchmove", onTouchMove, { passive: false })
      el.addEventListener("touchend", onTouchEnd, { passive: true })
      el.addEventListener("touchcancel", onTouchEnd, { passive: true })
      detachTouchRef.current = () => {
        el.removeEventListener("touchstart", onTouchStart)
        el.removeEventListener("touchmove", onTouchMove)
        el.removeEventListener("touchend", onTouchEnd)
        el.removeEventListener("touchcancel", onTouchEnd)
      }
    },
    [beginGesture, moveGesture, endGesture, applyDescribedBy]
  )

  // Pointer path: mouse only. Touch is handled by the non-passive listeners
  // above; double-handling here would re-introduce the cancellation race.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return
    if (e.button != null && e.button !== 0) return
    beginGesture(e.clientX, e.clientY, e.target, e.timeStamp)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return
    // マウスはボタン非押下 (hover) のとき drag しない。ハンドラはコンテンツ全面に
    // 付いており、pointerdown を伴わない素の mousemove でも発火するため、
    // buttons===0 を弾かないと startYRef(初期0) 基準の dy でシートがカーソルに
    // 追従してしまう（デスクトップでシートを開くと高さがマウスに付いてくるバグ）。
    if (e.buttons === 0) return
    if (moveGesture(e.clientX, e.clientY, e.timeStamp)) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // setPointerCapture は未対応環境で例外を投げるため無視
      }
    }
  }

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return
    endGesture(e.timeStamp)
  }

  return (
    <SheetPortal container={container}>
      <SheetOverlay glass={glassOverlay} className={overlayClassName} stackLevel={stackLevel} />
      <DialogPrimitive.Content
        ref={attachTouchListeners}
        data-side={side}
        className={cn(
          sheetVariants({ side }),
          // swipeToClose mode: 高さに制約がないと viewport より高いシートの
          // top (タイトル / ドラッグハンドル) が画面外にはみ出すため
          // 自動で max-h-[90dvh] + overflow-y-auto を付与。
          // snap mode は activeSnapPoint で高さ制御するので別途。
          // overscroll-y-none: 先頭での引き下げ時に iOS のラバーバンドが
          // ジェスチャを先取りすると preventDefault が効かず close-drag が
          // 始められないため、contain ではなく none（ローカルバウンスも禁止）。
          // #164: 非swipe版（下の非snap SheetContent 分岐）と同じ flex 化。
          // 子が min-h-full flex flex-col（DetailSheetScaffold 等）を書いても
          // max-height を超えて伸びないよう、この Content 自体を flex コンテナ
          // にする（子の flex-1 min-h-0 が親の高さキャップ内で効くようになる）。
          "flex flex-col max-h-[90dvh] overflow-y-auto overscroll-y-none",
          padding && "p-6",
          className,
        )}
        style={{
          ...style,
          // While the keyboard is open, lift the sheet above it (bottom) and
          // cap its height to the visible region (maxHeight). These inline
          // values override the variant's `bottom-0` / `max-h-[90dvh]`. When no
          // keyboard is present both are inert and the CSS defaults apply.
          ...resolveBottomSheetKeyboardStyle(keyboardInset, visibleHeight, false),
          transform: `translate3d(0, ${dragY}px, 0)`,
          transition: dragging || !everDragged
            ? "none"
            : "transform var(--Motion-Duration-Sheet-Settle) var(--Motion-Easing-Emphasized)",
          willChange: "transform",
          zIndex: contentZIndex,
        }}
        {...contentProps}
        // data-slot は spread より後ろに置く（#339）。前に置くと consumer が
        // data-slot を渡したときに上書きでき、styles/sheet-keyboard.css の
        // `[data-slot="sheet-content"]` 系のルールが丸ごと外れる。
        data-slot="sheet-content"
        // Full-surface swipe-to-close: handlers live on the content root so a
        // downward swipe anywhere can dismiss. onPointerMove gates on scroll
        // position so it never steals the content's own scroll gesture.
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        {...(!hasInternalDesc && { "aria-describedby": ariaDescribedBy })}
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
        onEscapeKeyDown={handleEscapeKeyDown}
      >
        {onStackLevelChange && (
          <ModalStackRegistrar onLevelChange={onStackLevelChange} />
        )}
        <DescribedByLinker contentRef={sheetRef} applyDescribedBy={applyDescribedBy} />
        {hasInternalDesc && (
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}
        <div
          data-sheet-drag-handle
          className={cn(
            "shrink-0 cursor-grab active:cursor-grabbing select-none",
            // Pull the indicator row out of the sheet's own padding so it
            // sits flush against the top edge, matching the snap-mode layout.
            padding && "-mx-6 -mt-6"
          )}
          // touch-action:none keeps the handle an always-valid grab target —
          // touches here never scroll, and onHandleRef makes it draggable
          // regardless of the content's scroll position.
          style={{ touchAction: "none" }}
        >
          <SheetDragIndicator />
        </div>
        {children}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

// ============================================================================
// swipeToClose side drawer (left / right)
// ----------------------------------------------------------------------------
// Full-height drawer that dismisses by dragging toward its anchored edge:
// rightward for side="right", leftward for side="left". We reuse the same pure
// decision helpers as the bottom sheet by projecting the pointer delta onto the
// drawer's "close axis" (projectCloseAxisDelta): a horizontal-dominant drag in
// the close direction drives the dismiss, while a vertical-dominant gesture is
// left to the content's own scroll. Simpler than the bottom path — no keyboard
// inset, no drag-handle affordance, and no scroll-position gate (a horizontal
// drag never conflicts with the body's vertical scroll).
// ============================================================================

interface SwipeToCloseSideDrawerProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "autoFocus"> {
  side: "left" | "right"
  className?: string
  glassOverlay?: boolean
  /** #158: overlay 要素への追加 className（escape hatch）。 */
  overlayClassName?: string
  /** #158: グローバル open-sheet スタックでの深度（0=最初に開いたシート）。 */
  stackLevel?: number
  /** #166: stackLevel の変更を親（SheetContent）へ伝える。Registrar 用。 */
  onStackLevelChange?: (level: number) => void
  /** #158: このシートの content z-index（自動算出 or zIndex prop で上書き済みの値）。 */
  contentZIndex?: number
  container?: HTMLElement | null
  padding?: boolean
  description?: React.ReactNode
  autoFocus?: LayerAutoFocusTarget
  restoreFocusOnClose?: boolean
  closeOnEsc?: boolean
  restoreFocusRef?: React.RefObject<HTMLElement | null>
  children?: React.ReactNode
}

function SwipeToCloseSideDrawer({
  side,
  className,
  glassOverlay,
  overlayClassName,
  stackLevel,
  onStackLevelChange,
  contentZIndex,
  container,
  padding = true,
  description,
  autoFocus,
  restoreFocusOnClose = true,
  closeOnEsc = true,
  restoreFocusRef,
  children,
  style,
  ...props
}: SwipeToCloseSideDrawerProps) {
  const hasInternalDesc = description != null && description !== false
  const {
    "aria-describedby": ariaDescribedBy,
    ...contentProps
  } = props
  const rootCtx = React.useContext(SheetRootContext)
  const [dragDist, setDragDist] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  // Enable the spring-back transform transition only after the first drag, so
  // it never fights the variant's slide-in open keyframe (which also animates
  // transform). See the bottom-sheet path for the same rationale.
  const [everDragged, setEverDragged] = React.useState(false)
  const startXRef = React.useRef(0)
  const startYRef = React.useRef(0)
  const decisionRef = React.useRef<null | "drag" | "scroll">(null)
  const draggingRef = React.useRef(false)
  // Synchronous mirror of the close-axis drag distance for the once-bound touch
  // listeners (state is async).
  const dragDistRef = React.useRef(0)
  // Trailing (position, t) samples for release-velocity (flick) detection.
  // `y` here holds the close-axis position (not vertical) so the shared
  // computeFlickVelocity measures close-axis velocity.
  const samplesRef = React.useRef<DragSample[]>([])
  const sheetRef = React.useRef<HTMLDivElement>(null)
  const { applyDescribedBy } = useDescribedByLink(
    sheetRef,
    "sheet-description",
    !hasInternalDesc && ariaDescribedBy == null
  )
  const rootCtxRef = React.useRef(rootCtx)
  React.useEffect(() => {
    rootCtxRef.current = rootCtx
  }, [rootCtx])

  const handleOpenAutoFocus = (event: Event) => {
    captureRestoreFocus(restoreFocusRef)
    props.onOpenAutoFocus?.(event)
    if (event.defaultPrevented || autoFocus == null) return
    event.preventDefault()
    if (autoFocus === false) return
    window.requestAnimationFrame(() => {
      focusLayerTarget(sheetRef.current, autoFocus, "sheet-title")
    })
  }
  const handleCloseAutoFocus = (event: Event) => {
    props.onCloseAutoFocus?.(event)
    if (event.defaultPrevented) return
    if (!restoreFocusOnClose) {
      event.preventDefault()
      return
    }
    if (restoreFocusRef?.current) {
      event.preventDefault()
      restoreFocusRef.current.focus()
    }
  }
  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    props.onEscapeKeyDown?.(event)
    if (!closeOnEsc) event.preventDefault()
  }

  const setDrag = React.useCallback((v: number) => {
    dragDistRef.current = v
    setDragDist(v)
  }, [])

  const beginGesture = React.useCallback(
    (clientX: number, clientY: number, _target: EventTarget | null, t: number) => {
      startXRef.current = clientX
      startYRef.current = clientY
      decisionRef.current = null
      draggingRef.current = false
      samplesRef.current = [{ y: 0, t }]
    },
    []
  )

  // Returns true once the gesture is claimed as a close-drag (caller should
  // preventDefault() for touch so the browser stops any horizontal panning).
  const moveGesture = React.useCallback(
    (clientX: number, clientY: number, t: number): boolean => {
      if (decisionRef.current === "scroll") return false
      const dx = clientX - startXRef.current
      const dy = clientY - startYRef.current
      const { primary, cross } = projectCloseAxisDelta(dx, dy, side)
      if (decisionRef.current === null) {
        // atStart=true: a horizontal close-drag never competes with the body's
        // vertical scroll, so there is no scroll-position gate to apply.
        const decision = decideSwipeGesture(primary, cross, true)
        if (decision === null) return false // below slop — keep waiting
        decisionRef.current = decision
        if (decision === "drag") {
          draggingRef.current = true
          setEverDragged(true)
          setDragging(true)
        } else {
          return false
        }
      }
      if (draggingRef.current) {
        const s = samplesRef.current
        s.push({ y: primary, t })
        if (s.length > 12) s.shift()
        // Close direction only — pulling the drawer further open is clamped at 0.
        setDrag(Math.max(0, primary))
        return true
      }
      return false
    },
    [side, setDrag]
  )

  const endGesture = React.useCallback((t: number) => {
    const wasDragging = draggingRef.current
    draggingRef.current = false
    decisionRef.current = null
    if (!wasDragging) return
    setDragging(false)
    // Close-axis size (width) drives the 30% distance threshold.
    const w = sheetRef.current?.offsetWidth ?? 0
    const velocity = computeFlickVelocity(samplesRef.current, t)
    samplesRef.current = []
    if (decideSwipeDismiss(dragDistRef.current, w, velocity)) {
      rootCtxRef.current?.close()
    }
    setDrag(0)
  }, [setDrag])

  const detachTouchRef = React.useRef<(() => void) | null>(null)
  const attachTouchListeners = React.useCallback(
    (el: HTMLDivElement | null) => {
      sheetRef.current = el
      // #485: ノードが DOM に現れたその瞬間に aria-describedby を確定させる
      // （初期フォーカス前に紐付けたいので effect まで待たない）。
      applyDescribedBy()
      detachTouchRef.current?.()
      detachTouchRef.current = null
      if (!el) return
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) return
        const t = e.touches[0]
        beginGesture(t.clientX, t.clientY, e.target, e.timeStamp)
      }
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length !== 1) return
        const t = e.touches[0]
        if (moveGesture(t.clientX, t.clientY, e.timeStamp)) e.preventDefault()
      }
      const onTouchEnd = (e: TouchEvent) => endGesture(e.timeStamp)
      el.addEventListener("touchstart", onTouchStart, { passive: true })
      el.addEventListener("touchmove", onTouchMove, { passive: false })
      el.addEventListener("touchend", onTouchEnd, { passive: true })
      el.addEventListener("touchcancel", onTouchEnd, { passive: true })
      detachTouchRef.current = () => {
        el.removeEventListener("touchstart", onTouchStart)
        el.removeEventListener("touchmove", onTouchMove)
        el.removeEventListener("touchend", onTouchEnd)
        el.removeEventListener("touchcancel", onTouchEnd)
      }
    },
    [beginGesture, moveGesture, endGesture, applyDescribedBy]
  )

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return
    if (e.button != null && e.button !== 0) return
    beginGesture(e.clientX, e.clientY, e.target, e.timeStamp)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return
    if (e.buttons === 0) return
    if (moveGesture(e.clientX, e.clientY, e.timeStamp)) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // setPointerCapture は未対応環境で例外を投げるため無視
      }
    }
  }
  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return
    endGesture(e.timeStamp)
  }

  return (
    <SheetPortal container={container}>
      <SheetOverlay glass={glassOverlay} className={overlayClassName} stackLevel={stackLevel} />
      <DialogPrimitive.Content
        ref={attachTouchListeners}
        data-side={side}
        className={cn(
          sheetVariants({ side }),
          // Block horizontal overscroll (e.g. browser back-swipe) so the
          // close-drag owns the horizontal axis; the body still scrolls
          // vertically.
          "overscroll-x-none",
          padding && "p-6",
          className,
        )}
        style={{
          ...style,
          transform: `translate3d(${closeAxisTranslate(dragDist, side)}px, 0, 0)`,
          transition: dragging || !everDragged
            ? "none"
            : "transform var(--Motion-Duration-Sheet-Settle) var(--Motion-Easing-Emphasized)",
          willChange: "transform",
          zIndex: contentZIndex,
        }}
        {...contentProps}
        // data-slot は spread より後ろに置く（#339）。前に置くと consumer が
        // data-slot を渡したときに上書きでき、styles/sheet-keyboard.css の
        // `[data-slot="sheet-content"]` 系のルールが丸ごと外れる。
        data-slot="sheet-content"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        {...(!hasInternalDesc && { "aria-describedby": ariaDescribedBy })}
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
        onEscapeKeyDown={handleEscapeKeyDown}
      >
        {onStackLevelChange && (
          <ModalStackRegistrar onLevelChange={onStackLevelChange} />
        )}
        <DescribedByLinker contentRef={sheetRef} applyDescribedBy={applyDescribedBy} />
        {hasInternalDesc && (
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}
        {children}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

// ============================================================================
// Snap-mode bottom sheet
// ----------------------------------------------------------------------------
// - Height is fixed to `maxSnap * 100svh`
// - translateY = (maxSnap - activeRatio) / maxSnap * 100%
// - Drag on the indicator (and the top header row) moves the sheet
// - On release, snap to nearest point; if past min*0.5 and dismissible, close
// ============================================================================

interface SnapBottomSheetContentProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "autoFocus"> {
  snapCtx: SheetSnapContextValue
  className?: string
  glassOverlay?: boolean
  /** #158: overlay 要素への追加 className（escape hatch）。 */
  overlayClassName?: string
  /** #158: グローバル open-sheet スタックでの深度（0=最初に開いたシート）。 */
  stackLevel?: number
  /** #166: stackLevel の変更を親（SheetContent）へ伝える。Registrar 用。 */
  onStackLevelChange?: (level: number) => void
  /** #158: このシートの content z-index（自動算出 or zIndex prop で上書き済みの値）。 */
  contentZIndex?: number
  container?: HTMLElement | null
  description?: React.ReactNode
  autoFocus?: LayerAutoFocusTarget
  restoreFocusOnClose?: boolean
  closeOnEsc?: boolean
  restoreFocusRef?: React.RefObject<HTMLElement | null>
  children?: React.ReactNode
}

function SnapBottomSheetContent({
  snapCtx,
  className,
  glassOverlay,
  overlayClassName,
  stackLevel,
  onStackLevelChange,
  contentZIndex,
  container,
  description,
  autoFocus,
  restoreFocusOnClose = true,
  closeOnEsc = true,
  restoreFocusRef,
  children,
  style,
  ...props
}: SnapBottomSheetContentProps) {
  const hasInternalDesc = description != null && description !== false
  const {
    "aria-describedby": ariaDescribedBy,
    ...contentProps
  } = props
  const {
    snapRatios,
    activeSnapPoint,
    setActiveSnapPoint,
    dismissible,
    close,
    snapPoints,
    fadeFromIndex,
    overlay,
  } = snapCtx

  const maxSnap = React.useMemo(
    () => (snapRatios.length > 0 ? Math.max(...snapRatios) : 0.9),
    [snapRatios]
  )
  const minSnap = React.useMemo(
    () => (snapRatios.length > 0 ? Math.min(...snapRatios) : 0.4),
    [snapRatios]
  )
  const activeRatio = React.useMemo(() => {
    if (activeSnapPoint == null) return maxSnap
    return snapToRatio(activeSnapPoint)
  }, [activeSnapPoint, maxSnap])

  // Drag tracking — we update activeSnapPoint continuously during drag so
  // any parent listening (e.g. a video container that resizes to share the
  // viewport with the sheet) can stay in sync without waiting for release.
  const [dragging, setDragging] = React.useState(false)
  const dragStartYRef = React.useRef(0)
  const dragStartRatioRef = React.useRef(activeRatio)
  const sheetRef = React.useRef<HTMLDivElement>(null)
  const { setContentNode, applyDescribedBy } = useDescribedByLink(
    sheetRef,
    "sheet-description",
    !hasInternalDesc && ariaDescribedBy == null
  )
  const handleOpenAutoFocus = (event: Event) => {
    captureRestoreFocus(restoreFocusRef)
    props.onOpenAutoFocus?.(event)
    if (event.defaultPrevented || autoFocus == null) return
    event.preventDefault()
    if (autoFocus === false) return
    window.requestAnimationFrame(() => {
      focusLayerTarget(sheetRef.current, autoFocus, "sheet-title")
    })
  }
  const handleCloseAutoFocus = (event: Event) => {
    props.onCloseAutoFocus?.(event)
    if (event.defaultPrevented) return
    if (!restoreFocusOnClose) {
      event.preventDefault()
      return
    }
    if (restoreFocusRef?.current) {
      event.preventDefault()
      restoreFocusRef.current.focus()
    }
  }
  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    props.onEscapeKeyDown?.(event)
    if (!closeOnEsc) event.preventDefault()
  }

  // translateY is purely a function of activeRatio, so during drag we just
  // push activeSnapPoint and let the render pipeline place the sheet.
  const baseTranslatePct = ((maxSnap - activeRatio) / maxSnap) * 100

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only respond to primary pointer (touch / left mouse)
    if (e.button != null && e.button !== 0) return
    setDragging(true)
    dragStartYRef.current = e.clientY
    dragStartRatioRef.current = activeRatio
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // setPointerCapture は未対応環境で例外を投げるため無視
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    const dy = e.clientY - dragStartYRef.current
    const vh = typeof window === "undefined" ? 1 : window.innerHeight
    // dragging down = bigger dy = smaller visible portion
    const newRatio = Math.max(
      0,
      Math.min(maxSnap, dragStartRatioRef.current - dy / vh)
    )
    setActiveSnapPoint(newRatio)
  }

  const finishDrag = (_e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragging(false)

    const newRatio = activeRatio

    // Dismiss if dragged well below the lowest snap
    if (dismissible && newRatio < minSnap * 0.5) {
      close()
      return
    }

    // Snap to the nearest snap point
    let bestIdx = 0
    let bestDist = Math.abs(newRatio - snapRatios[0])
    for (let i = 1; i < snapRatios.length; i++) {
      const d = Math.abs(newRatio - snapRatios[i])
      if (d < bestDist) {
        bestDist = d
        bestIdx = i
      }
    }
    setActiveSnapPoint(snapPoints[bestIdx])
  }

  // Overlay opacity tracks the active snap: lowest = transparent (or
  // fadeFromIndex baseline) and goes up to full at max snap.
  const overlayOpacity = React.useMemo(() => {
    if (snapRatios.length === 0) return 1
    const fadeStart = snapRatios[Math.min(fadeFromIndex, snapRatios.length - 1)]
    if (activeRatio <= fadeStart) return 0
    if (maxSnap <= fadeStart) return 1
    return Math.min(1, (activeRatio - fadeStart) / (maxSnap - fadeStart))
  }, [snapRatios, fadeFromIndex, activeRatio, maxSnap])

  const transform = `translate3d(0, ${baseTranslatePct}%, 0)`

  // Optional ↑/↓ keyboard navigation between snaps when the sheet has focus
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return
    const currentIdx = snapRatios.findIndex((r) => r === activeRatio)
    if (currentIdx === -1) return
    const next =
      e.key === "ArrowUp"
        ? Math.min(snapRatios.length - 1, currentIdx + 1)
        : Math.max(0, currentIdx - 1)
    if (next !== currentIdx) {
      e.preventDefault()
      setActiveSnapPoint(snapPoints[next])
    }
  }

  return (
    <SheetPortal container={container}>
      {overlay && (
        <SheetOverlay
          glass={glassOverlay}
          opacity={overlayOpacity}
          className={overlayClassName}
          stackLevel={stackLevel}
        />
      )}
      <DialogPrimitive.Content
        ref={setContentNode}
        data-side="bottom"
        data-snap-active={activeSnapPoint ?? undefined}
        onKeyDown={onKeyDown}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[var(--Z-Modal)] flex flex-col",
          "bg-[var(--Surface-Primary)] rounded-t-[var(--Radius-Sheet)] shadow-[var(--shadow-dialog)]",
          // Suppress Radix open/close fade — we manage transform ourselves
          "data-[state=open]:animate-none data-[state=closed]:animate-none",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
          className
        )}
        style={{
          ...style,
          height: `${maxSnap * 100}svh`,
          transform,
          transition: dragging
            ? "none"
            : "transform var(--Motion-Duration-Sheet-Enter) var(--Motion-Easing-Emphasized)",
          willChange: "transform",
          touchAction: "none",
          zIndex: contentZIndex,
        }}
        {...contentProps}
        // data-slot は spread より後ろに置く（#339）。前に置くと consumer が
        // data-slot を渡したときに上書きでき、styles/sheet-keyboard.css の
        // `[data-slot="sheet-content"]` 系のルールが丸ごと外れる。
        data-slot="sheet-content"
        {...(!hasInternalDesc && { "aria-describedby": ariaDescribedBy })}
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
        onEscapeKeyDown={handleEscapeKeyDown}
      >
        {onStackLevelChange && (
          <ModalStackRegistrar onLevelChange={onStackLevelChange} />
        )}
        <DescribedByLinker contentRef={sheetRef} applyDescribedBy={applyDescribedBy} />
        {hasInternalDesc && (
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}
        {/* Drag handle row — pointer events here drive the snap drag */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          className="cursor-grab active:cursor-grabbing select-none"
        >
          <SheetDragIndicator />
        </div>
        {/*
          Inner content scrolls within the *visible* slice — not the full
          90svh shell. Otherwise at low snaps the scroll area extends below
          the viewport and the user can't scroll to the actual bottom of
          their content (rows ~18-20 in the snap story).
          We subtract a small allowance for the drag indicator row (~22px).
        */}
        <div
          className="flex-1 min-h-0 overflow-y-auto"
          style={{
            maxHeight: `calc(${activeRatio * 100}svh - 22px)`,
            transition: dragging
              ? "none"
              : "max-height var(--Motion-Duration-Sheet-Enter) var(--Motion-Easing-Emphasized)",
          }}
        >
          {children}
        </div>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-2", className)} {...props} />
}

function SheetFooter({
  className,
  orientation = "split",
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * アクションボタンの並べ方。
   * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。2 ボタンを 50/50 で
   *   並べる iOS のボトムシート風レイアウト。
   * - "stacked": 旧挙動。縦積み（全幅）。
   */
  orientation?: "split" | "stacked"
}) {
  return (
    <div
      data-slot="sheet-footer"
      data-orientation={orientation}
      className={cn(
        orientation === "stacked"
          ? "flex flex-col gap-2 mt-auto"
          : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0 mt-auto",
        className
      )}
      {...props}
    />
  )
}

interface SheetTitleProps
  extends React.ComponentProps<typeof DialogPrimitive.Title> {
  /**
   * 見出しの役割（#341）。`contracts/composition.json` の `textHierarchy.tree`
   * と 1 対 1 で対応する:
   * - "page":    画面タイトル / H1 → `typo-heading-2xl`
   * - "section": セクション見出し / H2 → `typo-heading-xl`
   * - "card":    カード見出し / H3 → `typo-heading-md`
   *
   * 未指定時はサーフェスの文脈から決まる。全画面級の
   * `BottomSheetFrame preset="mobile-full" | "mobile-page"` の配下では "page"
   * 相当（`typo-heading-2xl`）、それ以外の部分表示シートでは従来どおり
   * `typo-heading-lg`。明示した level は常に文脈より優先される。
   */
  level?: TitleLevel
}

function SheetTitle({ className, level, ...props }: SheetTitleProps) {
  const typoClass = useTitleTypoClass(level)
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      data-level={level}
      className={cn(
        typoClass,
        "text-[var(--Text-High-Emphasis)]",
        "focus:outline-none focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="sheet-description" className={cn("typo-body-md text-[var(--Text-Medium-Emphasis)]", className)} {...props} />
}

export {
  Sheet, SheetTrigger, SheetClose, SheetContent,
  SheetHeader, SheetFooter, SheetTitle, SheetDescription,
  SheetDragIndicator,
  // Exported for unit testing only — not part of the public package API
  // (src/index.ts re-exports a curated list only).
  computeVisualViewportInset,
  resolveBottomSheetKeyboardStyle,
  resolveFloatSheetKeyboardStyle,
  decideSwipeGesture,
  computeFlickVelocity,
  decideSwipeDismiss,
  projectCloseAxisDelta,
  closeAxisTranslate,
}
export type { SheetProps, SheetContentProps, SheetTitleProps, SnapPoint, VisualViewportInset }
