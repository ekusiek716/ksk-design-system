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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu"
import {
  ArrowUp2,
  ArrowDown2,
  ArrowSwapVertical,
  More,
  Add,
  ExportSquare,
  HamburgerMenu,
  ArrowRight2,
} from "iconsax-reactjs"

// ─── Types ───

type SortDirection = "asc" | "desc" | null

/** 列の sticky 位置。`true` は `"left"` のエイリアス。 */
type StickyPosition = "left" | "right" | true

type DataTableRowId = string | number
type DataTableSelectionMode = "none" | "single" | "multi"
type DataTableColumnAlign = "left" | "center" | "right"
type DataTableColumnWidth =
  | "auto"
  | "narrow"
  | "checkbox"
  | "action"
  | "sm"
  | "md"
  | "lg"
  | "xl"

interface DataTableSortState {
  key: string
  direction: Exclude<SortDirection, null>
}

interface DataTableColumn<TRow> {
  key: string
  header: React.ReactNode
  render?: (row: TRow, index: number) => React.ReactNode
  value?: (row: TRow, index: number) => React.ReactNode
  sortValue?: (row: TRow, index: number) => string | number | Date | null | undefined
  sortable?: boolean
  align?: DataTableColumnAlign
  width?: DataTableColumnWidth
  className?: string
  headerClassName?: string
  sticky?: StickyPosition
  stickyOffset?: number
  editable?: boolean
  editValue?: (row: TRow, index: number) => string
  onEditChange?: (row: TRow, value: string, index: number) => void
  editOptions?: { label: string; value: string }[]
}

interface DataTableSelectionState {
  mode?: DataTableSelectionMode
  selectedRowIds?: DataTableRowId[]
  defaultSelectedRowIds?: DataTableRowId[]
  onSelectionChange?: (rowIds: DataTableRowId[]) => void
}

interface DataTableSection {
  key: string
  label: string
  count?: number
  open?: boolean
  onToggle?: () => void
}

interface IndexedRow<TRow> {
  row: TRow
  index: number
}

interface SectionedRow<TRow> extends IndexedRow<TRow> {
  section?: DataTableSection | null
  renderSection: boolean
  sectionOpen: boolean
}

const EMPTY_ROWS: readonly unknown[] = []
const EMPTY_COLUMNS: readonly DataTableColumn<unknown>[] = []

function resolveRowId<TRow>(
  row: TRow,
  index: number,
  getRowId?: (row: TRow, index: number) => DataTableRowId
): DataTableRowId {
  if (getRowId) return getRowId(row, index)
  if (row && typeof row === "object" && "id" in row) {
    const id = (row as { id?: unknown }).id
    if (typeof id === "string" || typeof id === "number") return id
  }
  return index
}

function getColumnFallbackValue<TRow>(row: TRow, key: string): React.ReactNode {
  if (!row || typeof row !== "object" || !(key in row)) return null
  return (row as Record<string, React.ReactNode>)[key]
}

function getColumnValue<TRow>(
  row: TRow,
  index: number,
  column: DataTableColumn<TRow>
): React.ReactNode {
  if (column.render) return column.render(row, index)
  if (column.value) return column.value(row, index)
  return getColumnFallbackValue(row, column.key)
}

function getColumnSortValue<TRow>(
  row: TRow,
  index: number,
  column: DataTableColumn<TRow>
): string | number | Date | null | undefined {
  if (column.sortValue) return column.sortValue(row, index)
  const value = column.value ? column.value(row, index) : getColumnFallbackValue(row, column.key)
  if (value === null) return null
  if (value === undefined) return undefined
  if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
    return value
  }
  return String(value)
}

function compareDataTableValues(
  a: string | number | Date | null | undefined,
  b: string | number | Date | null | undefined
) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  const normalizedA = a instanceof Date ? a.getTime() : a
  const normalizedB = b instanceof Date ? b.getTime() : b
  if (typeof normalizedA === "number" && typeof normalizedB === "number") {
    return normalizedA - normalizedB
  }
  return String(normalizedA).localeCompare(String(normalizedB), "ja", {
    numeric: true,
    sensitivity: "base",
  })
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
      // 横スクロールで列の下に行が潜り込む境界を、ドロップシャドウで明示。
      // 同じ側に複数固定列があっても、外側の列の不透明背景が内側の影を覆うため
      // 実質スクロール領域に面した端の列だけ影が見える。
      side === "left"
        ? "shadow-[8px_0_12px_-3px_rgba(0,0,0,0.3)]"
        : "shadow-[-8px_0_12px_-3px_rgba(0,0,0,0.3)]"
    ),
    style: {
      [side]: offset,
      backgroundColor: bg,
    } as React.CSSProperties,
  }
}

