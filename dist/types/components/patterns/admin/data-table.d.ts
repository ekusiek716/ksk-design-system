import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { SelectContent } from "../../ui/select";
type SortDirection = "asc" | "desc" | null;
/** 列の sticky 位置。`true` は `"left"` のエイリアス。 */
type StickyPosition = "left" | "right" | true;
type DataTableRowId = string | number;
type DataTableSelectionMode = "none" | "single" | "multi";
type DataTableColumnAlign = "left" | "center" | "right";
type DataTableEditTrigger = "click" | "doubleClick" | "focus" | "manual";
type DataTableSelectContentPosition = React.ComponentProps<typeof SelectContent>["position"];
type DataTableColumnWidth = "auto" | "narrow" | "checkbox" | "action" | "sm" | "md" | "lg" | "xl" | "flex";
interface DataTableSortState {
    key: string;
    direction: Exclude<SortDirection, null>;
}
interface DataTableCommitOptions {
    close?: boolean;
}
interface DataTableCellContext<TRow, TValue = unknown> {
    row: TRow;
    index: number;
    rowIndex: number;
    rowId: DataTableRowId;
    column: DataTableColumn<TRow>;
    value: TValue;
    isEditing: boolean;
    startEdit: () => void;
    commitEdit: (row: TRow, options?: DataTableCommitOptions) => void;
    commitValue: (value: TValue, options?: DataTableCommitOptions) => void;
    cancelEdit: () => void;
}
interface DataTableColumnEditOptions {
    trigger?: DataTableEditTrigger;
}
interface DataTableColumnOption<TValue extends string = string> {
    label: string;
    value: TValue;
    icon?: React.ReactNode;
}
type DataTableCellRenderer<TRow, TValue> = {
    bivarianceHack(context: DataTableCellContext<TRow, TValue>): React.ReactNode;
}["bivarianceHack"];
type DataTableCellCommitHandler<TRow, TValue> = {
    bivarianceHack(row: TRow, value: TValue, index: number): void;
}["bivarianceHack"];
type DataTableRowCommitHandler<TRow> = {
    bivarianceHack(row: TRow, previousRow: TRow, index: number): void;
}["bivarianceHack"];
type DataTableRowClickHandler<TRow> = {
    bivarianceHack(row: TRow, index: number, rowId: DataTableRowId, event: React.MouseEvent<HTMLTableRowElement> | React.KeyboardEvent<HTMLTableRowElement>): void;
}["bivarianceHack"];
interface DataTableColumn<TRow, TValue = any> {
    key: string;
    header: React.ReactNode;
    render?: (row: TRow, index: number) => React.ReactNode;
    value?: (row: TRow, index: number) => TValue;
    cell?: DataTableCellRenderer<TRow, TValue>;
    editCell?: DataTableCellRenderer<TRow, TValue>;
    sortValue?: (row: TRow, index: number) => string | number | Date | null | undefined;
    sortable?: boolean;
    edit?: DataTableColumnEditOptions;
    align?: DataTableColumnAlign;
    width?: DataTableColumnWidth;
    className?: string;
    headerClassName?: string;
    sticky?: StickyPosition;
    stickyOffset?: number;
    editable?: boolean;
    editValue?: (row: TRow, index: number) => string;
    onEditChange?: (row: TRow, value: string, index: number) => void;
    onCellCommit?: DataTableCellCommitHandler<TRow, TValue>;
    onRowCommit?: DataTableRowCommitHandler<TRow>;
    onEditCancel?: (row: TRow, index: number) => void;
    editOptions?: DataTableColumnOption<string>[];
}
interface DataTableSelectionState {
    mode?: DataTableSelectionMode;
    selectedRowIds?: DataTableRowId[];
    defaultSelectedRowIds?: DataTableRowId[];
    onSelectionChange?: (rowIds: DataTableRowId[]) => void;
}
interface DataTableSection {
    key: string;
    label: string;
    count?: number;
    open?: boolean;
    onToggle?: () => void;
    stickyLeft?: boolean;
    stickyOffset?: number;
    headingSize?: DataTableSectionHeadingSize;
}
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
interface DataTableProps<TRow = unknown> extends React.ComponentProps<"div"> {
    rows?: readonly TRow[];
    columns?: readonly DataTableColumn<TRow>[];
    getRowId?: (row: TRow, index: number) => DataTableRowId;
    onRowCommit?: DataTableRowCommitHandler<TRow>;
    sort?: DataTableSortState | null;
    defaultSort?: DataTableSortState | null;
    onSortChange?: (sort: DataTableSortState | null) => void;
    selection?: DataTableSelectionState;
    emptyMessage?: string;
    emptyDescription?: string;
    emptyAction?: React.ReactNode;
    sectionRow?: (row: TRow, index: number) => DataTableSection | null | undefined;
    onRowClick?: DataTableRowClickHandler<TRow>;
    rowClickable?: boolean;
    tableClassName?: string;
    rowClassName?: string | ((row: TRow, index: number) => string | undefined);
}
declare function DataTable<TRow = unknown>({ className, children, rows, columns, getRowId, onRowCommit, sort, defaultSort, onSortChange, selection, emptyMessage, emptyDescription, emptyAction, sectionRow, onRowClick, rowClickable, tableClassName, rowClassName, ...props }: DataTableProps<TRow>): React.JSX.Element;
interface DataTableTableProps extends React.ComponentProps<"table"> {
}
declare function DataTableTable({ className, children, ...props }: DataTableTableProps): React.JSX.Element;
interface DataTableHeaderProps extends React.ComponentProps<"thead"> {
}
declare function DataTableHeader({ className, children, ...props }: DataTableHeaderProps): React.JSX.Element;
interface DataTableBodyProps extends React.ComponentProps<"tbody"> {
}
declare function DataTableBody({ className, children, ...props }: DataTableBodyProps): React.JSX.Element;
interface DataTableRowProps extends React.ComponentProps<"tr"> {
    selected?: boolean;
    clickable?: boolean;
    onRowClick?: (event: React.MouseEvent<HTMLTableRowElement> | React.KeyboardEvent<HTMLTableRowElement>) => void;
}
declare function DataTableRow({ className, selected, clickable, onRowClick, onClick, onKeyDown, role, tabIndex, children, ...props }: DataTableRowProps): React.JSX.Element;
interface DataTableHeadProps extends Omit<React.ComponentProps<"th">, "width"> {
    sortable?: boolean;
    sortDirection?: SortDirection;
    onSort?: () => void;
    width?: DataTableColumnWidth;
    /** 横スクロール時に列を貼り付け表示する */
    sticky?: StickyPosition;
    /** 同じ側に複数の固定列がある場合のオフセット(px) */
    stickyOffset?: number;
}
declare function DataTableHead({ className, children, sortable, sortDirection, onSort, width, sticky, stickyOffset, style, ...props }: DataTableHeadProps): React.JSX.Element;
declare const dataTableCellVariants: (props?: {
    align?: "center" | "left" | "right";
    width?: "checkbox" | "auto" | "flex" | "action" | "sm" | "lg" | "xl" | "md" | "narrow";
} & import("class-variance-authority/types").ClassProp) => string;
interface DataTableCellProps extends Omit<React.ComponentProps<"td">, "align" | "width">, VariantProps<typeof dataTableCellVariants> {
    clickable?: boolean;
    /** 横スクロール時に列を貼り付け表示する */
    sticky?: StickyPosition;
    /** 同じ側に複数の固定列がある場合のオフセット(px) */
    stickyOffset?: number;
}
declare function DataTableCell({ className, align, width, children, clickable, sticky, stickyOffset, style, ...props }: DataTableCellProps): React.JSX.Element;
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
declare function DataTableAvatarCell({ className, src, fallback, title, caption, sticky, stickyOffset, style, ...props }: DataTableAvatarCellProps): React.JSX.Element;
interface DataTableImageCellProps extends React.ComponentProps<"td"> {
    src: string;
    alt?: string;
    title?: string;
    caption?: string;
    imageSize?: number;
}
declare function DataTableImageCell({ className, src, alt, title, caption, imageSize, ...props }: DataTableImageCellProps): React.JSX.Element;
interface DataTableCheckboxCellProps extends React.ComponentProps<"td"> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    indeterminate?: boolean;
    /**
     * 描画する要素。ヘッダー行（`<tr>` in `<thead>`）では `"th"` を指定して
     * `<th>` の中に `<td>` がネストされる HTML 妥当性 / hydration エラーを避ける。
     * @default "td"
     */
    as?: "td" | "th";
    /** 横スクロール時に列を貼り付け表示する */
    sticky?: StickyPosition;
    /** 同じ側に複数の固定列がある場合のオフセット(px) */
    stickyOffset?: number;
}
declare function DataTableCheckboxCell({ className, checked, onCheckedChange, indeterminate, as: Element, sticky, stickyOffset, style, ...props }: DataTableCheckboxCellProps): React.JSX.Element;
interface DataTableActionMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    destructive?: boolean;
}
interface DataTableActionCellProps extends React.ComponentProps<"td"> {
    items: DataTableActionMenuItem[];
}
declare function DataTableActionCell({ className, items, ...props }: DataTableActionCellProps): React.JSX.Element;
interface DataTableInputCellProps extends Omit<React.ComponentProps<"td">, "onChange" | "width">, Pick<DataTableCellProps, "width" | "sticky" | "stickyOffset"> {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}
declare function DataTableInputCell({ className, value, onChange, placeholder, width, sticky, stickyOffset, style, ...props }: DataTableInputCellProps): React.JSX.Element;
interface DataTableSelectCellProps extends Omit<React.ComponentProps<"td">, "width">, Pick<DataTableCellProps, "width" | "sticky" | "stickyOffset"> {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    options: readonly {
        label: string;
        value: string;
    }[];
    contentPosition?: DataTableSelectContentPosition;
    triggerClassName?: string;
    contentClassName?: string;
}
declare function DataTableSelectCell({ className, value, onValueChange, placeholder, options, width, sticky, stickyOffset, style, contentPosition, triggerClassName, contentClassName, ...props }: DataTableSelectCellProps): React.JSX.Element;
interface DataTableDateCellProps extends Omit<React.ComponentProps<"td">, "value" | "onChange" | "width">, Pick<DataTableCellProps, "width" | "sticky" | "stickyOffset"> {
    value?: Date;
    onValueChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    dateFormat?: string;
    triggerLabel?: string;
    pickerClassName?: string;
}
declare function DataTableDateCell({ className, value, onValueChange, placeholder, disabled, dateFormat, triggerLabel, pickerClassName, width, sticky, stickyOffset, style, ...props }: DataTableDateCellProps): React.JSX.Element;
interface DataTableNumberCellProps extends React.ComponentProps<"td"> {
    value: number | string;
    prefix?: string;
    suffix?: string;
}
declare function DataTableNumberCell({ className, value, prefix, suffix, children, ...props }: DataTableNumberCellProps): React.JSX.Element;
interface DataTableDragHandleCellProps extends React.ComponentProps<"td"> {
}
declare function DataTableDragHandleCell({ className, ...props }: DataTableDragHandleCellProps): React.JSX.Element;
interface DataTableLinkCellProps extends React.ComponentProps<"td"> {
    href: string;
    external?: boolean;
    children: React.ReactNode;
}
declare function DataTableLinkCell({ className, href, external, children, ...props }: DataTableLinkCellProps): React.JSX.Element;
interface DataTableBulkActionsProps extends React.ComponentProps<"div"> {
    selectedCount: number;
}
declare function DataTableBulkActions({ className, selectedCount, children, ...props }: DataTableBulkActionsProps): React.JSX.Element;
type DataTableSectionHeadingSize = "sm" | "md" | "lg";
interface DataTableSectionRowProps extends React.ComponentProps<"tr"> {
    label: string;
    count?: number;
    open?: boolean;
    onToggle?: () => void;
    colSpan?: number;
    stickyLeft?: boolean;
    stickyOffset?: number;
    headingSize?: DataTableSectionHeadingSize;
    contentClassName?: string;
    buttonClassName?: string;
}
declare function DataTableSectionRow({ className, label, count, open, onToggle, colSpan, stickyLeft, stickyOffset, headingSize, contentClassName, buttonClassName, ...props }: DataTableSectionRowProps): React.JSX.Element;
interface DataTableAddRowProps extends React.ComponentProps<"tr"> {
    label?: string;
    onClick?: () => void;
    colSpan?: number;
}
declare function DataTableAddRow({ className, label, onClick, colSpan, ...props }: DataTableAddRowProps): React.JSX.Element;
interface DataTableEmptyStateProps extends React.ComponentProps<"tr"> {
    icon?: React.ReactNode;
    message?: string;
    description?: string;
    action?: React.ReactNode;
    colSpan?: number;
}
declare function DataTableEmptyState({ className, icon, message, description, action, colSpan, ...props }: DataTableEmptyStateProps): React.JSX.Element;
type DataTableHelperColumnBase<TRow, TValue> = Pick<DataTableColumn<TRow, TValue>, "key" | "header" | "sortable" | "align" | "width" | "className" | "headerClassName" | "sticky" | "stickyOffset" | "edit">;
interface DataTableDateColumnConfig<TRow> extends DataTableHelperColumnBase<TRow, Date | undefined> {
    value: (row: TRow, index: number) => Date | undefined;
    onCommit?: (row: TRow, value: Date | undefined, index: number) => void;
    placeholder?: string;
    emptyLabel?: string;
    format?: (value: Date, row: TRow, index: number) => React.ReactNode;
}
type DataTableChipColumnValue<TValue extends string = string> = TValue | readonly TValue[] | undefined;
interface DataTableChipColumnConfig<TRow, TValue extends string = string> extends DataTableHelperColumnBase<TRow, DataTableChipColumnValue<TValue>> {
    value: (row: TRow, index: number) => DataTableChipColumnValue<TValue>;
    options: readonly DataTableColumnOption<TValue>[];
    onCommit?: (row: TRow, value: DataTableChipColumnValue<TValue>, index: number) => void;
    multiple?: boolean;
    emptyLabel?: string;
}
interface DataTableSelectColumnConfig<TRow, TValue extends string = string> extends DataTableHelperColumnBase<TRow, TValue | undefined> {
    value: (row: TRow, index: number) => TValue | undefined;
    options: readonly DataTableColumnOption<TValue>[];
    onCommit?: (row: TRow, value: TValue, index: number) => void;
    placeholder?: string;
    emptyLabel?: string;
    contentPosition?: DataTableSelectContentPosition;
}
declare function createDataTableDateColumn<TRow>({ value, onCommit, placeholder, emptyLabel, format, ...column }: DataTableDateColumnConfig<TRow>): DataTableColumn<TRow, Date | undefined>;
declare function createDataTableChipColumn<TRow, TValue extends string = string>({ value, options, onCommit, multiple, emptyLabel, ...column }: DataTableChipColumnConfig<TRow, TValue>): DataTableColumn<TRow, DataTableChipColumnValue<TValue>>;
declare function createDataTableSelectColumn<TRow, TValue extends string = string>({ value, options, onCommit, placeholder, emptyLabel, contentPosition, ...column }: DataTableSelectColumnConfig<TRow, TValue>): DataTableColumn<TRow, TValue | undefined>;
export { DataTable, DataTableTable, DataTableHeader, DataTableBody, DataTableRow, DataTableHead, DataTableCell, DataTableAvatarCell, DataTableImageCell, DataTableCheckboxCell, DataTableActionCell, DataTableInputCell, DataTableSelectCell, DataTableDateCell, DataTableNumberCell, DataTableDragHandleCell, DataTableLinkCell, DataTableBulkActions, DataTableSectionRow, DataTableAddRow, DataTableEmptyState, createDataTableDateColumn, createDataTableChipColumn, createDataTableSelectColumn, };
export { getStickyCellProps };
export type { SortDirection, DataTableActionMenuItem, StickyPosition, DataTableRowId, DataTableSelectionMode, DataTableSelectContentPosition, DataTableSortState, DataTableEditTrigger, DataTableColumnWidth, DataTableCommitOptions, DataTableRowClickHandler, DataTableCellContext, DataTableColumnEditOptions, DataTableColumnOption, DataTableRowCommitHandler, DataTableColumn, DataTableSelectionState, DataTableSection, DataTableProps, DataTableDateColumnConfig, DataTableChipColumnValue, DataTableChipColumnConfig, DataTableSelectColumnConfig, DataTableDateCellProps, DataTableSectionRowProps, DataTableSectionHeadingSize, };
