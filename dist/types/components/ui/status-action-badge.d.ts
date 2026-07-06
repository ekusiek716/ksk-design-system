import * as React from "react";
type StatusActionBadgeState = "idle" | "pending" | "syncing" | "success" | "warning" | "error" | "offline";
interface StatusActionBadgeProps extends Omit<React.ComponentProps<"button">, "children"> {
    state?: StatusActionBadgeState;
    label: string;
    count?: number;
    compact?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    asStatus?: boolean;
}
declare function StatusActionBadge({ className, state, label, count, compact, loading, icon, asStatus, onClick, type, disabled, ...props }: StatusActionBadgeProps): React.JSX.Element;
declare const SyncStatusButton: typeof StatusActionBadge;
export { StatusActionBadge, SyncStatusButton };
export type { StatusActionBadgeProps, StatusActionBadgeState };
