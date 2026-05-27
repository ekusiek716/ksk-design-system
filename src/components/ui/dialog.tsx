import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[var(--Overlay-Dark)]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

interface DialogContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  /**
   * デフォルトの内側余白（p-6）を制御。
   * - true（既定）: p-6 を付与（従来通り）
   * - false       : p-0。タブ/スクロール本体/フッタの3段構成など、
   *                 ヘッダ/本文/フッタを個別に padding 制御したい
   *                 複雑モーダル向け。`className="p-0 gap-0"` で打ち消す
   *                 既存実装の正規版。
   */
  padding?: boolean
  /**
   * Optional screen-reader description for the dialog.
   * - string / ReactNode: 自動で sr-only な <DialogDescription> を
   *   レンダリングし、`aria-describedby` に紐付ける
   * - undefined（既定）: `aria-describedby={undefined}` を明示して
   *   Radix の "Missing Description" 警告を抑制。description が
   *   概念上不要なダイアログ用。
   * 可視の description を出したい場合は、この prop を使わず子要素として
   * `<DialogDescription>` を直接置く。
   */
  description?: React.ReactNode
  /**
   * 縦位置。
   * - "center" (既定): 画面中央
   * - "top": 上部寄せ (safe-area-inset-top + 2rem 下) — モバイルで縦長
   *   コンテンツ (チェックリスト等) を出すときに、コンテンツが
   *   スクロールしやすく操作しやすい
   */
  position?: "center" | "top"
}

function DialogContent({
  className,
  children,
  padding = true,
  description,
  position = "center",
  ...props
}: DialogContentProps) {
  const autoDescId = React.useId()
  const hasInternalDesc = description != null && description !== false
  // - description 渡しあり → 生成した sr-only Description の id
  // - description なし → 呼び出し側の aria-describedby（無ければ undefined を明示）
  //   undefined を明示することで Radix の "Missing Description" 警告が消える。
  const ariaDescribedBy = hasInternalDesc ? autoDescId : props["aria-describedby"]
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-position={position}
        className={cn(
          // 横位置: left-[50%] + translate-x-[-50%] のみ。
          // inset-x-* と組み合わせると left/right と transform が競合して
          // SP サイズで左に大きくズレるため使わない。
          // 幅は w-full + max-w-[calc(100%-3rem)] (左右 24px) + 480px キャップ。
          "fixed left-[50%] z-50 w-full max-w-[calc(100%-3rem)] sm:max-w-[480px] translate-x-[-50%]",
          // 縦位置
          position === "top"
            ? "top-[max(env(safe-area-inset-top),2rem)] max-h-[calc(100dvh-max(env(safe-area-inset-top),2rem)-2rem)] overflow-y-auto"
            : "top-[50%] translate-y-[-50%]",
          "rounded-lg bg-[var(--Surface-Primary)] shadow-[var(--shadow-dialog)]",
          padding && "p-6",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
        aria-describedby={ariaDescribedBy}
      >
        {hasInternalDesc && (
          <DialogPrimitive.Description id={autoDescId} className="sr-only">
            {description}
          </DialogPrimitive.Description>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("typo-heading-lg text-[var(--Text-High-Emphasis)]", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("typo-body-md text-[var(--Text-Medium-Emphasis)]", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
export type { DialogContentProps }
