import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { usePortalContainer } from "./portal-container"
import { notifyAlertDialogOpening } from "@/lib/layer-coordination"
import {
  ModalStackRegistrar,
  alertContentZ,
  alertOverlayZ,
} from "@/lib/modal-stack"
import { buttonVariants } from "./button"
import type { ButtonProps } from "./button"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/**
 * AlertDialog — 確認ダイアログ（破壊的アクションの二段階確認に使用）
 *
 * ### 使用例
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger asChild>
 *     <Button variant="destructive">削除</Button>
 *   </AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
 *       <AlertDialogDescription>この操作は取り消せません。</AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>キャンセル</AlertDialogCancel>
 *       <AlertDialogAction>削除する</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */

function AlertDialog({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  const notifiedOpenRef = React.useRef(false)

  useIsomorphicLayoutEffect(() => {
    const externallyOpen = open === true || (open === undefined && defaultOpen === true)
    if (externallyOpen && !notifiedOpenRef.current) {
      notifyAlertDialogOpening()
      notifiedOpenRef.current = true
    }
    if (open === false) notifiedOpenRef.current = false
  }, [defaultOpen, open])

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !notifiedOpenRef.current) {
      notifyAlertDialogOpening()
      notifiedOpenRef.current = true
    }
    if (!nextOpen) notifiedOpenRef.current = false
    onOpenChange?.(nextOpen)
  }

  return (
    <AlertDialogPrimitive.Root
      data-slot="alert-dialog"
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      {...props}
    />
  )
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  container,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  // 明示 container > PortalContainerProvider > document.body（#360）
  const resolvedContainer = usePortalContainer(container)
  return (
    <AlertDialogPrimitive.Portal
      data-slot="alert-dialog-portal"
      container={resolvedContainer}
      {...props}
    />
  )
}

interface AlertDialogOverlayProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Overlay> {
  /**
   * #340: グローバル open-modal スタックでの深度（0 = 最初に開いたモーダル）。
   * 指定時は z-index を `--Z-Alert-Overlay + 段数*12` で上書きする。
   * 未指定時は --Z-Alert-Overlay 固定（従来挙動）。
   */
  stackLevel?: number
}

function AlertDialogOverlay({
  className,
  style,
  stackLevel,
  ...props
}: AlertDialogOverlayProps) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        // stackLevel 指定時は下のインライン style が per-instance で上書きする。
        "fixed inset-0 z-[var(--Z-Alert-Overlay)] bg-[var(--Overlay-Medium)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      style={{
        ...style,
        ...(stackLevel != null ? { zIndex: alertOverlayZ(stackLevel) } : null),
      }}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  style,
  zIndex,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "default" | "sm"
  /**
   * #340: 多段モーダルの z-index escape hatch。未指定時は開いているモーダルの
   * 順序（グローバルスタック）から自動算出される。
   */
  zIndex?: number
}) {
  // #340: Sheet / Dialog と同じグローバル open-modal スタックに参加する。
  // 基底は --Z-Alert-* のまま＝アラートは常に通常モーダルより上、という現行の
  // 設計意図を保ったうえで、アラート同士の重なりだけを開いた順に解決する。
  const [stackLevel, setStackLevel] = React.useState(0)
  const resolvedContentZ = zIndex ?? alertContentZ(stackLevel)
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay stackLevel={stackLevel} />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        onOpenAutoFocus={(e) => e.preventDefault()}
        style={{ ...style, zIndex: resolvedContentZ }}
        className={cn(
          // transition-none: `duration-*` は tw-animate 由来で enter/exit の
          // アニメーション尺のために付いているが、transition-property を明示
          // しないと既定値 all のまま「全プロパティが 200ms かけて遷移」する。
          // z-index は離散プロパティなので遷移中の前半は古い値を返し、#340 で
          // 段数ぶんを加算した z が実際に効くまで約 100ms 遅れる（その間だけ
          // アラートが下のモーダルに潜る）。enter/exit は keyframes なので
          // transition を切っても見た目は変わらない。
          "group/alert-dialog-content transition-none fixed top-[50%] left-[50%] z-[var(--Z-Alert)] grid w-full max-w-[calc(100%_-_2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[var(--Radius-Modal)] border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] p-6 shadow-[var(--shadow-dialog)] duration-[var(--Motion-Duration-Base)] data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg",
          className
        )}
        {...props}
      >
        <ModalStackRegistrar onLevelChange={setStackLevel} />
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  orientation = "split",
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * アクションボタンの並べ方。
   * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。
   * - "stacked": 旧挙動。モバイルは縦積み、sm 以上で右寄せ横並び
   *   （size="sm" のときは 2 カラム grid）。
   */
  orientation?: "split" | "stacked"
}) {
  return (
    <div
      data-slot="alert-dialog-footer"
      data-orientation={orientation}
      // pt-4: フッターを本文から離し、アクション領域として独立させる。
      className={cn(
        "pt-4",
        orientation === "stacked"
          ? "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end"
          : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("typo-heading-lg text-[var(--Text-High-Emphasis)]", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("typo-body-sm text-[var(--Text-Medium-Emphasis)]", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<ButtonProps, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  variant = "tertiary",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<ButtonProps, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
