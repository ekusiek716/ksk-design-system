import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
type LayerAutoFocusTarget = "first-input" | "title" | React.RefObject<HTMLElement | null> | false;
type SnapPoint = number | string;
interface VisualViewportInset {
    keyboardInset: number;
    visibleHeight: number | null;
}
declare function computeVisualViewportInset(layoutHeight: number, visualHeight: number, visualOffsetTop: number): VisualViewportInset;
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
declare function decideSwipeGesture(dy: number, dx: number, atTop: boolean): "drag" | "scroll" | null;
/**
 * A single drag sample: vertical position (`y`, px) at a moment in time
 * (`t`, ms — any monotonic clock; `event.timeStamp` in practice).
 */
interface DragSample {
    y: number;
    t: number;
}
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
declare function computeFlickVelocity(samples: DragSample[], releaseT: number, windowMs?: number): number;
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
declare function decideSwipeDismiss(dragY: number, sheetHeight: number, velocity: number): boolean;
interface SheetProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    snapPoints?: SnapPoint[];
    activeSnapPoint?: SnapPoint | null;
    setActiveSnapPoint?: (s: SnapPoint | null) => void;
    /** index in `snapPoints` from which the backdrop overlay starts to fade in */
    fadeFromIndex?: number;
    dismissible?: boolean;
    /**
     * When false, the backdrop overlay is not rendered. Use for "push-up"
     * layouts where the sheet shares the viewport with other UI (e.g. a
     * video that resizes as the sheet expands).
     * Default: true.
     */
    overlay?: boolean;
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
}
declare function Sheet({ snapPoints, activeSnapPoint: activeSnapPointProp, setActiveSnapPoint: setActiveSnapPointProp, fadeFromIndex, dismissible, overlay, onOpenChange, open, defaultOpen, ...props }: SheetProps): import("react/jsx-runtime").JSX.Element;
declare function SheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function SheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): import("react/jsx-runtime").JSX.Element;
/** ドラッグインジケーター（Apple HIG: 36×5pt, gray, centered） */
declare function SheetDragIndicator(): import("react/jsx-runtime").JSX.Element;
declare const sheetVariants: (props?: {
    side?: "top" | "left" | "right" | "bottom" | "float" | "float-glass" | "bottom-glass";
} & import("class-variance-authority/types").ClassProp) => string;
interface SheetContentProps extends Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "autoFocus">, VariantProps<typeof sheetVariants> {
    /** オーバーレイをガラス調にする（glass系 side では自動で true） */
    glassOverlay?: boolean;
    /**
     * Portal target element. When provided, the sheet portals into this element
     * instead of document.body. Useful for inheriting CSS transforms (e.g. forced
     * landscape rotation in mobile apps). Defaults to document.body if omitted.
     */
    container?: HTMLElement | null;
    /**
     * シートのデフォルト内側余白（p-6）を制御。
     * - true（既定）: p-6 を付与（従来通り）
     * - false       : p-0。スクロール領域＋固定フッタなど自前で内側レイアウトを
     *                 組むときに使用。これまで padding を強制上書きしていた
     *                 ケースを正規化する。
     */
    padding?: boolean;
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
    swipeToClose?: boolean;
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
    description?: React.ReactNode;
    /**
     * open 時の初期フォーカス。未指定時は Radix の既定挙動。
     * - "first-input": 最初の入力/操作可能要素
     * - "title": SheetTitle
     * - ref: 任意要素
     * - false: 自動フォーカスを抑制
     */
    autoFocus?: LayerAutoFocusTarget;
    /** close 後に open 前の要素へ focus を戻す。既定 true。 */
    restoreFocusOnClose?: boolean;
    /** Esc キーで閉じる。既定 true。 */
    closeOnEsc?: boolean;
    /** Sheet 表示中に body scroll を抑止する。既定 true。 */
    bodyScrollLock?: boolean;
}
declare function SheetContent({ className, children, side, glassOverlay, container, padding, swipeToClose, description, autoFocus, restoreFocusOnClose, closeOnEsc, bodyScrollLock, ...props }: SheetContentProps): import("react/jsx-runtime").JSX.Element;
declare function SheetHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function SheetFooter({ className, orientation, ...props }: React.ComponentProps<"div"> & {
    /**
     * アクションボタンの並べ方。
     * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。2 ボタンを 50/50 で
     *   並べる iOS のボトムシート風レイアウト。
     * - "stacked": 旧挙動。縦積み（全幅）。
     */
    orientation?: "split" | "stacked";
}): import("react/jsx-runtime").JSX.Element;
declare function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): import("react/jsx-runtime").JSX.Element;
declare function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetDragIndicator, computeVisualViewportInset, decideSwipeGesture, computeFlickVelocity, decideSwipeDismiss, };
export type { SheetProps, SheetContentProps, SnapPoint, VisualViewportInset };
