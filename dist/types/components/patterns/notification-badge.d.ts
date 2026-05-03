import * as React from "react";
interface NotificationBadgeProps extends React.ComponentProps<"span"> {
    count: number;
    max?: number;
    /**
     * バッジのサイズ。
     * - "xs"      : 最小（数字なし・ドット表示 6px）
     * - "sm"      : 小（16px、1〜2桁向け）
     * - "default" : 標準（20px）
     * @default "default"
     */
    size?: "xs" | "sm" | "default";
}
declare function NotificationBadge({ className, count, max, size, ...props }: NotificationBadgeProps): import("react/jsx-runtime").JSX.Element;
export { NotificationBadge };
