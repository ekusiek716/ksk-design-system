import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

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
  ...props
}: SheetProps) {
  const snapRatios = React.useMemo(
    () => (snapPoints ?? []).map(snapToRatio),
    [snapPoints]
  )

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

  // For uncontrolled snap state only: when the sheet opens we reset to the
  // *lowest* snap (the most common "default open" expectation: peek state).
  // Controlled callers own the initial value via `activeSnapPoint` so we
  // never override their choice.
  React.useEffect(() => {
    if (open && !isControlledSnap && snapPoints && snapPoints.length > 0) {
      setInternalSnap(snapPoints[0])
    }
    // We intentionally only react to `open` flipping true here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      // Same logic on close: only reset our internal state if we own it.
      if (!next && !isControlledSnap && snapPoints && snapPoints.length > 0) {
        setInternalSnap(snapPoints[0])
      }
      onOpenChange?.(next)
    },
    [onOpenChange, snapPoints, isControlledSnap]
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
          open={open}
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

function SheetPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />
}

interface SheetOverlayProps extends React.ComponentProps<typeof DialogPrimitive.Overlay> {
  /**
   * true: Liquid Glass オーバーレイ
   * （真っ暗なスクリムの代わりに軽いすりガラス風）
   */
  glass?: boolean
  /** 0..1 — controlled opacity for snap-mode overlays */
  opacity?: number
}

function SheetOverlay({
  className,
  glass = false,
  opacity,
  style,
  ...props
}: SheetOverlayProps) {
  const controlled = opacity != null
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // Overlay sits *under* SheetContent (z-50). Using z-40 prevents
        // the glass scrim from covering the sheet content.
        "fixed inset-0 z-40",
        // For "glass" sheets, the sheet itself provides the frosted-glass
        // visual via its own backdrop-filter. Doubling that with a blurred
        // overlay washes out the sheet completely. Use a subtle dark scrim
        // (no backdrop blur) instead — the glass sheet on top reads clearly.
        glass ? "bg-black/30" : "bg-black/40",
        // When opacity is not controlled, fall back to a simple opacity
        // transition (no fade-in-0 keyframes which can leave the layer
        // permanently at opacity 0 in some Tailwind / animate plugin combos).
        !controlled && "transition-opacity duration-200",
        className
      )}
      style={controlled ? { ...style, opacity } : style}
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
  "fixed z-50 shadow-[var(--shadow-dialog)] transition ease-in-out",
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 border-b border-[var(--Border-Low-Emphasis)]",
          "bg-[var(--Surface-Primary)]",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-top data-[state=open]:duration-200",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=closed]:duration-150",
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
        ].join(" "),
        /**
         * Liquid Glass フローティングシート
         * 背景が透けるガラス素材。写真・グラデーション上での
         * アクション確認シートに最適。
         */
        "float-glass": [
          "inset-x-3 bottom-3 rounded-[var(--Radius-Sheet)] max-w-lg mx-auto",
          "glass glass-specular",
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
  extends React.ComponentProps<typeof DialogPrimitive.Content>,
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
   *                 組むときに使用。これまで `className="!p-0"` で潰していた
   *                 ケースを正規化する。
   */
  padding?: boolean
  /**
   * Bottom-anchored sheets only (`side="bottom"` / `"bottom-glass"`). When true,
   * <SheetDragIndicator /> is auto-rendered at the top and a downward swipe
   * dragging past ~30% of the sheet height calls onOpenChange(false).
   *
   * The swipe works across the whole sheet surface, not just the indicator:
   * a downward drag dismisses when it starts on the handle, or while the
   * touched scroll region is at its top. Mid-scroll and horizontal gestures
   * stay with the content, so it never hijacks scrolling.
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
   * `<SheetDescription>` を直接置く。
   */
  description?: React.ReactNode
}

const swipeSides = new Set(["bottom", "bottom-glass"])

