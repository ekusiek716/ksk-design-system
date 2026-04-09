import * as React from "react"
import { cn } from "@/lib/utils"

interface SearchPanelProps extends React.ComponentProps<"div"> {
  onSearch?: () => void
  onReset?: () => void
  columns?: 2 | 3 | 4
  layout?: "grid" | "flex"
}

const colsClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

function SearchPanel({ children, onSearch, onReset, columns = 4, layout = "grid", className, ...props }: SearchPanelProps) {
  const fieldsClass = layout === "flex"
    ? "flex flex-wrap items-end gap-3 [&>*]:flex [&>*]:flex-col [&>*]:min-w-[140px] [&>*]:flex-1"
    : cn("grid grid-cols-1 gap-3 items-end [&>*]:flex [&>*]:flex-col", colsClass[columns])

  return (
    <div data-slot="search-panel" className={cn("rounded-2xl bg-[var(--Surface-Primary)] border border-[var(--Border-Low-Emphasis)] p-4", className)} {...props}>
      {/* 検索フィールド領域 */}
      <div className={fieldsClass}>{children}</div>
      {/* アクションボタン */}
      <div className="flex items-center justify-end gap-2 mt-3">
        {onReset && (
          <button type="button" data-slot="button" className="inline-flex items-center justify-center h-8 px-3 rounded-full border border-[var(--Border-Medium-Emphasis)] typo-label-sm text-[var(--Text-High-Emphasis)] hover:bg-[var(--Hover-Tertiary-Button)] transition-colors cursor-pointer" onClick={onReset}>
            リセット
          </button>
        )}
        <button type="button" data-slot="button" className="inline-flex items-center justify-center gap-1 h-8 px-3 rounded-full bg-[var(--Brand-Primary)] typo-label-sm text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] transition-colors cursor-pointer" onClick={onSearch}>
          {/* 検索アイコン */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          検索
        </button>
      </div>
    </div>
  )
}

export { SearchPanel }
