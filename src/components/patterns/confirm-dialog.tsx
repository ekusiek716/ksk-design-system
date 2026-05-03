import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
} from "@/components/ui/responsive-dialog"

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
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          {description && (
            <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>
          )}
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter className="mt-4">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

export { ConfirmDialog }
export type { ConfirmDialogProps }
