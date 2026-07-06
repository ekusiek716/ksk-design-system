import React from "react";
export interface AccordionItem {
    key: string;
    title: string;
    content: React.ReactNode;
}
export interface AccordionProps {
    items: AccordionItem[];
    type?: "single" | "multiple";
    defaultOpenKeys?: string[];
}
export declare function Accordion({ items, type, defaultOpenKeys }: AccordionProps): React.JSX.Element;
