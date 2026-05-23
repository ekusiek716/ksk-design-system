import * as React from "react";
import { type VariantProps } from "class-variance-authority";
type SortDirection = "asc" | "desc" | null;
/** 列の sticky 位置。`true` は `"left"` のエイリアス。 */
type StickyPosition = "left" | "right" | true;
/**
 * 横スクロール時に列を「貼り付け」表示するためのスタイル/クラスを生成するヘルパ。
 *
 * `DataTable` 自体が `overflow-x-auto` のスクロールコンテナになっているため、
 * 子の `<th>` / `<td>` に `position: sticky` と `left`/`right` を指定するだけで
 * 縦方向（行）にもスクロールしながら水平方向の固定が可能になります。
 *
 * 行ホバー時の背景色を上書きするため、固定列は不透明な `--Surface-Primary` を
 * 明示的に塗ります（ヘッダー行は `--Surface-Secondary`）。
 *
 * @param position - "left" | "right" | true (= "left")
 * @param offset - 同じ側に複数の固定列がある場合のオフセット(px)
 * @param isHeader - ヘッダー行のセルの場合は true
 */
declare function getStickyCellProps(position: StickyPosition, offset?: number, isHeader?: boolean): {
    className: string;
    style: React.CSSProperties;
};
interface DataTableProps extends React.ComponentProps<"div"> {
}
declare function DataTable({ className, children, ...props }: DataTableProps): import("react/jsx-runtime").JSX.Element;
interface DataTableTableProps extends React.ComponentProps<"table"> {
}
declare function DataTableTable({ className, children, ...props }: DataTableTableProps): import("react/jsx-runtime").JSX.Element;
interface DataTableHeaderProps extends React.ComponentProps<"thead"> {
}
declare function DataTableHeader({ className, children, ...props }: DataTableHeaderProps): import("react/jsx-runtime").JSX.Element;
interface DataTableBodyProps extends React.ComponentProps<"tbody"> {
}
declare function DataTableBody({ className, children, ...props }: DataTableBodyProps): import("react/jsx-runtime").JSX.Element;
interface DataTableRowProps extends React.ComponentProps<"tr"> {
    selected?: boolean;
}
declare function DataTableRow({ className, selected, children, ...props }: DataTableRowProps): import("react/jsx-runtime").JSX.Element;
interface DataTableHeadProps extends React.ComponentProps<"th"> {
    sortable?: boolean;
    sortDirection?: SortDirection;
    onSort?: () => void;
    /** 横スクロール時に列を貼り付け表示する */
    sticky?: StickyPosition;
    /** 同じ側に複数の固定列がある場合のオフセット(px) */
    stickyOffset?: number;
}
declare function DataTableHead({ className, children, sortable, sortDirection, onSort, sticky, stickyOffset, style, ...props }: DataTableHeadProps): import("react/jsx-runtime").JSX.Element;
declare const dataTableCellVariants: (props?: {
    align?: "center" | "left" | "right";
    width?: "checkbox" | "auto" | "sm" | "lg" | "xl" | "md" | "action" | "narrow";
} & import("class-variance-authority/types").ClassProp) => string;
interface DataTableCellProps extends Omit<React.ComponentProps<"td">, "align" | "width">, VariantProps<typeof dataTableCellVariants> {
    /** 横スクロール時に列を貼り付け表示する */
    sticky?: StickyPosition;
    /** 同じ側に複数の固定列がある場合のオフセット(px) */
    stickyOffset?: number;
}
declare function DataTableCell({ className, align, width, children, sticky, stickyOffset, style, ...props }: DataTableCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableAvatarCellProps extends React.ComponentProps<"td"> {
    src?: string;
    fallback?: string;
    title: string;
    caption?: string;
    /** 横スクロール時に列を貼り付け表示する */
    sticky?: StickyPosition;
    /** 同じ側に複数の固定列がある場合のオフセット(px) */
    stickyOffset?: number;
}
declare function DataTableAvatarCell({ className, src, fallback, title, caption, sticky, stickyOffset, style, ...props }: DataTableAvatarCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableImageCellProps extends React.ComponentProps<"td"> {
    src: string;
    alt?: string;
    title?: string;
    caption?: string;
    imageSize?: number;
}
declare function DataTableImageCell({ className, src, alt, title, caption, imageSize, ...props }: DataTableImageCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableCheckboxCellProps extends React.ComponentProps<"td"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    indeterminate?: boolean;
    /** 横スクロール時に列を貼り付け表示する */
    sticky?: StickyPosition;
    /** 同じ側に複数の固定列がある場合のオフセット(px) */
    stickyOffset?: number;
}
declare function DataTableCheckboxCell({ className, checked, onCheckedChange, indeterminate, sticky, stickyOffset, style, ...props }: DataTableCheckboxCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableActionMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    destructive?: boolean;
}
interface DataTableActionCellProps extends React.ComponentProps<"td"> {
    items: DataTableActionMenuItem[];
}
declare function DataTableActionCell({ className, items, ...props }: DataTableActionCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableInputCellProps extends Omit<React.ComponentProps<"td">, "onChange"> {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}
declare function DataTableInputCell({ className, value, onChange, placeholder, ...props }: DataTableInputCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableSelectCellProps extends React.ComponentProps<"td"> {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    options: {
        label: string;
        value: string;
    }[];
}
declare function DataTableSelectCell({ className, value, onValueChange, placeholder, options, ...props }: DataTableSelectCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableNumberCellProps extends React.ComponentProps<"td"> {
    value: number | string;
    prefix?: string;
    suffix?: string;
}
declare function DataTableNumberCell({ className, value, prefix, suffix, children, ...props }: DataTableNumberCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableDragHandleCellProps extends React.ComponentProps<"td"> {
}
declare function DataTableDragHandleCell({ className, ...props }: DataTableDragHandleCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableLinkCellProps extends React.ComponentProps<"td"> {
    href: string;
    external?: boolean;
    children: React.ReactNode;
}
declare function DataTableLinkCell({ className, href, external, children, ...props }: DataTableLinkCellProps): import("react/jsx-runtime").JSX.Element;
interface DataTableBulkActionsProps extends React.ComponentProps<"div"> {
    selectedCount: number;
}
declare function DataTableBulkActions({ className, selectedCount, children, ...props }: DataTableBulkActionsProps): import("react/jsx-runtime").JSX.Element;
interface DataTableSectionRowProps extends React.ComponentProps<"tr"> {
    label: string;
    count?: number;
    open?: boolean;
    onToggle?: () => void;
    colSpan?: number;
}
declare function DataTableSectionRow({ className, label, count, open, onToggle, colSpan, ...props }: DataTableSectionRowProps): import("react/jsx-runtime").JSX.Element;
interface DataTableAddRowProps extends React.ComponentProps<"tr"> {
    label?: string;
    onClick?: () => void;
    colSpan?: number;
}
declare function DataTableAddRow({ className, label, onClick, colSpan, ...props }: DataTableAddRowProps): import("react/jsx-runtime").JSX.Element;
interface DataTableEmptyStateProps extends React.ComponentProps<"tr"> {
    icon?: React.ReactNode;
    message?: string;
    description?: string;
    action?: React.ReactNode;
    colSpan?: number;
}
declare function DataTableEmptyState({ className, icon, message, description, action, colSpan, ...props }: DataTableEmptyStateProps): import("react/jsx-runtime").JSX.Element;
export { DataTable, DataTableTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell, DataTableAvatarCell, DataTableImageCell, DataTableCheckboxCell, DataTableActionCell, DataTableInputCell, DataTableSelectCell, DataTableNumberCell, DataTableDragHandleCell, DataTableLinkCell, DataTableBulkActions, DataTableSectionRow, DataTableAddRow, DataTableEmptyState, };
export { getStickyCellProps };
export type { SortDirection, DataTableActionMenuItem, StickyPosition };