// ─── Inline SVG Icons ───

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") return <ArrowUp2 size={16} className="shrink-0" />
  if (direction === "desc") return <ArrowDown2 size={16} className="shrink-0" />
  return <ArrowSwapVertical size={16} className="shrink-0 opacity-40" />
}

function MoreDotsIcon() {
  return <More size={16} className="shrink-0" />
}

function PlusIcon() {
  return <Add size={16} className="shrink-0" />
}

function ExternalLinkIcon() {
  return <ExportSquare size={14} className="shrink-0" />
}

function DragHandleIcon() {
  return <HamburgerMenu size={16} className="shrink-0" />
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <ArrowRight2
      size={16}
      className={cn("shrink-0 transition-transform duration-200", open && "rotate-90")}
    />
  )
}

// ─── 1. DataTable ───

interface DataTableProps<TRow = unknown> extends React.ComponentProps<"div"> {
  rows?: readonly TRow[]
  columns?: readonly DataTableColumn<TRow>[]
  getRowId?: (row: TRow, index: number) => DataTableRowId
  sort?: DataTableSortState | null
  defaultSort?: DataTableSortState | null
  onSortChange?: (sort: DataTableSortState | null) => void
  selection?: DataTableSelectionState
  emptyMessage?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
  sectionRow?: (row: TRow, index: number) => DataTableSection | null | undefined
  tableClassName?: string
  rowClassName?: string | ((row: TRow, index: number) => string | undefined)
}

