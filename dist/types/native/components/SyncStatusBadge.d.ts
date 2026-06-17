export type SyncStatus = "synced" | "syncing" | "offline" | "error";
export interface SyncStatusBadgeProps {
    status: SyncStatus;
    label?: string;
}
export declare function SyncStatusBadge({ status, label }: SyncStatusBadgeProps): import("react/jsx-runtime").JSX.Element;
