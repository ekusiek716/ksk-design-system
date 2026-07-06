import React from "react";
export interface CategoryScrollItem {
    key: string;
    label: string;
    count?: number;
}
export interface CategoryScrollProps {
    items: CategoryScrollItem[];
    value?: string;
    onChange?: (key: string) => void;
}
/** Pill 形のカテゴリ横スクロール。CategoryNav と違い見た目はテキストチップ。 */
export declare function CategoryScroll({ items, value, onChange }: CategoryScrollProps): React.JSX.Element;
