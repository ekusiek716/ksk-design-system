import * as React from "react";
interface BottomTabBarItem {
    label: string;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    badgeCount?: number;
    isActive?: boolean;
}
interface BottomTabBarProps extends React.ComponentProps<"nav"> {
    items: BottomTabBarItem[];
    /**
     * "default" : 従来の全幅バー（ボーダー付き）
     * "pill"    : iOS 26 スタイル — Liquid Glass フローティングピル
     */
    variant?: "default" | "pill";
    /**
     * pill variant の配置モード（デフォルト "fixed"）
     * - "fixed"    : ビューポートに固定（実アプリ用）
     * - "absolute" : 親要素内に配置（Storybook 等のデモ用）
     */
    pillPosition?: "fixed" | "absolute";
}
declare function BottomTabBar({ className, items, variant, pillPosition, ...props }: BottomTabBarProps): import("react/jsx-runtime").JSX.Element;
export { BottomTabBar };
export type { BottomTabBarItem, BottomTabBarProps };