function SheetContent({
  className,
  children,
  side = "right",
  glassOverlay,
  container,
  padding = true,
  swipeToClose,
  description,
  ...props
}: SheetContentProps) {
  const autoDescId = React.useId()
  const hasInternalDesc = description != null && description !== false
  const ariaDescribedBy = hasInternalDesc ? autoDescId : props["aria-describedby"]
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

  // Snap mode kicks in only for `side="bottom"` when the parent Sheet was
  // given `snapPoints`. Other sides ignore snap entirely (per spec).
  if (snapCtx && side === "bottom") {
    return (
      <SnapBottomSheetContent
        snapCtx={snapCtx}
        className={className}
        glassOverlay={useGlassOverlay}
        container={container}
        description={description}
        {...props}
      >
        {children}
      </SnapBottomSheetContent>
    )
  }

  if (swipeToClose && swipeSides.has(side as string)) {
    return (
      <SwipeToCloseBottomSheet
        side={side as "bottom" | "bottom-glass"}
        className={className}
        glassOverlay={useGlassOverlay}
        container={container}
        padding={padding}
        description={description}
        {...props}
      >
        {children}
      </SwipeToCloseBottomSheet>
    )
  }

  // Bottom-anchored sheets (`bottom` / `bottom-glass`) share the same
  // keyboard-overlap problem as the swipeToClose path: while the keyboard is
  // open, lift the sheet above it and cap its height to the visible region,
  // overriding the variant's `bottom-0` / `max-h-[90dvh]`.
  const isBottomAnchored = side === "bottom" || side === "bottom-glass"
  const keyboardStyle =
    isBottomAnchored && keyboardInset > 0
      ? { bottom: keyboardInset, maxHeight: visibleHeight ?? undefined }
      : undefined

  return (
    <SheetPortal container={container}>
      <SheetOverlay glass={useGlassOverlay} />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(sheetVariants({ side }), padding && "p-6", className)}
        {...props}
        style={keyboardStyle ? { ...props.style, ...keyboardStyle } : props.style}
        aria-describedby={ariaDescribedBy}
      >
        {hasInternalDesc && (
          <DialogPrimitive.Description id={autoDescId} className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}
        {children}
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
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  side: "bottom" | "bottom-glass"
  className?: string
  glassOverlay?: boolean
  container?: HTMLElement | null
  padding?: boolean
  description?: React.ReactNode
  children?: React.ReactNode
}

function SwipeToCloseBottomSheet({
  side,
  className,
  glassOverlay,
  container,
  padding = true,
  description,
  children,
  style,
  ...props
}: SwipeToCloseBottomSheetProps) {
  const autoDescId = React.useId()
  const hasInternalDesc = description != null && description !== false
  const ariaDescribedBy = hasInternalDesc ? autoDescId : props["aria-describedby"]
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
  const scrollerRef = React.useRef<HTMLElement | null>(null)
  const onHandleRef = React.useRef(false)
  const sheetRef = React.useRef<HTMLDivElement>(null)
  // Keep the sheet inside the region above the on-screen keyboard so its top
  // edge (title / drag handle) never scrolls off the top of the viewport.
  const { keyboardInset, visibleHeight } = useVisualViewportInset()

  // While a close-drag is committed, block the browser's own touch scrolling so
  // it doesn't fight our transform. Pointer-event preventDefault is unreliable
  // for this on iOS; a non-passive touchmove listener is the robust way.
  React.useEffect(() => {
    const el = sheetRef.current
    if (!el) return
    const blockScroll = (e: TouchEvent) => {
      if (draggingRef.current) e.preventDefault()
    }
    el.addEventListener("touchmove", blockScroll, { passive: false })
    return () => el.removeEventListener("touchmove", blockScroll)
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button != null && e.button !== 0) return
    startYRef.current = e.clientY
    startXRef.current = e.clientX
    decisionRef.current = null
    draggingRef.current = false
    // The drag indicator is always a valid grab target regardless of scroll
    // position; elsewhere the gesture must start at the top of the content.
    onHandleRef.current =
      e.target instanceof HTMLElement &&
      e.target.closest("[data-sheet-drag-handle]") != null
    scrollerRef.current = findScrollableAncestor(e.target, sheetRef.current)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (decisionRef.current === "scroll") return
    const dy = e.clientY - startYRef.current
    const dx = e.clientX - startXRef.current
    if (decisionRef.current === null) {
      // Wait until the gesture shows clear intent before claiming it.
      if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return
      // Start a close-drag only on a downward, vertical-dominant gesture that
      // begins while the touched scroll region is at its top (or on the drag
      // handle). Anything else is the content's gesture (scroll / horizontal).
      const atTop =
        onHandleRef.current ||
        !scrollerRef.current ||
        scrollerRef.current.scrollTop <= 0
      if (dy > 0 && dy > Math.abs(dx) && atTop) {
        decisionRef.current = "drag"
        draggingRef.current = true
        setEverDragged(true)
        setDragging(true)
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          // setPointerCapture は未対応環境で例外を投げるため無視
        }
      } else {
        decisionRef.current = "scroll"
        return
      }
    }
    if (draggingRef.current) {
      // Downward only — upward drags are clamped at 0 (matches snap-mode
      // clamping at maxSnap; no rubber-band for consistency).
      setDragY(Math.max(0, dy))
    }
  }

  const finishDrag = () => {
    const wasDragging = draggingRef.current
    draggingRef.current = false
    decisionRef.current = null
    if (!wasDragging) return
    setDragging(false)
    const h = sheetRef.current?.offsetHeight ?? 0
    const threshold = h > 0 ? h * 0.3 : 200
    if (dragY > threshold) {
      rootCtx?.close()
    }
    // Always spring back. If close succeeded the sheet unmounts and this
    // is a no-op visually; if it didn't (controlled parent kept open) the
    // sheet returns to its rest position.
    setDragY(0)
  }

  return (
    <SheetPortal container={container}>
      <SheetOverlay glass={glassOverlay} />
      <DialogPrimitive.Content
        ref={sheetRef}
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          sheetVariants({ side }),
          // swipeToClose mode: 高さに制約がないと viewport より高いシートの
          // top (タイトル / ドラッグハンドル) が画面外にはみ出すため
          // 自動で max-h-[90dvh] + overflow-y-auto を付与。
          // snap mode は activeSnapPoint で高さ制御するので別途。
          // overscroll-y-contain: 先頭での引き下げ時にブラウザの overscroll
          // (ラバーバンド/スクロール連鎖) が close-drag と競合しないよう抑制。
          "max-h-[90dvh] overflow-y-auto overscroll-y-contain",
          padding && "p-6",
          className,
        )}
        style={{
          ...style,
          // While the keyboard is open, lift the sheet above it (bottom) and
          // cap its height to the visible region (maxHeight). These inline
          // values override the variant's `bottom-0` / `max-h-[90dvh]`. When no
          // keyboard is present both are inert and the CSS defaults apply.
          ...(keyboardInset > 0
            ? { bottom: keyboardInset, maxHeight: visibleHeight ?? undefined }
            : null),
          transform: `translate3d(0, ${dragY}px, 0)`,
          transition: dragging || !everDragged
            ? "none"
            : "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
        {...props}
        // Full-surface swipe-to-close: handlers live on the content root so a
        // downward swipe anywhere can dismiss. onPointerMove gates on scroll
        // position so it never steals the content's own scroll gesture.
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        aria-describedby={ariaDescribedBy}
      >
        {hasInternalDesc && (
          <DialogPrimitive.Description id={autoDescId} className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}
        <div
          data-sheet-drag-handle
          className={cn(
            "cursor-grab active:cursor-grabbing select-none",
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
// Snap-mode bottom sheet
// ----------------------------------------------------------------------------
// - Height is fixed to `maxSnap * 100svh`
// - translateY = (maxSnap - activeRatio) / maxSnap * 100%
// - Drag on the indicator (and the top header row) moves the sheet
// - On release, snap to nearest point; if past min*0.5 and dismissible, close
// ============================================================================

interface SnapBottomSheetContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  snapCtx: SheetSnapContextValue
  className?: string
  glassOverlay?: boolean
  container?: HTMLElement | null
  description?: React.ReactNode
  children?: React.ReactNode
}

function SnapBottomSheetContent({
  snapCtx,
  className,
  glassOverlay,
  container,
  description,
  children,
  style,
  ...props
}: SnapBottomSheetContentProps) {
  const autoDescId = React.useId()
  const hasInternalDesc = description != null && description !== false
  const ariaDescribedBy = hasInternalDesc ? autoDescId : props["aria-describedby"]
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
        <SheetOverlay glass={glassOverlay} opacity={overlayOpacity} />
      )}
      <DialogPrimitive.Content
        ref={sheetRef}
        data-slot="sheet-content"
        data-side="bottom"
        data-snap-active={activeSnapPoint ?? undefined}
        onKeyDown={onKeyDown}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex flex-col",
          "bg-[var(--Surface-Primary)] rounded-t-[var(--Radius-Sheet)] shadow-[var(--shadow-dialog)]",
          // Suppress Radix open/close fade — we manage transform ourselves
          "data-[state=open]:animate-none data-[state=closed]:animate-none",
          "outline-none",
          className
        )}
        style={{
          ...style,
          height: `${maxSnap * 100}svh`,
          transform,
          transition: dragging
            ? "none"
            : "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
          touchAction: "none",
        }}
        {...props}
        aria-describedby={ariaDescribedBy}
      >
        {hasInternalDesc && (
          <DialogPrimitive.Description id={autoDescId} className="sr-only">
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
              : "max-height 320ms cubic-bezier(0.32, 0.72, 0, 1)",
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

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="sheet-title" className={cn("typo-heading-lg text-[var(--Text-High-Emphasis)]", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="sheet-description" className={cn("typo-body-md text-[var(--Text-Medium-Emphasis)]", className)} {...props} />
}

export {
  Sheet, SheetTrigger, SheetClose, SheetContent,
  SheetHeader, SheetFooter, SheetTitle, SheetDescription,
  SheetDragIndicator,
  // Exported for unit testing of the on-screen-keyboard inset math. Not part of
  // the public package API (src/index.ts re-exports a curated list only).
  computeVisualViewportInset,
}
export type { SheetProps, SheetContentProps, SnapPoint, VisualViewportInset }
