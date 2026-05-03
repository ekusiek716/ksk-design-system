import * as React from "react";
interface AppHeaderProps {
    /** 左端スロット（戻るボタン、ハンバーガー等） */
    leading?: React.ReactNode;
    /** 中央タイトル */
    title?: React.ReactNode;
    /** サブタイトル（タイトルの下に表示） */
    subtitle?: React.ReactNode;
    /** 右端スロット（アクションボタン群） */
    trailing?: React.ReactNode;
    /** 固定ヘッダー（スクロールに追従しない） */
    sticky?: boolean;
    /** 下線ボーダー */
    bordered?: boolean;
    /**
     * 外観バリアント:
     * - "default"     : 通常（Surface-Primary 背景 + ボーダー）
     * - "glass"       : Liquid Glass（コンテンツに重ねる半透明）
     * - "transparent" : 完全透明（スクロール連動で背景を切り替えるときの初期状態）
     */
    variant?: "default" | "glass" | "transparent";
    className?: string;
}
declare function AppHeader({ leading, title, subtitle, trailing, sticky, bordered, variant, className, }: AppHeaderProps): import("react/jsx-runtime").JSX.Element;
export { AppHeader };
export type { AppHeaderProps };
