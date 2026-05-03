import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
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
}

function SheetOverlay({ className, glass = false, ...props }: SheetOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50",
        glass
          ? "glass-overlay"
          : "bg-black/40",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-200",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150",
        className
      )}
      {...props}
    />
  )
}

/** ドラッグインジケーター（Apple HIG: 36×5pt, gray, centered） */
function SheetDragIndicator() {
  return (
    <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
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
          "inset-x-0 bottom-0 rounded-t-[20px]",
          "bg-[var(--Surface-Primary)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-200",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150",
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
          "inset-x-3 bottom-3 rounded-[20px] max-w-lg mx-auto",
          "bg-[var(--Surface-Primary)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-200",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150",
        ].join(" "),
        /**
         * Liquid Glass フローティングシート
         * 背景が透けるガラス素材。写真・グラデーション上での
         * アクション確認シートに最適。
         */
        "float-glass": [
          "inset-x-3 bottom-3 rounded-[20px] max-w-lg mx-auto",
          "glass glass-specular",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-200",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150",
        ].join(" "),
        /**
         * Liquid Glass ボトムシート
         * 下から全幅で出るガラス素材シート。
         */
        "bottom-glass": [
          "inset-x-0 bottom-0 rounded-t-[20px]",
          "glass-strong",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-200",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150",
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
}

function SheetContent({
  className,
  children,
  side = "right",
  glassOverlay,
  ...props
}: SheetContentProps) {
  const hasIndicator = side === "bottom" || side === "float" || side === "float-glass" || side === "bottom-glass"
  const useGlassOverlay = glassOverlay ?? glassSides.has(side as string)

  return (
    <SheetPortal>
      <SheetOverlay glass={useGlassOverlay} />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(sheetVariants({ side }), "p-6", className)}
        {...props}
      >
        {hasIndicator && <SheetDragIndicator />}
        {children}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-2", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("flex flex-col gap-2 mt-auto", className)} {...props} />
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
}
