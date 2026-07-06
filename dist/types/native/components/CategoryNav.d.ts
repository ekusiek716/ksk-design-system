import React from "react";
export interface CategoryNavItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
}
export interface CategoryNavProps {
    items: CategoryNavItem[];
    value?: string;
    onChange?: (key: string) => void;
}
/** 横並び・固定で表示するカテゴリナビ。スクロール可能。 */
export declare function CategoryNav({ items, value, onChange }: CategoryNavProps): React.JSX.Element;
