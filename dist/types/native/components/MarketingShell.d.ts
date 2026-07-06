import React from "react";
export interface MarketingShellProps {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    cta?: React.ReactNode;
    children: React.ReactNode;
}
/** LP/集客系の縦長スクロールシェル。AppShell との違いは BottomNav なし & sticky CTA 領域あり。 */
export declare function MarketingShell({ header, footer, cta, children }: MarketingShellProps): React.JSX.Element;
