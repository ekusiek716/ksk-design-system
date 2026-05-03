import * as React from "react";
interface MenuDrawerItem {
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    badge?: number;
}
interface MenuDrawerSection {
    title?: string;
    items: MenuDrawerItem[];
}
interface MenuDrawerProps {
    open: boolean;
    onClose: () => void;
    /** ドロワー上部バナー（プロモーション等） */
    banner?: React.ReactNode;
    sections: MenuDrawerSection[];
    /** フッターリンク群 */
    footerLinks?: MenuDrawerItem[];
    /** ドロワー幅（px） */
    width?: number;
    className?: string;
}
declare function MenuDrawer({ open, onClose, banner, sections, footerLinks, width, className, }: MenuDrawerProps): import("react/jsx-runtime").JSX.Element;
export { MenuDrawer };
export type { MenuDrawerProps, MenuDrawerSection, MenuDrawerItem };
