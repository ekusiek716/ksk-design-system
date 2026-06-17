import React from "react";
export interface NotificationBadgeProps {
    count?: number;
    max?: number;
    dot?: boolean;
    children?: React.ReactNode;
}
/** 子要素の右上に未読カウントを重ねるバッジ。 */
export declare function NotificationBadge({ count, max, dot, children }: NotificationBadgeProps): import("react/jsx-runtime").JSX.Element;
