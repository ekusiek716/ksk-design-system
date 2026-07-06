import * as React from "react";
interface BreadcrumbProps extends React.ComponentProps<"nav"> {
    /**
     * nav 要素の aria-label。i18n 対応: 英語では "Breadcrumb" を渡す。
     * @default "パンくずリスト"
     */
    label?: string;
}
declare function Breadcrumb({ label, ...props }: BreadcrumbProps): React.JSX.Element;
declare function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">): React.JSX.Element;
declare function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">): React.JSX.Element;
declare function BreadcrumbLink({ className, ...props }: React.ComponentProps<"a">): React.JSX.Element;
declare function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">): React.JSX.Element;
declare function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">): React.JSX.Element;
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
