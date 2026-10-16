import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { warnOnceInDev } from "@/lib/dev-warn"
import { useOverlayTitleSlot } from "../../lib/title-level"
import { Button } from "../ui/button"
import { SemanticIcon } from "../ui/semantic-icon"
import { useKskLabels } from "../ui/ksk-labels"

interface DetailSheetScaffoldProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

interface DetailSheetHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  /**
   * 見出し。文字列を渡すと typo-heading-lg の h2 で描く。
   * Sheet / Dialog（ResponsiveOverlayFrame・BottomSheetFrame 経由を含む）の中では、その h2 を
   * SheetTitle / DialogTitle として描き、シート / ダイアログの名前（aria-labelledby）にする（issue #727）。
   * そのとき sr-only の SheetTitle / DialogTitle を別に置かない（id が重複する。開発ビルドで警告）。
   */
  title?: React.ReactNode
  /**
   * 文字列の title を Sheet / Dialog の名前として描くか（issue #727）。既定 true。
   * false で従来どおり素の h2（名前は別の SheetTitle / DialogTitle で付ける）。オーバーレイの外・
   * AlertDialog の中・titleEditor / ReactNode の title では常に素の描画
   */
  overlayTitle?: boolean
  /**
   * タイトルをその場で編集する入力欄。指定時は title の代わりに描画する。
   * 見た目を合わせるには `<CommitInput variant="inline-title" aria-label="タイトル" … />`
   * （複数行なら `<CommitAutoGrowTextarea variant="inline-title" density="compact" …/>`）を渡す
   * （issue #675）。unstyled + typo の上書きで作らない。
   */
  titleEditor?: React.ReactNode
  description?: React.ReactNode
  leading?: React.ReactNode
  trailing?: React.ReactNode
  /**
   * 閉じるボタンを出す（issue #722）。押したときの処理（`onOpenChange(false)` 等）を渡す。
   * trailing の末尾（右端）に `Button variant="ghost" size="icon"`（40px）+ 閉じるアイコン 20px を置く。
   * 閉じるボタンを trailing に自作しない（大きさがばらつくため）。KebabMenu 等は trailing にそのまま置ける
   */
  onClose?: () => void
  /** 閉じるボタンの読み上げ名。既定は KskLabelsProvider の close（無ければ「閉じる」） */
  closeLabel?: string
}

function DetailSheetScaffold({
  className,
  header,
  footer,
  children,
  ...props
}: DetailSheetScaffoldProps) {
  return (
    <div
      data-slot="detail-sheet-scaffold"
      className={cn(
        "flex max-h-[inherit] min-h-0 flex-col bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
        className
      )}
      {...props}
    >
      {header}
      <div
        data-slot="detail-sheet-body"
        className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
      >
        {children}
      </div>
      {footer}
    </div>
  )
}

function DetailSheetHeader({
  className,
  title,
  titleEditor,
  description,
  leading,
  trailing,
  onClose,
  closeLabel,
  overlayTitle = true,
  children,
  ...props
}: DetailSheetHeaderProps) {
  const titleContent = titleEditor ?? title
  const defaultLabels = useKskLabels()
  const overlaySlot = useOverlayTitleSlot()
  const asOverlayTitle = overlayTitle && overlaySlot != null && titleEditor == null && typeof title === "string"
  const titleRef = React.useRef<HTMLHeadingElement>(null)

  // #727: 同じシートに別の SheetTitle / DialogTitle が残っていると Radix の titleId が重複する
  React.useEffect(() => {
    if (!asOverlayTitle) return
    const el = titleRef.current
    if (!el?.id || typeof document === "undefined") return
    const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(el.id) : el.id
    if (document.querySelectorAll(`[id="${escaped}"]`).length > 1) {
      warnOnceInDev(
        "detail-sheet-header-duplicate-title",
        "DetailSheetHeader の文字列 title はシート / ダイアログの名前（SheetTitle / DialogTitle）として描かれます。同じシートの sr-only の SheetTitle / DialogTitle を消すか、DetailSheetHeader に overlayTitle={false} を渡してください（issue #727）。"
      )
    }
  }, [asOverlayTitle])

  return (
    <div
      data-slot="detail-sheet-header"
      className={cn(
        "grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-5 pt-5",
        "border-b border-[var(--Border-Low-Emphasis)] pb-4",
        className
      )}
      {...props}
    >
      <div data-slot="detail-sheet-header-leading" className="flex min-h-10 items-center">
        {leading}
      </div>
      <div data-slot="detail-sheet-header-title" className="min-w-0">
        {asOverlayTitle ? (
          // #727: Radix の Title（h2・id = Content の aria-labelledby）。見た目は素の h2 と同じ。
          // data-slot は SheetTitle / DialogTitle と同じにし、autoFocus="title" の対象にする
          <DialogPrimitive.Title
            ref={titleRef}
            data-slot={overlaySlot === "sheet" ? "sheet-title" : "dialog-title"}
            className="typo-heading-lg text-[var(--Text-High-Emphasis)] break-words focus:outline-hidden focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50"
          >
            {titleContent}
          </DialogPrimitive.Title>
        ) : typeof titleContent === "string" ? (
          <h2 className="typo-heading-lg text-[var(--Text-High-Emphasis)] break-words">
            {titleContent}
          </h2>
        ) : (
          titleContent
        )}
        {description && (
          typeof description === "string" ? (
            <p className="typo-body-sm mt-1 text-[var(--Text-Medium-Emphasis)]">
              {description}
            </p>
          ) : (
            <div className="mt-1">{description}</div>
          )
        )}
        {children}
      </div>
      <div
        data-slot="detail-sheet-header-trailing"
        className="flex min-h-10 shrink-0 items-center justify-end gap-1"
      >
        {trailing}
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-slot="detail-sheet-header-close"
            aria-label={closeLabel ?? defaultLabels.close}
            onClick={onClose}
          >
            <SemanticIcon name="close" size={20} />
          </Button>
        )}
      </div>
    </div>
  )
}

function DetailSheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="detail-sheet-body"
      className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)}
      {...props}
    />
  )
}

export { DetailSheetScaffold, DetailSheetHeader, DetailSheetBody }
export type { DetailSheetScaffoldProps, DetailSheetHeaderProps }
