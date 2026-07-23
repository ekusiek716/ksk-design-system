import * as React from "react";
interface AdminShellProps extends React.ComponentProps<"div"> {
    sidebar: React.ReactNode;
    header?: React.ReactNode;
    sidebarWidth?: string;
    mainId?: string;
    skipLink?: boolean;
    skipLinkLabel?: string | null;
}
declare function AdminShell({ className, sidebar, header, children, sidebarWidth, mainId, skipLink, skipLinkLabel, ...props }: AdminShellProps): React.JSX.Element;
export { AdminShell };
export type { AdminShellProps };
