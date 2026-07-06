import React from "react";
import { type PressableProps, type StyleProp, type ViewStyle } from "react-native";
export type StatusActionBadgeState = "idle" | "pending" | "syncing" | "success" | "warning" | "error" | "offline";
export interface StatusActionBadgeProps extends Omit<PressableProps, "children" | "style"> {
    state?: StatusActionBadgeState;
    label: string;
    count?: number;
    compact?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    asStatus?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function StatusActionBadge({ state, label, count, compact, loading, icon, asStatus, style, onPress, ...rest }: StatusActionBadgeProps): React.JSX.Element;
export declare const SyncStatusButton: typeof StatusActionBadge;
