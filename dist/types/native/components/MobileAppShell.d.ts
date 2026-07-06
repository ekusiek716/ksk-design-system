import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export type MobileAppShellBottomPadding = "none" | "bottom-nav" | "bottom-nav-fab";
export interface MobileAppShellProps {
    header?: React.ReactNode;
    bottomNav?: React.ReactNode;
    fab?: React.ReactNode;
    desktopSidebar?: React.ReactNode;
    scrollable?: boolean;
    bottomPadding?: MobileAppShellBottomPadding;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}
export declare function MobileAppShell({ header, bottomNav, fab, desktopSidebar, scrollable, bottomPadding, children, style, contentStyle, }: MobileAppShellProps): React.JSX.Element;
