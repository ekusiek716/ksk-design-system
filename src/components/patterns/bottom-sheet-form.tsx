import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface BottomSheetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  submitLabel?: string
  cancelLabel?: string
  onSubmit: () => void | Promise<void>
  loading?: boolean
  /** フォームコンテンツ */
  children: React.ReactNode
  className?: string
}

function BottomSheetForm({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "保存",
  cancelLabel = "キャンセル",
  onSubmit,
  loading = false,
  children,
  className,
}: BottomSheetFormProps) {
  const [pending, setPending] = React.useState(false)
  const isLoading = loading || pending

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    try {
      await onSubmit()
      onOpenChange(false)
    } finally {
      setPending(false)
    }
  }, [onSubmit, onOpenChange])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn("rounded-t-2xl max-h-[90dvh] flex flex-col", className)}
      >
        {/* ドラッグハンドル */}
        <div className="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-[var(--Border-Medium-Emphasis)] shrink-0" />

        <SheetHeader className="px-6 pt-2 shrink-0">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* スクロール可能なフォームエリア */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {children}
          </div>

          {/* フッター固定 */}
          <div className="shrink-0 flex gap-3 px-6 py-4 border-t border-[var(--Border-Low-Emphasis)]">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "保存中…" : submitLabel}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export { BottomSheetForm }
export type { BottomSheetFormProps }
