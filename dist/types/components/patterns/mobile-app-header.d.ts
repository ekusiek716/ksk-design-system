import * as React from "react";
interface MobileAppHeaderProps extends React.ComponentProps<"header"> {
    brand: React.ReactNode;
    leading?: React.ReactNode;
    status?: React.ReactNode;
    compactStatus?: React.ReactNode;
    actions?: React.ReactNode;
    sticky?: boolean;
    bordered?: boolean;
}
declare function MobileAppHeader({ className, brand, leading, status, compactStatus, actions, sticky, bordered, children, ...props }: MobileAppHeaderProps): React.JSX.Element;
export { MobileAppHeader };
export type { MobileAppHeaderProps };
