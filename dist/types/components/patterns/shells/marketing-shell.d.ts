import * as React from "react";
interface MarketingShellProps extends React.ComponentProps<"div"> {
    header?: React.ReactNode;
    footer?: React.ReactNode;
}
declare function MarketingShell({ className, header, footer, children, ...props }: MarketingShellProps): import("react/jsx-runtime").JSX.Element;
export { MarketingShell };
