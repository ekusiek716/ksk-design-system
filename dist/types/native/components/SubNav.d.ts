import React from "react";
export interface SubNavItem {
    key: string;
    label: string;
    count?: number;
}
export interface SubNavProps {
    items: SubNavItem[];
    value?: string;
    onChange?: (key: string) => void;
}
/** Webの SubNav を RN の SegmentedTabs 風に意味変換。横スクロール可。 */
export declare function SubNav({ items, value, onChange }: SubNavProps): React.JSX.Element;
