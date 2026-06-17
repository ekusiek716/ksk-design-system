export interface FooterLink {
    label: string;
    onPress?: () => void;
}
export interface FooterProps {
    copyright?: string;
    links?: FooterLink[];
}
export declare function Footer({ copyright, links }: FooterProps): import("react/jsx-runtime").JSX.Element;
