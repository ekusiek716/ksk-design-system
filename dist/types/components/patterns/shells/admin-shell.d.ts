import * as React from "react";
interface AdminShellProps extends React.ComponentProps<"div"> {
    sidebar: React.ReactNode;
    header?: React.ReactNode;
    sidebarWidth?: string;
}
declare function AdminShell({ className, sidebar, header, children, sidebarWidth, ...props }: AdminShellProps): import("react/jsx-runtime").JSX.Element;
export { AdminShell };
