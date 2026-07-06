import React from "react";
export interface FooterLink {
    label: string;
    onPress?: () => void;
}
export interface FooterProps {
    copyright?: string;
    links?: FooterLink[];
}
export declare function Footer({ copyright, links }: FooterProps): React.JSX.Element;
