import * as React from "react";
interface BottomTabBarItem {
    label: string;
    ariaLabel?: string;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    badgeCount?: number;
    isActive?: boolean;
}
type BottomTabBarTone = "default" | "inverse";
type BottomTabBarKeyboardBehavior = "hide" | "lift" | "stay";
type BottomTabBarFloatingPosition = "left" | "center" | "right";
interface BottomTabBarAction extends BottomTabBarItem {
    badgeCount?: never;
    isActive?: never;
}
interface BottomTabBarProps extends React.ComponentProps<"nav"> {
    items: BottomTabBarItem[];
    /**
     * Liquid Glass の中央に置く主要アクション。
     * 例: 「＋ 作成」「投稿」「カートへ」など、実アプリのグロナビ CTA 用。
     */
    centerAction?: BottomTabBarAction;
    /**
     * pill variant でアイコン下のラベルを表示する。
     * centerAction 指定時は未指定でも true として扱う。
     */
    showLabels?: boolean;
    /**
     * dark/photo/gradient 背景上では "inverse" を指定して白文字にする。
     */
    tone?: BottomTabBarTone;
    /**
     * pill variant の最大幅。mobile web shell に合わせる時に指定する。
     */
    maxWidth?: React.CSSProperties["maxWidth"];
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
    /**
     * pill variant の水平フロート位置（デフォルト "center"、variant="pill" 時のみ有効）。
     * - "center" : 画面中央にフロート（従来どおりの挙動。後方互換）
     * - "left"   : 画面左側にフロート。右側に併置する FAB 用のスペース（80px）を確保する
     * - "right"  : 画面右側にフロート。左側に併置する FAB 用のスペース（80px）を確保する
     */
    floatingPosition?: BottomTabBarFloatingPosition;
    /**
     * ソフトキーボード表示中の挙動。
     * - "stay" : 従来通り下部に固定
     * - "hide" : 入力中は非表示
     * - "lift" : keyboard inset 分だけ上へ逃がす
     */
    keyboardBehavior?: BottomTabBarKeyboardBehavior;
}
declare function BottomTabBar({ className, items, centerAction, showLabels, tone, maxWidth, variant, pillPosition, floatingPosition, keyboardBehavior, ...props }: BottomTabBarProps): React.JSX.Element;
export { BottomTabBar };
export type { BottomTabBarAction, BottomTabBarFloatingPosition, BottomTabBarItem, BottomTabBarKeyboardBehavior, BottomTabBarProps, };
