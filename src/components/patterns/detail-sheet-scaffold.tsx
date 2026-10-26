import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import { useOverlayTitleSlot, useRegisterOverlayTitle } from "../../lib/title-level"
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
   * そのとき sr-only の SheetTitle / DialogTitle を別に置かない（id が重複する。開発ビルドで console.error）。
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
  /**
   * 下線と下余白（16px）を出すか（issue #742）。
   * 未指定は自動: title / titleEditor / description / leading / children のどれも無い
   * （閉じるボタン・trailing だけの）ときは出さず、それ以外は出す（従来どおり）。
   * true / false で強制する。
   */
  bordered?: boolean
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
  bordered,
  children,
  ...props
}: DetailSheetHeaderProps) {
  const titleContent = titleEditor ?? title
  const defaultLabels = useKskLabels()
  const hasLeading = leading != null && leading !== false
  const overlaySlot = useOverlayTitleSlot()
  const asOverlayTitle = overlayTitle && overlaySlot != null && titleEditor == null && typeof title === "string"
  // #727: 同じ Content の Title の数で重複を検出する（SheetTitle / DialogTitle も同じ登録を行う）
  useRegisterOverlayTitle(asOverlayTitle)
  const isPresent = (node: React.ReactNode) => node != null && node !== false && node !== ""
  // #742: 閉じるボタン・trailing だけのときは、何も無い帯（下線 + 下余白）を引かない
  const actionsOnly =
    !hasLeading && !isPresent(titleContent) && !isPresent(description) && !isPresent(children)
  const showBorder = bordered ?? !actionsOnly

  return (
    <div
      data-slot="detail-sheet-header"
      data-bordered={showBorder ? "true" : "false"}
      className={cn(
        // #729: leading が空なら列ごと描かない（空の auto 列 + gap-3 で題名が 12px 右にずれるため）
        hasLeading
          ? "grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-5 pt-5"
          : "grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-5 pt-5",
        showBorder && "border-b border-[var(--Border-Low-Emphasis)] pb-4",
        className
      )}
      {...props}
    >
      {hasLeading && (
        <div data-slot="detail-sheet-header-leading" className="flex min-h-10 items-center">
          {leading}
        </div>
      )}
      <div data-slot="detail-sheet-header-title" className="min-w-0">
        {asOverlayTitle ? (
          // #727: Radix の Title（h2・id = Content の aria-labelledby）。見た目は素の h2 と同じ。
          // data-slot は SheetTitle / DialogTitle と同じにし、autoFocus="title" の対象にする
          <DialogPrimitive.Title
            data-slot={overlaySlot === "sheet" ? "sheet-title" : "dialog-title"}
            className="typo-heading-lg text-[var(--Text-High-Emphasis)] break-words focus:outline-hidden focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]"
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
        // 間隔 8px: KebabMenu（見た目 32px・当たり判定 44px で左右 6px はみ出す）と閉じるボタン（40px・44px で 2px）・
        // 素の icon Button（40px）の当たり判定が重ならない最小の間隔（issue #752 Codex P2。旧 gap-1 = 4px では重なった）
        className="flex min-h-10 shrink-0 items-center justify-end gap-2"
      >
        {trailing}
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-slot="detail-sheet-header-close"
            // 見た目は 40px のまま、当たり判定を 44px に広げる（Button の xs / sm / icon-sm と同じ透明な before）
            className="relative before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-full before:min-h-11 before:min-w-11 before:content-['']"
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
