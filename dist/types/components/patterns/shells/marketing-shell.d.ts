import * as React from "react";
interface MarketingShellProps extends React.ComponentProps<"div"> {
    header?: React.ReactNode;
    footer?: React.ReactNode;
}
declare function MarketingShell({ className, header, footer, children, ...props }: MarketingShellProps): React.JSX.Element;
export { MarketingShell };
