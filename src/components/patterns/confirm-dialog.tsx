import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /**
   * 処理中に表示するラベル。
   * i18n 対応: 英語では "Processing…" など任意文字列を渡す。
   * @default "処理中…"
   */
  loadingLabel?: string
  /** destructive にすると確認ボタンが赤くなる */
  variant?: "default" | "destructive"
  onConfirm: () => void | Promise<void>
  loading?: boolean
}

/**
 * ConfirmDialog — 「アクションを止める」割り込み確認（破壊操作の二段階確認）。
 *
 * `role="alertdialog"`（AlertDialog 基盤）。タスク面の絞り込み・フォーム等とは
 * 別カテゴリで、支援技術には緊急の確認として通知され、**オーバーレイの外側クリックでは
 * 閉じない**（明示的に確認/キャンセルを選ばせる）。PC/SP とも中央表示の
 * アラート（iOS/Android の確認アラート慣習に準拠）。
 *
 * タスク用の中央モーダル（絞り込み等）が要るときは `Dialog` / `Sheet` /
 * `ResponsiveDialog` を使う。
 */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "確認",
  cancelLabel = "キャンセル",
  loadingLabel = "処理中…",
  variant = "default",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const [pending, setPending] = React.useState(false)
  const isLoading = loading || pending

  const handleConfirm = React.useCallback(async () => {
    setPending(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setPending(false)
    }
  }, [onConfirm, onOpenChange])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Cancel は Radix 管理（Esc → キャンセル / 自動クローズ）。見た目は従来踏襲で secondary。 */}
          <AlertDialogCancel variant="secondary" disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          {/* 確認は非同期/ローディングを自前管理するため、AlertDialogAction の
              即時自動クローズは使わず Button。onConfirm 完了後に閉じる。 */}
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmDialog }
export type { ConfirmDialogProps }
