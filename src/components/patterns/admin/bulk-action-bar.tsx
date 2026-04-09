import * as React from "react"
import { cn } from "@/lib/utils"

interface BulkActionBarProps extends React.ComponentProps<"div"> {
  /** 選択件数 */
  selectedCount: number
  /** 選択解除ボタンクリック時 */
  onClear?: () => void
}

/**
 * 一括操作バー（FAB型）
 *
 * テーブル行を1件以上選択すると画面下部に浮き上がるフローティングバー。
 * 選択件数 + アクションボタン群を横並びで表示。
 * selectedCount が 0 のとき自動で非表示になる。
 */
function BulkActionBar({ selectedCount, onClear, children, className, ...props }: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      data-slot="bulk-action-bar"
      className={cn(
        "fixed inset-x-0 bottom-6 z-50 mx-auto w-fit max-w-[calc(100%-32px)]",
        "flex items-center gap-3 rounded-full bg-[var(--Surface-Inverse)] px-5 py-3 shadow-[var(--shadow-dialog)]",
        "animate-fade-in-up",
        className
      )}
      role="toolbar"
      aria-label={`${selectedCount}件を選択中`}
      {...props}
    >
      {/* 選択件数 */}
      <span className="typo-label-md text-[var(--Text-on-Inverse)] shrink-0">
        {selectedCount}件を選択中
      </span>

      {/* 区切り線 */}
      <div className="h-5 w-px bg-[var(--Text-on-Inverse)]/20 shrink-0" />

      {/* アクション群 */}
      <div className="flex items-center gap-2">
        {children}
      </div>

      {/* 選択解除ボタン */}
      {onClear && (
        <>
          <div className="h-5 w-px bg-[var(--Text-on-Inverse)]/20 shrink-0" />
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-full text-[var(--Text-on-Inverse)]/60 hover:text-[var(--Text-on-Inverse)] hover:bg-[var(--Text-on-Inverse)]/10 transition-colors cursor-pointer"
            onClick={onClear}
            aria-label="選択を解除"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

export { BulkActionBar }
