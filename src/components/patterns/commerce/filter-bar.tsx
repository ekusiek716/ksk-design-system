import * as React from "react"
import { cn } from "@/lib/utils"

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
  const ref = React.useRef<HTMLDivElement>(null)
  const hasOptions = filter.options && filter.options.length > 0
  const isActive = filter.isActive || !!filter.selectedValue

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const displayLabel = isActive && filter.value
    ? filter.value
    : isActive && filter.selectedValue
      ? filter.options?.find(o => o.value === filter.selectedValue)?.label ?? filter.label
      : filter.label

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          if (hasOptions) setOpen(!open)
          else filter.onClick?.()
        }}
        className={cn(
          "flex h-9 items-center gap-0.5 rounded-full px-2.5 typo-body-md transition-colors max-w-[200px]",
          isActive
            ? "bg-[var(--Surface-Accent-Primary-Light)] typo-label-md text-[var(--Text-Accent-Primary)]"
            : "bg-[var(--Surface-Tertiary)] text-[var(--Text-High-Emphasis)] hover:opacity-80"
        )}
        aria-expanded={hasOptions ? open : undefined}
      >
        <span className="truncate">{displayLabel}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={cn("shrink-0 transition-transform", open && "rotate-180")}>
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ドロップダウン */}
      {hasOptions && open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in">
          {/* リセット */}
          {filter.selectedValue && (
            <button
              type="button"
              className="flex w-full items-center px-3 py-2 typo-body-sm text-[var(--Text-Low-Emphasis)] hover:bg-[var(--Surface-Secondary)] transition-colors text-left"
              onClick={() => { filter.onSelect?.(null); setOpen(false) }}
            >
              選択を解除
            </button>
          )}
          {filter.options!.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 typo-body-md text-left transition-colors hover:bg-[var(--Surface-Secondary)]",
                filter.selectedValue === opt.value
                  ? "text-[var(--Text-Accent-Primary)] bg-[var(--Surface-Accent-Primary-Light)]"
                  : "text-[var(--Text-High-Emphasis)]"
              )}
              onClick={() => { filter.onSelect?.(opt.value); setOpen(false) }}
            >
              {filter.selectedValue === opt.value && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <path d="M11 4L5.5 9.5L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
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
  const [sortOpen, setSortOpen] = React.useState(false)
  const sortRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!sortOpen) return
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [sortOpen])

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
            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="flex h-9 shrink-0 items-center gap-0.5 rounded-full bg-[var(--Surface-Tertiary)] px-3 typo-body-md text-[var(--Text-High-Emphasis)] hover:opacity-80"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 4h7M3 8h5M3 12h3M13 5v8M11 11l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {sortOptions.find(o => o.value === selectedSort)?.label ?? sortLabel ?? "並べ替え"}
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] py-1 shadow-[var(--shadow-lg)] animate-fade-in">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 typo-body-md text-left transition-colors hover:bg-[var(--Surface-Secondary)]",
                        selectedSort === opt.value ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)]"
                      )}
                      onClick={() => { onSortSelect?.(opt.value); setSortOpen(false) }}
                    >
                      {selectedSort === opt.value && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                          <path d="M11 4L5.5 9.5L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
