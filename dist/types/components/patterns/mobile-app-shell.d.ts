import * as React from "react";
type MobileAppShellBottomNavMode = "fixed" | "external" | "inline";
type MobileAppShellBottomPadding = "none" | "bottom-nav" | "bottom-nav-fab";
interface MobileAppShellProps extends React.ComponentProps<"div"> {
    header?: React.ReactNode;
    bottomNav?: React.ReactNode;
    fab?: React.ReactNode;
    desktopSidebar?: React.ReactNode;
    mainClassName?: string;
    contentClassName?: string;
    bottomNavMode?: MobileAppShellBottomNavMode;
    bottomPadding?: MobileAppShellBottomPadding;
    maxWidth?: React.CSSProperties["maxWidth"];
    centeredPreview?: boolean;
}
declare function MobileAppShell({ className, style, header, bottomNav, fab, desktopSidebar, mainClassName, contentClassName, bottomNavMode, bottomPadding, maxWidth, centeredPreview, children, ...props }: MobileAppShellProps): React.JSX.Element;
export { MobileAppShell };
export type { MobileAppShellBottomNavMode, MobileAppShellBottomPadding, MobileAppShellProps };
