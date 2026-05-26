import * as React from "react"
import { cn } from "@/lib/utils"

export type SyncState = "idle" | "syncing" | "success" | "error" | "offline"

export interface SyncStatusBadgeProps {
  state: SyncState
  /** エラー件数（state="error" のとき表示） */
  errorCount?: number
  /** 再試行ボタン押下時のコールバック */
  onRetry?: () => void
  /** i18n ラベル */
  syncingLabel?: string
  successLabel?: string
  errorLabel?: (count: number) => string
  offlineLabel?: string
  retryLabel?: string
  className?: string
}

function SyncStatusBadge({
  state,
  errorCount = 0,
  onRetry,
  syncingLabel = "同期中",
  successLabel = "保存済み",
  errorLabel = (n) => `${n}件のエラー`,
  offlineLabel = "オフライン",
  retryLabel = "再試行",
  className,
}: SyncStatusBadgeProps) {
  if (state === "idle" && errorCount === 0) return null

  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-label-xs font-medium select-none"

  if (state === "syncing") {
    return (
      <span data-slot="sync-status-badge" data-state={state} className={cn(base, "bg-[var(--Surface-Info)] text-[var(--Text-Info)]", className)}>
        <span
          aria-hidden
          className="size-3 rounded-full border-[1.5px] border-current border-t-transparent animate-spin"
        />
        {syncingLabel}
      </span>
    )
  }

  if (state === "success") {
    return (
      <span data-slot="sync-status-badge" data-state={state} className={cn(base, "bg-[var(--Surface-Success)] text-[var(--Text-Success)]", className)}>
        <span aria-hidden className="size-1.5 rounded-full bg-current" />
        {successLabel}
      </span>
    )
  }

  if (state === "error") {
    return (
      <span data-slot="sync-status-badge" data-state={state} className={cn(base, "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]", className)}>
        <span aria-hidden className="size-1.5 rounded-full bg-current" />
        {errorLabel(errorCount)}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="ml-1 underline underline-offset-2 hover:no-underline"
          >
            {retryLabel}
          </button>
        )}
      </span>
    )
  }

  if (state === "offline") {
    return (
      <span data-slot="sync-status-badge" data-state={state} className={cn(base, "bg-[var(--Surface-Secondary)] text-[var(--Text-Low-Emphasis)]", className)}>
        <span aria-hidden className="size-1.5 rounded-full bg-current" />
        {offlineLabel}
      </span>
    )
  }

  return null
}

export { SyncStatusBadge }
