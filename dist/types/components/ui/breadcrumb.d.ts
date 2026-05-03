import * as React from "react";
interface BreadcrumbProps extends React.ComponentProps<"nav"> {
    /**
     * nav 要素の aria-label。i18n 対応: 英語では "Breadcrumb" を渡す。
     * @default "パンくずリスト"
     */
    label?: string;
}
declare function Breadcrumb({ label, ...props }: BreadcrumbProps): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbLink({ className, ...props }: React.ComponentProps<"a">): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">): import("react/jsx-runtime").JSX.Element;
declare function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
