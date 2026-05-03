import * as React from "react";
interface AppShellProps extends React.ComponentProps<"div"> {
    topBar?: React.ReactNode;
    bottomNav?: React.ReactNode;
}
declare function AppShell({ className, topBar, bottomNav, children, ...props }: AppShellProps): import("react/jsx-runtime").JSX.Element;
export { AppShell };
