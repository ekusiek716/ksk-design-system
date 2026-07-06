import React from "react";
export interface CollapsibleProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}
export declare function Collapsible({ title, defaultOpen, children }: CollapsibleProps): React.JSX.Element;
