import * as React from "react";
interface KebabMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    destructive?: boolean;
}
interface KebabMenuProps extends React.ComponentProps<"button"> {
    items: KebabMenuItem[];
}
/**
 * 縦三点メニュー。DropdownMenu（Radix）を内部利用しており、
 * キーボード操作・Esc クローズ・フォーカス管理・role="menu" を備える。
 */
declare function KebabMenu({ items, className, ...props }: KebabMenuProps): import("react/jsx-runtime").JSX.Element;
export { KebabMenu };
export type { KebabMenuItem };
