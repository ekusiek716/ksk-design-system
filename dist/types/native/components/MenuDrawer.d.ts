import React from "react";
export interface MenuDrawerItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    onPress?: () => void;
    active?: boolean;
}
export interface MenuDrawerSection {
    title?: string;
    items: MenuDrawerItem[];
}
export interface MenuDrawerProps {
    open: boolean;
    onClose: () => void;
    side?: "left" | "right";
    header?: React.ReactNode;
    sections: MenuDrawerSection[];
    footer?: React.ReactNode;
}
export declare function MenuDrawer({ open, onClose, side, header, sections, footer, }: MenuDrawerProps): React.JSX.Element;
