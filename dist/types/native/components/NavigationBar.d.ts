import React from "react";
export interface NavigationBarItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number;
    onPress?: () => void;
}
export interface NavigationBarProps {
    items: NavigationBarItem[];
    value?: string;
    onChange?: (key: string) => void;
}
/**
 * Webの「ヘッダ型ナビゲーション」をRNで意味変換した BottomTabs風 ナビ。
 * 画面下部に固定して使う想定。
 */
export declare function NavigationBar({ items, value, onChange }: NavigationBarProps): React.JSX.Element;
