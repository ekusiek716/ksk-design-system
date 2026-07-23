import * as React from "react";
interface MarketingShellProps extends React.ComponentProps<"div"> {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    mainId?: string;
    skipLink?: boolean;
    skipLinkLabel?: string | null;
}
declare function MarketingShell({ className, header, footer, mainId, skipLink, skipLinkLabel, children, ...props }: MarketingShellProps): React.JSX.Element;
export { MarketingShell };
export type { MarketingShellProps };
