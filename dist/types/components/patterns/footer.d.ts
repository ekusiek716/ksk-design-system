import * as React from "react";
interface FooterLinkGroup {
    title: string;
    links: {
        label: string;
        href?: string;
        onClick?: () => void;
    }[];
}
interface FooterProps {
    logo?: React.ReactNode;
    linkGroups?: FooterLinkGroup[];
    paymentIcons?: string[];
    socialLinks?: {
        label: string;
        href?: string;
        icon: React.ReactNode;
    }[];
    copyright?: string;
    className?: string;
}
declare function Footer({ logo, linkGroups, paymentIcons, socialLinks, copyright, className, }: FooterProps): import("react/jsx-runtime").JSX.Element;
export { Footer };
export type { FooterProps, FooterLinkGroup };
