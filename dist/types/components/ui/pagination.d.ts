import * as React from "react";
import { buttonVariants } from "./button";
import type { VariantProps } from "class-variance-authority";
declare function Pagination({ className, ...props }: React.ComponentProps<"nav">): React.JSX.Element;
declare function PaginationContent({ className, ...props }: React.ComponentProps<"ul">): React.JSX.Element;
declare function PaginationItem({ ...props }: React.ComponentProps<"li">): React.JSX.Element;
type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<VariantProps<typeof buttonVariants>, "size"> & React.ComponentProps<"a">;
declare function PaginationLink({ className, isActive, size, ...props }: PaginationLinkProps): React.JSX.Element;
type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink> & {
    /** aria-label とボタンテキスト。i18n 対応: 英語では "Previous" を渡す。@default "前へ" */
    label?: string;
};
declare function PaginationPrevious({ className, label, ...props }: PaginationPreviousProps): React.JSX.Element;
type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
    /** aria-label とボタンテキスト。i18n 対応: 英語では "Next" を渡す。@default "次へ" */
    label?: string;
};
declare function PaginationNext({ className, label, ...props }: PaginationNextProps): React.JSX.Element;
type PaginationEllipsisProps = React.ComponentProps<"span"> & {
    /** スクリーンリーダー向けラベル。@default "その他のページ" */
    label?: string;
};
declare function PaginationEllipsis({ className, label, ...props }: PaginationEllipsisProps): React.JSX.Element;
export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis };
