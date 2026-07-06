import React from "react";
export type SyncStatus = "synced" | "syncing" | "offline" | "error";
export interface SyncStatusBadgeProps {
    status: SyncStatus;
    label?: string;
}
export declare function SyncStatusBadge({ status, label }: SyncStatusBadgeProps): React.JSX.Element;
