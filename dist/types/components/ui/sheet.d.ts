import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
type SnapPoint = number | string;
interface VisualViewportInset {
    keyboardInset: number;
    visibleHeight: number | null;
}
declare function computeVisualViewportInset(layoutHeight: number, visualHeight: number, visualOffsetTop: number): VisualViewportInset;
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
}
declare function Sheet({ snapPoints, activeSnapPoint: activeSnapPointProp, setActiveSnapPoint: setActiveSnapPointProp, fadeFromIndex, dismissible, overlay, onOpenChange, open, ...props }: SheetProps): import("react/jsx-runtime").JSX.Element;
declare function SheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function SheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): import("react/jsx-runtime").JSX.Element;
/** ドラッグインジケーター（Apple HIG: 36×5pt, gray, centered） */
declare function SheetDragIndicator(): import("react/jsx-runtime").JSX.Element;
declare const sheetVariants: (props?: {
    side?: "top" | "left" | "right" | "bottom" | "float" | "float-glass" | "bottom-glass";
} & import("class-variance-authority/types").ClassProp) => string;
interface SheetContentProps extends React.ComponentProps<typeof DialogPrimitive.Content>, VariantProps<typeof sheetVariants> {
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
     *                 組むときに使用。これまで `className="!p-0"` で潰していた
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
}
declare function SheetContent({ className, children, side, glassOverlay, container, padding, swipeToClose, description, ...props }: SheetContentProps): import("react/jsx-runtime").JSX.Element;
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
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetDragIndicator, computeVisualViewportInset, };
export type { SheetProps, SheetContentProps, SnapPoint, VisualViewportInset };
