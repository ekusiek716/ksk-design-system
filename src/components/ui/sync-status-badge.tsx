import { cn } from "@/lib/utils"
import { formatKskLabel, useKskLabels } from "./ksk-labels"

export type SyncState = "idle" | "syncing" | "success" | "error" | "offline"

export interface SyncStatusBadgeProps {
  state: SyncState
  /** エラー件数（state="error" のとき表示） */
  errorCount?: number
  /** 再試行ボタン押下時のコールバック */
  onRetry?: () => void
  /**
   * i18n ラベル。syncing / success / offline / retry は省略時に KskLabelsProvider の
   * `syncStatusSyncing` / `syncStatusSaved` / `syncStatusOffline` / `syncStatusRetry`
   * （Provider 無しは "同期中" / "保存済み" / "オフライン" / "再試行"）。
   * errorLabel（件数を受け取る関数）の既定は Provider の `syncStatusError`（`{count}` を件数に置換。Provider 無しは "N件のエラー"）。
   */
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
  syncingLabel: syncingLabelProp,
  successLabel: successLabelProp,
  errorLabel: errorLabelProp,
  offlineLabel: offlineLabelProp,
  retryLabel: retryLabelProp,
  className,
}: SyncStatusBadgeProps) {
  const defaultLabels = useKskLabels()
  const syncingLabel = syncingLabelProp ?? defaultLabels.syncStatusSyncing
  const successLabel = successLabelProp ?? defaultLabels.syncStatusSaved
  const offlineLabel = offlineLabelProp ?? defaultLabels.syncStatusOffline
  const retryLabel = retryLabelProp ?? defaultLabels.syncStatusRetry
  const errorLabel = errorLabelProp ?? ((n: number) => formatKskLabel(defaultLabels.syncStatusError, { count: n }))
  if (state === "idle" && errorCount === 0) return null

  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-label-xs font-medium select-none"

  // 状態変化を SR に通知（error は割り込み、他は穏やかに）
  const liveProps =
    state === "error"
      ? ({ role: "alert", "aria-live": "assertive", "aria-atomic": true } as const)
      : ({ role: "status", "aria-live": "polite", "aria-atomic": true } as const)

  if (state === "syncing") {
    return (
      <span data-slot="sync-status-badge" data-state={state} {...liveProps} className={cn(base, "bg-[var(--Surface-Info)] text-[var(--Text-Info)]", className)}>
        <span
          aria-hidden
          // 動きを減らす設定では回転を止める（Button / Spinner と同じ）。止めても欠けた輪で同期中と分かり、
          // 状態は role="status" の文言で伝わる。
          className="size-3 rounded-full border-[1.5px] border-current border-t-transparent animate-spin motion-reduce:animate-none"
        />
        {syncingLabel}
      </span>
    )
  }

  if (state === "success") {
    return (
      <span data-slot="sync-status-badge" data-state={state} {...liveProps} className={cn(base, "bg-[var(--Surface-Success)] text-[var(--Text-Success)]", className)}>
        <span aria-hidden className="size-1.5 rounded-full bg-current" />
        {successLabel}
      </span>
    )
  }

  if (state === "error") {
    return (
      <span data-slot="sync-status-badge" data-state={state} {...liveProps} className={cn(base, "bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]", className)}>
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
      <span data-slot="sync-status-badge" data-state={state} {...liveProps} className={cn(base, "bg-[var(--Surface-Secondary)] text-[var(--Text-Low-Emphasis)]", className)}>
        <span aria-hidden className="size-1.5 rounded-full bg-current" />
        {offlineLabel}
      </span>
    )
  }

  return null
}

export { SyncStatusBadge }
