import * as React from "react";
interface AppShellProps extends React.ComponentProps<"div"> {
    topBar?: React.ReactNode;
    bottomNav?: React.ReactNode;
    mainId?: string;
    skipLink?: boolean;
    skipLinkLabel?: string | null;
}
declare function AppShell({ className, topBar, bottomNav, mainId, skipLink, skipLinkLabel, children, ...props }: AppShellProps): React.JSX.Element;
export { AppShell };
export type { AppShellProps };
