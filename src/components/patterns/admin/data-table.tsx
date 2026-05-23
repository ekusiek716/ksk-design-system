import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Checkbox } from "../../ui/checkbox"
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select"

// ─── Types ───

type SortDirection = "asc" | "desc" | null

/** 列の sticky 位置。`true` は `"left"` のエイリアス。 */
type StickyPosition = "left" | "right" | true

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
function getStickyCellProps(
  position: StickyPosition,
  offset = 0,
  isHeader = false
): { className: string; style: React.CSSProperties } {
  const side: "left" | "right" = position === "right" ? "right" : "left"
  const bg = isHeader ? "var(--Surface-Secondary)" : "var(--Surface-Primary)"
  return {
    className: cn(
      "sticky z-[1]",
      // 影で「貼り付き」の境界を視覚化（軽め）
      side === "left"
        ? "shadow-[1px_0_0_var(--Border-Low-Emphasis)]"
        : "shadow-[-1px_0_0_var(--Border-Low-Emphasis)]"
    ),
    style: {
      [side]: offset,
      backgroundColor: bg,
    } as React.CSSProperties,
  }
}

// ─── Inline SVG Icons ───

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
        <path d="M7 3L10.5 7.5H3.5L7 3Z" fill="currentColor" />
        <path d="M7 11L3.5 6.5H10.5L7 11Z" fill="currentColor" opacity="0.25" />
      </svg>
    )
  }
  if (direction === "desc") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
        <path d="M7 3L10.5 7.5H3.5L7 3Z" fill="currentColor" opacity="0.25" />
        <path d="M7 11L3.5 6.5H10.5L7 11Z" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 opacity-40">
      <path d="M7 3L10.5 7.5H3.5L7 3Z" fill="currentColor" />
      <path d="M7 11L3.5 6.5H10.5L7 11Z" fill="currentColor" />
    </svg>
  )
}

function MoreDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="3" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="8" cy="13" r="1.5" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 3V13M3 8H13" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M10.5 7.5V11.5C10.5 12.05 10.05 12.5 9.5 12.5H2.5C1.95 12.5 1.5 12.05 1.5 11.5V4.5C1.5 3.95 1.95 3.5 2.5 3.5H6.5" />
      <path d="M8.5 1.5H12.5V5.5" />
      <path d="M5.5 8.5L12.5 1.5" />
    </svg>
  )
}

function DragHandleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="shrink-0">
      <circle cx="5" cy="3" r="1.2" />
      <circle cx="9" cy="3" r="1.2" />
      <circle cx="5" cy="7" r="1.2" />
      <circle cx="9" cy="7" r="1.2" />
      <circle cx="5" cy="11" r="1.2" />
      <circle cx="9" cy="11" r="1.2" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0 transition-transform duration-200", open && "rotate-90")}
    >
      <path d="M6 4L10 8L6 12" />
    </svg>
  )
}

// ─── 1. DataTable ───

interface DataTableProps extends React.ComponentProps<"div"> {}

