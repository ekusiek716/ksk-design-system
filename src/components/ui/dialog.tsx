import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

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

function useBodyScrollLock(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || typeof document === "undefined") return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [enabled])
}

function captureRestoreFocus(ref: React.RefObject<HTMLElement | null>) {
  if (ref.current != null || typeof document === "undefined") return
  ref.current = document.activeElement as HTMLElement | null
}

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
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Content>, "autoFocus"> {
  /**
   * デフォルトの内側余白とセクション間レイアウトを制御。
   * - true（既定）: p-6 + `flex flex-col gap-4` を付与。ヘッダ/本文/フッタが
   *                 16px 間隔で縦に並ぶ（AlertDialog と同じ挙動）。本文セクションを
   *                 持たない確認ダイアログでも、ヘッダとフッタが詰まらない。
   * - false       : 余白・レイアウトを一切付与しない（素の要素）。タブ/スクロール
   *                 本体/固定フッタの3段構成など、内側を自前でレイアウトする
   *                 複雑モーダル向け。
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
  /**
   * open 時の初期フォーカス。未指定時は Radix の既定挙動。
   * - "first-input": 最初の入力/操作可能要素
   * - "title": DialogTitle
   * - ref: 任意要素
   * - false: 自動フォーカスを抑制
   */
  autoFocus?: LayerAutoFocusTarget
  /** close 後に open 前の要素へ focus を戻す。既定 true。 */
  restoreFocusOnClose?: boolean
  /** Esc キーで閉じる。既定 true。 */
  closeOnEsc?: boolean
  /** Dialog 表示中に body scroll を抑止する。既定 true。 */
  bodyScrollLock?: boolean
}

function DialogContent({
  className,
  children,
  padding = true,
  description,
  position = "center",
  autoFocus,
  restoreFocusOnClose = true,
  closeOnEsc = true,
  bodyScrollLock = true,
  ...props
}: DialogContentProps) {
  const autoDescId = React.useId()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const restoreFocusRef = React.useRef<HTMLElement | null>(null)
  useBodyScrollLock(bodyScrollLock)
  const hasInternalDesc = description != null && description !== false
  // - description 渡しあり → 生成した sr-only Description の id
  // - description なし → 呼び出し側の aria-describedby（無ければ undefined を明示）
  //   undefined を明示することで Radix の "Missing Description" 警告が消える。
  const ariaDescribedBy = hasInternalDesc ? autoDescId : props["aria-describedby"]
  const handleOpenAutoFocus = (event: Event) => {
    captureRestoreFocus(restoreFocusRef)
    props.onOpenAutoFocus?.(event)
    if (event.defaultPrevented || autoFocus == null) return
    event.preventDefault()
    if (autoFocus === false) return
    window.requestAnimationFrame(() => {
      focusLayerTarget(contentRef.current, autoFocus, "dialog-title")
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
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={contentRef}
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
          "rounded-[var(--Radius-Modal)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)] shadow-[var(--shadow-dialog)]",
          padding && "flex flex-col gap-4 p-6",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
        aria-describedby={ariaDescribedBy}
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
        onEscapeKeyDown={handleEscapeKeyDown}
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

function DialogFooter({
  className,
  orientation = "split",
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * アクションボタンの並べ方。
   * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。2 ボタンを 50/50 で
   *   並べる iOS 風レイアウト。モバイルでも横並びのまま。
   * - "stacked": 旧挙動。モバイルは縦積み、sm 以上で右寄せ横並び（hug 幅）。
   *   3 つ以上のアクションや、右寄せにしたいフォーム系ダイアログで使う。
   */
  orientation?: "split" | "stacked"
}) {
  return (
    <div
      data-slot="dialog-footer"
      data-orientation={orientation}
      // pt-4: フッターを本文から離し、アクション領域として独立させる
      // （DialogContent の gap-4 と合わせて本文とボタンの間に十分な余白を作る）。
      className={cn(
        "pt-4",
        orientation === "stacked"
          ? "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
          : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0",
        className
      )}
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