function DataTable<TRow = unknown>({
  className,
  children,
  rows,
  columns,
  getRowId,
  sort,
  defaultSort = null,
  onSortChange,
  selection,
  emptyMessage,
  emptyDescription,
  emptyAction,
  sectionRow,
  tableClassName,
  rowClassName,
  ...props
}: DataTableProps<TRow>) {
  const [internalSort, setInternalSort] = React.useState<DataTableSortState | null>(defaultSort)
  const [internalSelectedIds, setInternalSelectedIds] = React.useState<DataTableRowId[]>(
    selection?.defaultSelectedRowIds ?? []
  )
  const isHighLevel = rows != null && columns != null
  const activeSort = sort !== undefined ? sort : internalSort
  const activeRows = (rows ?? EMPTY_ROWS) as readonly TRow[]
  const activeColumns = (columns ?? EMPTY_COLUMNS) as readonly DataTableColumn<TRow>[]
  const selectionMode: DataTableSelectionMode = selection?.mode ?? (selection ? "multi" : "none")
  const selectedRowIds = selection?.selectedRowIds ?? internalSelectedIds
  const selectedRowIdSet = React.useMemo(() => new Set(selectedRowIds), [selectedRowIds])

  const indexedRows = React.useMemo<IndexedRow<TRow>[]>(
    () => activeRows.map((row, index) => ({ row, index })),
    [activeRows]
  )

  const sortedRows = React.useMemo<IndexedRow<TRow>[]>(() => {
    if (!activeSort) return indexedRows
    const column = activeColumns.find((item) => item.key === activeSort.key)
    if (!column || !column.sortable) return indexedRows
    const direction = activeSort.direction === "asc" ? 1 : -1
    return [...indexedRows].sort((a, b) => {
      const aValue = getColumnSortValue(a.row, a.index, column)
      const bValue = getColumnSortValue(b.row, b.index, column)
      return compareDataTableValues(aValue, bValue) * direction
    })
  }, [activeColumns, activeSort, indexedRows])

  const sortedRowIds = React.useMemo(
    () => sortedRows.map(({ row, index }) => resolveRowId(row, index, getRowId)),
    [getRowId, sortedRows]
  )

  const selectedVisibleCount = React.useMemo(
    () => sortedRowIds.filter((id) => selectedRowIdSet.has(id)).length,
    [selectedRowIdSet, sortedRowIds]
  )

  const sectionedRows = React.useMemo<SectionedRow<TRow>[]>(() => {
    const result = sortedRows.reduce<{
      previousSectionKey: string | null
      rows: SectionedRow<TRow>[]
    }>(
      (acc, item) => {
        const section = sectionRow?.(item.row, item.index)
        return {
          previousSectionKey: section?.key ?? acc.previousSectionKey,
          rows: [
            ...acc.rows,
            {
              ...item,
              section,
              renderSection: Boolean(section && section.key !== acc.previousSectionKey),
              sectionOpen: section?.open !== false,
            },
          ],
        }
      },
      { previousSectionKey: null, rows: [] }
    )
    return result.rows
  }, [sectionRow, sortedRows])

  const updateSelectedRowIds = React.useCallback(
    (next: DataTableRowId[]) => {
      if (selection?.selectedRowIds === undefined) setInternalSelectedIds(next)
      selection?.onSelectionChange?.(next)
    },
    [selection]
  )

  const toggleAllRows = React.useCallback(() => {
    if (selectionMode !== "multi") return
    const visibleIdSet = new Set(sortedRowIds)
    const hiddenSelected = selectedRowIds.filter((id) => !visibleIdSet.has(id))
    if (selectedVisibleCount === sortedRowIds.length) {
      updateSelectedRowIds(hiddenSelected)
      return
    }
    updateSelectedRowIds([...hiddenSelected, ...sortedRowIds])
  }, [
    selectedRowIds,
    selectedVisibleCount,
    selectionMode,
    sortedRowIds,
    updateSelectedRowIds,
  ])

  const toggleRow = React.useCallback(
    (id: DataTableRowId) => {
      if (selectionMode === "none") return
      if (selectionMode === "single") {
        updateSelectedRowIds(selectedRowIdSet.has(id) ? [] : [id])
        return
      }
      const next = selectedRowIdSet.has(id)
        ? selectedRowIds.filter((selectedId) => selectedId !== id)
        : [...selectedRowIds, id]
      updateSelectedRowIds(next)
    },
    [selectedRowIdSet, selectedRowIds, selectionMode, updateSelectedRowIds]
  )

  const handleSort = React.useCallback(
    (column: DataTableColumn<TRow>) => {
      if (!column.sortable) return
      const next =
        activeSort?.key !== column.key
          ? { key: column.key, direction: "asc" as const }
          : activeSort.direction === "asc"
            ? { key: column.key, direction: "desc" as const }
            : null
      if (sort === undefined) setInternalSort(next)
      onSortChange?.(next)
    },
    [activeSort, onSortChange, sort]
  )

  const selectionColSpan = selectionMode === "none" ? 0 : 1
  const colSpan = activeColumns.length + selectionColSpan

  if (!isHighLevel) {
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

  return (
    <div
      data-slot="data-table"
      className={cn(
        "overflow-x-auto rounded-lg border border-[var(--Border-Low-Emphasis)]",
        className
      )}
      {...props}
    >
      <DataTableTable className={tableClassName}>
        <DataTableHeader>
          <tr>
            {selectionMode !== "none" && (
              <DataTableHead className="w-[40px]" aria-label="行選択">
                {selectionMode === "multi" && (
                  <Checkbox
                    checked={
                      sortedRowIds.length > 0 && selectedVisibleCount === sortedRowIds.length
                        ? true
                        : selectedVisibleCount > 0
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={toggleAllRows}
                    aria-label="すべて選択"
                  />
                )}
              </DataTableHead>
            )}
            {activeColumns.map((column) => (
              <DataTableHead
                key={column.key}
                sortable={column.sortable}
                sortDirection={activeSort?.key === column.key ? activeSort.direction : null}
                onSort={() => handleSort(column)}
                sticky={column.sticky}
                stickyOffset={column.stickyOffset}
                className={cn(
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.headerClassName
                )}
              >
                {column.header}
              </DataTableHead>
            ))}
          </tr>
        </DataTableHeader>
        <DataTableBody>
          {sortedRows.length === 0 && (
            <DataTableEmptyState
              colSpan={colSpan}
              message={emptyMessage}
              description={emptyDescription}
              action={emptyAction}
            />
          )}
          {sectionedRows.map(({ row, index, section, renderSection, sectionOpen }) => {
            const rowId = resolveRowId(row, index, getRowId)
            const selected = selectedRowIdSet.has(rowId)
            return (
              <React.Fragment key={rowId}>
                {renderSection && section && (
                  <DataTableSectionRow
                    label={section.label}
                    count={section.count}
                    open={section.open}
                    onToggle={section.onToggle}
                    colSpan={colSpan}
                  />
                )}
                {sectionOpen && (
                  <DataTableRow
                    selected={selected}
                    className={
                      typeof rowClassName === "function" ? rowClassName(row, index) : rowClassName
                    }
                  >
                    {selectionMode !== "none" && (
                      <DataTableCheckboxCell
                        checked={selected}
                        onCheckedChange={() => toggleRow(rowId)}
                        aria-label={`${String(rowId)} を選択`}
                      />
                    )}
                    {activeColumns.map((column) => {
                      if (column.editable) {
                        const value =
                          column.editValue?.(row, index) ??
                          String(getColumnSortValue(row, index, column) ?? "")
                        if (column.editOptions) {
                          return (
                            <DataTableSelectCell
                              key={column.key}
                              value={value}
                              options={column.editOptions}
                              onValueChange={(next) => column.onEditChange?.(row, next, index)}
                              className={column.className}
                            />
                          )
                        }
                        return (
                          <DataTableInputCell
                            key={column.key}
                            value={value}
                            onChange={(next) => column.onEditChange?.(row, next, index)}
                            className={column.className}
                          />
                        )
                      }
                      return (
                        <DataTableCell
                          key={column.key}
                          align={column.align}
                          width={column.width}
                          sticky={column.sticky}
                          stickyOffset={column.stickyOffset}
                          className={column.className}
                        >
                          {getColumnValue(row, index, column)}
                        </DataTableCell>
                      )
                    })}
                  </DataTableRow>
                )}
              </React.Fragment>
            )
          })}
        </DataTableBody>
      </DataTableTable>
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
      className={cn("bg-[var(--Surface-Secondary)] [&>tr]:border-b [&>tr]:border-[var(--Border-Low-Emphasis)]", className)}
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
      className={cn("[&>tr:not(:last-child)]:border-b [&>tr:not(:last-child)]:border-b-[var(--Border-Low-Emphasis)]", className)}
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
        "border-l-2 border-l-transparent transition-colors hover:bg-[var(--Surface-Secondary)]/50",
        selected && "bg-[var(--Surface-Accent-Primary-Light)] border-l-[var(--Brand-Primary)]",
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
        "px-3 py-2.5 text-left whitespace-nowrap typo-label-sm text-[var(--Text-Medium-Emphasis)]",
        stickyProps?.className,
        className
      )}
      style={stickyProps ? { ...stickyProps.style, ...style } : style}
      aria-sort={
        sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : undefined
      }
      {...props}
    >
      {sortable ? (
        // ソートはキーボード到達可能な button に。aria-sort は th 側に置く。
        <button
          type="button"
          onClick={onSort}
          className="inline-flex items-center gap-1 cursor-pointer select-none rounded-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 hover:text-[var(--Text-High-Emphasis)] transition-colors"
        >
          {children}
          <SortIcon direction={sortDirection ?? null} />
        </button>
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
  /**
   * 描画する要素。ヘッダー行（`<tr>` in `<thead>`）では `"th"` を指定して
   * `<th>` の中に `<td>` がネストされる HTML 妥当性 / hydration エラーを避ける。
   * @default "td"
   */
  as?: "td" | "th"
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
  as: Element = "td",
  sticky,
  stickyOffset,
  style,
  ...props
}: DataTableCheckboxCellProps) {
  const stickyProps = sticky ? getStickyCellProps(sticky, stickyOffset, Element === "th") : null
  return (
    <Element
      data-slot="data-table-checkbox-cell"
      className={cn("w-[40px] px-3 py-2.5", stickyProps?.className, className)}
      style={stickyProps ? { ...stickyProps.style, ...style } : style}
      {...props}
    >
      <Checkbox
        checked={indeterminate ? "indeterminate" : checked}
        onCheckedChange={(v) => onCheckedChange?.(v === true)}
      />
    </Element>
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
  return (
    <td
      data-slot="data-table-action-cell"
      className={cn("w-[48px] px-3 py-2.5", className)}
      {...props}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full text-[var(--Text-Medium-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors"
            aria-label="行メニュー"
          >
            <MoreDotsIcon />
          </button>
        </DropdownMenuTrigger>
        {/* Radix が body へ Portal するため、テーブルの overflow-x-auto にクリップされない */}
        <DropdownMenuContent align="end" className="min-w-[160px]">
          {items.map((item) => (
            <DropdownMenuItem
              key={item.label}
              variant={item.destructive ? "destructive" : "default"}
              onSelect={() => item.onClick?.()}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
        className="inline-flex items-center gap-1 whitespace-nowrap typo-body-md text-[var(--Text-Accent-Primary)] hover:underline"
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
        "flex flex-wrap items-center gap-3 rounded-lg bg-[var(--Surface-Accent-Primary-Light)] px-4 py-3",
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
      className={cn("bg-[var(--Surface-Tertiary)] border-y border-[var(--Border-Low-Emphasis)]", className)}
      {...props}
    >
      <td colSpan={colSpan} className="px-3 py-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 typo-label-lg text-[var(--Text-High-Emphasis)]"
          onClick={onToggle}
          aria-expanded={open}
        >
          <ChevronIcon open={open} />
          {label}
          {count !== undefined && (
            <span className="typo-body-md text-[var(--Text-Low-Emphasis)]">({count})</span>
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
export type {
  SortDirection,
  DataTableActionMenuItem,
  StickyPosition,
  DataTableRowId,
  DataTableSelectionMode,
  DataTableSortState,
  DataTableColumn,
  DataTableSelectionState,
  DataTableSection,
  DataTableProps,
}
