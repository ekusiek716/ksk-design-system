import * as React from "react";
interface KebabMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    destructive?: boolean;
}
interface KebabMenuProps extends React.ComponentProps<"div"> {
    items: KebabMenuItem[];
}
declare function KebabMenu({ items, className, ...props }: KebabMenuProps): import("react/jsx-runtime").JSX.Element;
export { KebabMenu };
export type { KebabMenuItem };
