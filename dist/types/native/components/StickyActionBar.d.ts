import React from "react";
export interface StickyActionBarProps {
    children: React.ReactNode;
}
/** 画面下に固定する CTA バー。SafeArea 配慮済み。 */
export declare function StickyActionBar({ children }: StickyActionBarProps): React.JSX.Element;
