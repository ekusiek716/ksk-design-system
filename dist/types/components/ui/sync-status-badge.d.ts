export type SyncState = "idle" | "syncing" | "success" | "error" | "offline";
export interface SyncStatusBadgeProps {
    state: SyncState;
    /** エラー件数（state="error" のとき表示） */
    errorCount?: number;
    /** 再試行ボタン押下時のコールバック */
    onRetry?: () => void;
    /** i18n ラベル */
    syncingLabel?: string;
    successLabel?: string;
    errorLabel?: (count: number) => string;
    offlineLabel?: string;
    retryLabel?: string;
    className?: string;
}
declare function SyncStatusBadge({ state, errorCount, onRetry, syncingLabel, successLabel, errorLabel, offlineLabel, retryLabel, className, }: SyncStatusBadgeProps): import("react").JSX.Element;
export { SyncStatusBadge };
