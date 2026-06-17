import React from "react";
export interface AppShellProps {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    bottomNav?: React.ReactNode;
    scrollable?: boolean;
    children: React.ReactNode;
}
/**
 * モバイルアプリの基本シェル。Header / Body / BottomNav の三段重ね。
 * 上下のSafeAreaは AppHeader / NavigationBar 側で取っている前提。
 */
export declare function AppShell({ header, footer, bottomNav, scrollable, children, }: AppShellProps): import("react/jsx-runtime").JSX.Element;
