import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../ui/dropdown-menu"

/** フィルターの選択肢 */
interface FilterOption {
  label: string
  value: string
}

/** フィルターチップの定義 */
interface FilterChip {
  /** フィルターのラベル（例: "価格"） */
  label: string
  /** 選択中の表示値（例: "¥3,000〜¥5,000"）。指定するとアクティブ表示 */
  value?: string
  /** アクティブ状態 */
  isActive?: boolean
  /** クリックハンドラ（options 未指定時に使用） */
  onClick?: () => void
  /** 選択肢リスト（指定するとドロップダウンが開く） */
  options?: FilterOption[]
  /** 選択中の値 */
  selectedValue?: string
  /** 選択時のコールバック */
  onSelect?: (value: string | null) => void
}

/** フィルターバーのプロパティ定義 */
interface FilterBarProps extends React.ComponentProps<"nav"> {
  filters: FilterChip[]
  resultCount?: number
  sortLabel?: string
  sortOptions?: FilterOption[]
  selectedSort?: string
  onSortSelect?: (value: string) => void
  onSortClick?: () => void
  onMoreFilters?: () => void
  activeFilterCount?: number
}

/** フィルターチップ + ドロップダウン */
function FilterChipButton({ filter }: { filter: FilterChip }) {
  const [open, setOpen] = React.useState(false)
  const hasOptions = filter.options && filter.options.length > 0
  const isActive = filter.isActive || !!filter.selectedValue

  const displayLabel = isActive && filter.value
    ? filter.value
    : isActive && filter.selectedValue
      ? filter.options?.find(o => o.value === filter.selectedValue)?.label ?? filter.label
      : filter.label

  const triggerClassName = cn(
    "flex h-9 shrink-0 items-center gap-0.5 rounded-full px-2.5 typo-body-md transition-colors max-w-[200px]",
    isActive
      ? "bg-[var(--Surface-Accent-Primary-Light)] typo-label-md text-[var(--Text-Accent-Primary)]"
      : "bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] hover:opacity-80"
  )

  const chevron = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={cn("shrink-0 transition-transform", open && "rotate-180")}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  // options 未指定なら単純ボタン
  if (!hasOptions) {
    return (
      <button type="button" onClick={() => filter.onClick?.()} className={triggerClassName}>
        <span className="truncate">{displayLabel}</span>
        {chevron}
      </button>
    )
  }

  // options 指定時は Radix DropdownMenu。body へ portal されるため、
  // フィルターバーの overflow-x-auto に縦方向をクリップされない。
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button type="button" className={triggerClassName}>
          <span className="truncate">{displayLabel}</span>
          {chevron}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        {filter.selectedValue && (
          <>
            <DropdownMenuItem
              className="text-[var(--Text-Low-Emphasis)]"
              onSelect={() => filter.onSelect?.(null)}
            >
              選択を解除
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuRadioGroup
          value={filter.selectedValue ?? ""}
          onValueChange={(v) => filter.onSelect?.(v)}
        >
          {filter.options!.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** 汎用フィルターバーコンポーネント */
function FilterBar({
  filters,
  resultCount,
  sortLabel,
  sortOptions,
  selectedSort,
  onSortSelect,
  onSortClick,
  onMoreFilters,
  activeFilterCount,
  className,
  ...props
}: FilterBarProps) {

  return (
    <nav
      aria-label="フィルター"
      data-slot="filter-bar"
      className={cn("space-y-2", className)}
      {...props}
    >
      {/* フィルターチップの横スクロールエリア */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {/* 絞り込みボタン */}
        <button
          type="button"
          className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] transition-colors hover:opacity-80"
          onClick={onMoreFilters}
          aria-label="絞り込み"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M5 10h10M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {activeFilterCount != null && activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[var(--Brand-Primary)] typo-label-xs text-[var(--Text-on-Inverse)]">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* 各フィルターチップ */}
        {filters.map((f) => (
          <FilterChipButton key={f.label} filter={f} />
        ))}
      </div>

      {/* 検索結果件数と並べ替え */}
      {(resultCount !== undefined || sortLabel || sortOptions) && (
        <div className="flex items-center justify-between">
          {resultCount !== undefined && (
            <span className="typo-body-md text-[var(--Text-High-Emphasis)]">
              対象商品: <strong className="typo-heading-md">{resultCount.toLocaleString()}</strong> 件
            </span>
          )}

          {/* 並べ替え（ドロップダウン or ボタン） */}
          {sortOptions ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 shrink-0 items-center gap-0.5 rounded-full bg-[var(--Surface-Tertiary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] hover:opacity-80"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 4h7M3 8h5M3 12h3M13 5v8M11 11l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {sortOptions.find(o => o.value === selectedSort)?.label ?? sortLabel ?? "並べ替え"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuRadioGroup
                  value={selectedSort}
                  onValueChange={(v) => onSortSelect?.(v)}
                >
                  {sortOptions.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : onSortClick && (
            <button
              type="button"
              onClick={onSortClick}
              className="flex h-9 shrink-0 items-center gap-0.5 rounded-full bg-[var(--Surface-Tertiary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] hover:opacity-80"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h7M3 8h5M3 12h3M13 5v8M11 11l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {sortLabel ?? "並べ替え"}
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export { FilterBar }
export type { FilterChip, FilterOption, FilterBarProps }