function DataTable({ className, children, ...props }: DataTableProps) {
  return (
    <div
      data-slot="data-table"
      className={cn(
        "overflow-x-auto rounded-lg border border-[var(--Border-Low-Emphasis)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── 2. DataTableTable ───

interface DataTableTableProps extends React.ComponentProps<"table"> {}

function DataTableTable({ className, children, ...props }: DataTableTableProps) {
  return (
    <table
      data-slot="data-table-table"
      className={cn("w-full border-collapse", className)}
      {...props}
    >
      {children}
    </table>
  )
}

// ─── 3. DataTableHeader ───

interface DataTableHeaderProps extends React.ComponentProps<"thead"> {}

function DataTableHeader({ className, children, ...props }: DataTableHeaderProps) {
  return (
    <thead
      data-slot="data-table-header"
      className={cn("bg-[var(--Surface-Secondary)]", className)}
      {...props}
    >
      {children}
    </thead>
  )
}

// ─── 4. DataTableBody ───

interface DataTableBodyProps extends React.ComponentProps<"tbody"> {}

function DataTableBody({ className, children, ...props }: DataTableBodyProps) {
  return (
    <tbody
      data-slot="data-table-body"
      className={cn("[&>tr:not(:last-child)]:border-b [&>tr:not(:last-child)]:border-[var(--Border-Low-Emphasis)]", className)}
      {...props}
    >
      {children}
    </tbody>
  )
}

// ─── 5. DataTableRow ───

interface DataTableRowProps extends React.ComponentProps<"tr"> {
  selected?: boolean
}

function DataTableRow({ className, selected, children, ...props }: DataTableRowProps) {
  return (
    <tr
      data-slot="data-table-row"
      data-selected={selected || undefined}
      className={cn(
        "transition-colors hover:bg-[var(--Surface-Secondary)]/50",
        selected && "bg-[var(--Surface-Accent-Primary-Light)] border-l-2 border-l-[var(--Brand-Primary)]",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

// ─── 6. DataTableHead ───

interface DataTableHeadProps extends React.ComponentProps<"th"> {
  sortable?: boolean
  sortDirection?: SortDirection
  onSort?: () => void
  /** 横スクロール時に列を貼り付け表示する */
  sticky?: StickyPosition
  /** 同じ側に複数の固定列がある場合のオフセット(px) */
  stickyOffset?: number
}

function DataTableHead({
  className,
  children,
  sortable,
  sortDirection,
  onSort,
  sticky,
  stickyOffset,
  style,
  ...props
}: DataTableHeadProps) {
  const stickyProps = sticky ? getStickyCellProps(sticky, stickyOffset, true) : null
  return (
    <th
      data-slot="data-table-head"
      className={cn(
        "px-3 py-2.5 text-left typo-label-sm text-[var(--Text-Medium-Emphasis)]",
        sortable && "cursor-pointer select-none",
        stickyProps?.className,
        className
      )}
      style={stickyProps ? { ...stickyProps.style, ...style } : style}
      onClick={sortable ? onSort : undefined}
      aria-sort={
        sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : undefined
      }
      {...props}
    >
      {sortable ? (
        <span className="inline-flex items-center gap-1">
          {children}
          <SortIcon direction={sortDirection ?? null} />
        </span>
      ) : (
        children
      )}
    </th>
  )
}

// ─── 7. DataTableCell ───

const dataTableCellVariants = cva("px-3 py-2.5 typo-body-md text-[var(--Text-High-Emphasis)]", {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    width: {
      auto: "",
      narrow: "w-[48px]",
      checkbox: "w-[40px]",
      action: "w-[48px]",
      sm: "w-[120px]",
      md: "w-[200px]",
      lg: "w-[300px]",
      xl: "w-[400px]",
    },
  },
  defaultVariants: {
    align: "left",
    width: "auto",
  },
})

interface DataTableCellProps
  extends Omit<React.ComponentProps<"td">, "align" | "width">,
    VariantProps<typeof dataTableCellVariants> {
  /** 横スクロール時に列を貼り付け表示する */
  sticky?: StickyPosition
  /** 同じ側に複数の固定列がある場合のオフセット(px) */
  stickyOffset?: number
}

function DataTableCell({
  className,
  align,
  width,
  children,
  sticky,
  stickyOffset,
  style,
  ...props
}: DataTableCellProps) {
  const stickyProps = sticky ? getStickyCellProps(sticky, stickyOffset) : null
  return (
    <td
      data-slot="data-table-cell"
      className={cn(dataTableCellVariants({ align, width }), stickyProps?.className, className)}
      style={stickyProps ? { ...stickyProps.style, ...style } : style}
      {...props}
    >
      {children}
    </td>
  )
}

// ─── 8. DataTableAvatarCell ───

interface DataTableAvatarCellProps extends React.ComponentProps<"td"> {
  src?: string
  fallback?: string
  title: string
  caption?: string
  /** 横スクロール時に列を貼り付け表示する */
  sticky?: StickyPosition
  /** 同じ側に複数の固定列がある場合のオフセット(px) */
  stickyOffset?: number
}

function DataTableAvatarCell({
  className,
  src,
  fallback,
  title,
  caption,
  sticky,
  stickyOffset,
  style,
  ...props
}: DataTableAvatarCellProps) {
  const stickyProps = sticky ? getStickyCellProps(sticky, stickyOffset) : null
  return (
    <td
      data-slot="data-table-avatar-cell"
      className={cn("px-3 py-2.5", stickyProps?.className, className)}
      style={stickyProps ? { ...stickyProps.style, ...style } : style}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          {src && <AvatarImage src={src} alt={title} />}
          <AvatarFallback>{fallback ?? title.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="typo-label-md text-[var(--Text-High-Emphasis)] truncate">{title}</span>
          {caption && (
            <span className="typo-body-sm text-[var(--Text-Low-Emphasis)] truncate">{caption}</span>
          )}
        </div>
      </div>
    </td>
  )
}

// ─── 9. DataTableImageCell ───

interface DataTableImageCellProps extends React.ComponentProps<"td"> {
  src: string
  alt?: string
  title?: string
  caption?: string
  imageSize?: number
}

function DataTableImageCell({
  className,
  src,
  alt,
  title,
  caption,
  imageSize = 40,
  ...props
}: DataTableImageCellProps) {
  return (
    <td
      data-slot="data-table-image-cell"
      className={cn("px-3 py-2.5", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <img
          src={src}
          alt={alt ?? title ?? ""}
          className="shrink-0 rounded-lg object-cover"
          style={{ width: imageSize, height: imageSize }}
        />
        {(title || caption) && (
          <div className="flex flex-col min-w-0">
            {title && (
              <span className="typo-label-md text-[var(--Text-High-Emphasis)] truncate">
                {title}
              </span>
            )}
            {caption && (
              <span className="typo-body-sm text-[var(--Text-Low-Emphasis)] truncate">
                {caption}
              </span>
            )}
          </div>
        )}
      </div>
    </td>
  )
}

// ─── 10. DataTableCheckboxCell ───

interface DataTableCheckboxCellProps extends React.ComponentProps<"td"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
  /** 横スクロール時に列を貼り付け表示する */
  sticky?: StickyPosition
  /** 同じ側に複数の固定列がある場合のオフセット(px) */
  stickyOffset?: number
}

function DataTableCheckboxCell({
  className,
  checked,
  onCheckedChange,
  indeterminate,
  sticky,
  stickyOffset,
  style,
  ...props
}: DataTableCheckboxCellProps) {
  const stickyProps = sticky ? getStickyCellProps(sticky, stickyOffset) : null
  return (
    <td
      data-slot="data-table-checkbox-cell"
      className={cn("w-[40px] px-3 py-2.5", stickyProps?.className, className)}
      style={stickyProps ? { ...stickyProps.style, ...style } : style}
      {...props}
    >
      <Checkbox
        checked={indeterminate ? "indeterminate" : checked}
        onCheckedChange={(v) => onCheckedChange?.(v === true)}
      />
    </td>
  )
}

// ─── 11. DataTableActionCell ───

interface DataTableActionMenuItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  destructive?: boolean
}

interface DataTableActionCellProps extends React.ComponentProps<"td"> {
  items: DataTableActionMenuItem[]
}

function DataTableActionCell({ className, items, ...props }: DataTableActionCellProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <td
      data-slot="data-table-action-cell"
      className={cn("w-[48px] px-3 py-2.5", className)}
      {...props}
    >
      <div ref={ref} className="relative">
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-lg hover:bg-[var(--Surface-Secondary)] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="行メニュー"
          aria-expanded={open}
        >
          <MoreDotsIcon />
        </button>
        {open && (
          <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 typo-body-md text-left transition-colors hover:bg-[var(--Surface-Secondary)]",
                  item.destructive
                    ? "text-[var(--Text-Caution)]"
                    : "text-[var(--Text-High-Emphasis)]"
                )}
                onClick={() => {
                  item.onClick?.()
                  setOpen(false)
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </td>
  )
}

// ─── 12. DataTableInputCell ───

interface DataTableInputCellProps extends Omit<React.ComponentProps<"td">, "onChange"> {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

function DataTableInputCell({
  className,
  value,
  onChange,
  placeholder,
  ...props
}: DataTableInputCellProps) {
  return (
    <td
      data-slot="data-table-input-cell"
      className={cn("px-3 py-1.5", className)}
      {...props}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 typo-body-md text-[var(--Text-High-Emphasis)]",
          "hover:border-[var(--Border-Low-Emphasis)]",
          "focus:border-[var(--Border-Accent-Primary)] focus:outline-none focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]",
          "placeholder:text-[var(--Text-Low-Emphasis)]"
        )}
      />
    </td>
  )
}

// ─── 13. DataTableSelectCell ───

interface DataTableSelectCellProps extends React.ComponentProps<"td"> {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: { label: string; value: string }[]
}

function DataTableSelectCell({
  className,
  value,
  onValueChange,
  placeholder,
  options,
  ...props
}: DataTableSelectCellProps) {
  return (
    <td
      data-slot="data-table-select-cell"
      className={cn("px-3 py-1.5", className)}
      {...props}
    >
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-8 min-w-[120px] typo-body-md border-transparent hover:border-[var(--Border-Low-Emphasis)]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </td>
  )
}

// ─── 14. DataTableNumberCell ───

interface DataTableNumberCellProps extends React.ComponentProps<"td"> {
  value: number | string
  prefix?: string
  suffix?: string
}

function DataTableNumberCell({
  className,
  value,
  prefix,
  suffix,
  children,
  ...props
}: DataTableNumberCellProps) {
  return (
    <td
      data-slot="data-table-number-cell"
      className={cn(
        "px-3 py-2.5 text-right typo-body-md tabular-nums text-[var(--Text-High-Emphasis)]",
        className
      )}
      {...props}
    >
      {prefix}
      {typeof value === "number" ? value.toLocaleString() : value}
      {suffix}
    </td>
  )
}

// ─── 15. DataTableDragHandleCell ───

interface DataTableDragHandleCellProps extends React.ComponentProps<"td"> {}

function DataTableDragHandleCell({ className, ...props }: DataTableDragHandleCellProps) {
  return (
    <td
      data-slot="data-table-drag-handle-cell"
      className={cn("w-[36px] px-2 py-2.5 cursor-grab text-[var(--Text-Low-Emphasis)]", className)}
      {...props}
    >
      <DragHandleIcon />
    </td>
  )
}

// ─── 16. DataTableLinkCell ───

interface DataTableLinkCellProps extends React.ComponentProps<"td"> {
  href: string
  external?: boolean
  children: React.ReactNode
}

function DataTableLinkCell({
  className,
  href,
  external,
  children,
  ...props
}: DataTableLinkCellProps) {
  return (
    <td
      data-slot="data-table-link-cell"
      className={cn("px-3 py-2.5", className)}
      {...props}
    >
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="inline-flex items-center gap-1 typo-body-md text-[var(--Text-Accent-Primary)] hover:underline"
      >
        {children}
        {external && <ExternalLinkIcon />}
      </a>
    </td>
  )
}

// ─── 17. DataTableBulkActions ───

interface DataTableBulkActionsProps extends React.ComponentProps<"div"> {
  selectedCount: number
}

function DataTableBulkActions({
  className,
  selectedCount,
  children,
  ...props
}: DataTableBulkActionsProps) {
  if (selectedCount === 0) return null
  return (
    <div
      data-slot="data-table-bulk-actions"
      className={cn(
        "flex items-center gap-3 rounded-lg bg-[var(--Surface-Accent-Primary-Light)] px-4 py-3",
        className
      )}
      role="toolbar"
      aria-label={`${selectedCount}件を選択中`}
      {...props}
    >
      <span className="typo-label-md text-[var(--Text-High-Emphasis)] shrink-0">
        {selectedCount}件を選択中
      </span>
      {children}
    </div>
  )
}

// ─── 18. DataTableSectionRow ───

interface DataTableSectionRowProps extends React.ComponentProps<"tr"> {
  label: string
  count?: number
  open?: boolean
  onToggle?: () => void
  colSpan?: number
}

function DataTableSectionRow({
  className,
  label,
  count,
  open = true,
  onToggle,
  colSpan,
  ...props
}: DataTableSectionRowProps) {
  return (
    <tr
      data-slot="data-table-section-row"
      className={cn("bg-[var(--Surface-Secondary)] border-b border-[var(--Border-Low-Emphasis)]", className)}
      {...props}
    >
      <td colSpan={colSpan} className="px-3 py-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 typo-label-md text-[var(--Text-High-Emphasis)]"
          onClick={onToggle}
          aria-expanded={open}
        >
          <ChevronIcon open={open} />
          {label}
          {count !== undefined && (
            <span className="typo-body-sm text-[var(--Text-Low-Emphasis)]">({count})</span>
          )}
        </button>
      </td>
    </tr>
  )
}

// ─── 19. DataTableAddRow ───

interface DataTableAddRowProps extends React.ComponentProps<"tr"> {
  label?: string
  onClick?: () => void
  colSpan?: number
}

function DataTableAddRow({
  className,
  label = "追加する",
  onClick,
  colSpan,
  ...props
}: DataTableAddRowProps) {
  return (
    <tr
      data-slot="data-table-add-row"
      className={cn("border-t border-dashed border-[var(--Border-Low-Emphasis)]", className)}
      {...props}
    >
      <td colSpan={colSpan} className="px-3 py-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 typo-label-md text-[var(--Text-Accent-Primary)] hover:underline"
          onClick={onClick}
        >
          <PlusIcon />
          {label}
        </button>
      </td>
    </tr>
  )
}

// ─── 20. DataTableEmptyState ───

interface DataTableEmptyStateProps extends React.ComponentProps<"tr"> {
  icon?: React.ReactNode
  message?: string
  description?: string
  action?: React.ReactNode
  colSpan?: number
}

function DataTableEmptyState({
  className,
  icon,
  message = "データがありません",
  description,
  action,
  colSpan,
  ...props
}: DataTableEmptyStateProps) {
  return (
    <tr
      data-slot="data-table-empty-state"
      className={cn("", className)}
      {...props}
    >
      <td colSpan={colSpan} className="px-3 py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          {icon && (
            <div className="text-[var(--Text-Low-Emphasis)]">{icon}</div>
          )}
          <p className="typo-heading-md text-[var(--Text-Medium-Emphasis)]">{message}</p>
          {description && (
            <p className="typo-body-md text-[var(--Text-Low-Emphasis)] max-w-sm">{description}</p>
          )}
          {action && <div className="mt-2">{action}</div>}
        </div>
      </td>
    </tr>
  )
}

// ─── Exports ───

export {
  DataTable,
  DataTableTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
  DataTableAvatarCell,
  DataTableImageCell,
  DataTableCheckboxCell,
  DataTableActionCell,
  DataTableInputCell,
  DataTableSelectCell,
  DataTableNumberCell,
  DataTableDragHandleCell,
  DataTableLinkCell,
  DataTableBulkActions,
  DataTableSectionRow,
  DataTableAddRow,
  DataTableEmptyState,
}

export { getStickyCellProps }
export type { SortDirection, DataTableActionMenuItem, StickyPosition }
