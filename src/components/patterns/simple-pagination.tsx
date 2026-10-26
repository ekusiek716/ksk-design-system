import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useKskLabels } from "../ui/ksk-labels"

/**
 * SimplePagination のラベル形式。
 * - `items`: 「N - M / 全 T 件」(アイテム数ベース)
 * - `pages`: 「N / M ページ」(ページ数ベース)
 */
type SimplePaginationFormat = "items" | "pages"

interface SimplePaginationBaseProps
  extends Omit<React.ComponentProps<"nav">, "onChange"> {
  /** 現在のページ (1-indexed) */
  page: number
  /** ページ変更時のコールバック (1-indexed) */
  onPageChange?: (page: number) => void
  /**
   * 表示形式の指定。明示しない場合は props から推測:
   * - `total` + `pageSize` あり → "items"
   * - `totalPages` あり → "pages"
   */
  format?: SimplePaginationFormat
  /** モバイル時にラベルを省略表示（"3 / 10" のような簡略表示） */
  compact?: boolean
  /** 「前へ」ボタンのラベル / aria-label。省略時は KskLabelsProvider の `simplePaginationPrevious`（Provider 無しは "前へ"。locale="en" で "Previous"） */
  previousLabel?: string
  /** 「次へ」ボタンのラベル / aria-label。省略時は KskLabelsProvider の `simplePaginationNext`（Provider 無しは "次へ"。locale="en" で "Next"） */
  nextLabel?: string
  /** nav 要素の aria-label。省略時は KskLabelsProvider の `simplePaginationNav`（Provider 無しは "ページネーション"。locale="en" で "Pagination"） */
  navLabel?: string
  /**
   * 中央ラベルのカスタムレンダラ。
   * 指定された場合、format によらず常にこの関数の結果が表示される。
   */
  renderLabel?: (info: {
    page: number
    totalPages: number
    pageSize?: number
    total?: number
    from?: number
    to?: number
  }) => React.ReactNode
}

type SimplePaginationItemsProps = SimplePaginationBaseProps & {
  /** 全アイテム数 */
  total: number
  /** 1ページあたりのアイテム数 */
  pageSize: number
  totalPages?: never
}

type SimplePaginationPagesProps = SimplePaginationBaseProps & {
  /** 全ページ数 */
  totalPages: number
  total?: never
  pageSize?: never
}

type SimplePaginationProps =
  | SimplePaginationItemsProps
  | SimplePaginationPagesProps

function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 12L6 8L10 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * 件数・ページ数の文言テンプレートを描画する。`{range}` のような差し込み口は数字（tabular-nums）、
 * それ以外の文字は弱いトーンで出す（`1 - 10 / 全 100 件` の「/ 全」「件」を弱くする既存の見た目）。
 */
function renderCountTemplate(template: string, values: Record<string, React.ReactNode>) {
  return template
    .split(/(\{\w+\})/)
    .filter(Boolean)
    .map((part, i) => {
      const token = /^\{(\w+)\}$/.exec(part)
      if (token && token[1] in values) {
        return (
          <span key={i} className="tabular-nums">
            {values[token[1]]}
          </span>
        )
      }
      return (
        <span key={i} className="text-[var(--Text-Low-Emphasis)]">
          {part}
        </span>
      )
    })
}

/**
 * 最小ページネーション。「前へ / N - M / 全 T 件 / 次へ」または
 * 「前へ / N / M ページ / 次へ」の最小限の構成。
 *
 * 大量のページ番号を一覧表示する `Pagination` とは別物で、
 * モバイル / リスト下部 / 軽量な管理画面向けの簡素な UI。
 *
 * @example
 * // アイテム数指定
 * <SimplePagination page={1} pageSize={20} total={items.length} onPageChange={setPage} />
 *
 * @example
 * // ページ数指定
 * <SimplePagination page={1} totalPages={10} onPageChange={setPage} />
 */
function SimplePagination({
  page,
  onPageChange,
  format,
  compact = false,
  previousLabel: previousLabelProp,
  nextLabel: nextLabelProp,
  navLabel: navLabelProp,
  renderLabel,
  className,
  total,
  pageSize,
  totalPages,
  ...props
}: SimplePaginationProps) {
  const defaultLabels = useKskLabels()
  const previousLabel = previousLabelProp ?? defaultLabels.simplePaginationPrevious
  const nextLabel = nextLabelProp ?? defaultLabels.simplePaginationNext
  const navLabel = navLabelProp ?? defaultLabels.simplePaginationNav
  // 形式の推定
  const resolvedFormat: SimplePaginationFormat =
    format ?? (totalPages !== undefined ? "pages" : "items")

  // ページ数の計算
  const resolvedTotalPages =
    totalPages !== undefined
      ? totalPages
      : pageSize && pageSize > 0
        ? Math.max(1, Math.ceil((total ?? 0) / pageSize))
        : 1

  const safePage = Math.min(Math.max(1, page), Math.max(1, resolvedTotalPages))

  const canGoPrev = safePage > 1
  const canGoNext = safePage < resolvedTotalPages

  const from =
    pageSize && total !== undefined && total > 0
      ? (safePage - 1) * pageSize + 1
      : undefined
  const to =
    pageSize && total !== undefined
      ? Math.min(safePage * pageSize, total)
      : undefined

  const handlePrev = () => {
    if (canGoPrev) onPageChange?.(safePage - 1)
  }
  const handleNext = () => {
    if (canGoNext) onPageChange?.(safePage + 1)
  }

  const labelNode = React.useMemo(() => {
    if (renderLabel) {
      return renderLabel({
        page: safePage,
        totalPages: resolvedTotalPages,
        pageSize,
        total,
        from,
        to,
      })
    }

    if (compact) {
      // モバイル / 省略表示: 「3 / 10」のみ
      return (
        <span className="tabular-nums">
          {safePage} / {resolvedTotalPages}
        </span>
      )
    }

    if (resolvedFormat === "items" && total !== undefined && pageSize) {
      if (total === 0) {
        return <span className="tabular-nums">{defaultLabels.simplePaginationEmpty}</span>
      }
      return renderCountTemplate(defaultLabels.simplePaginationItems, {
        range: `${from?.toLocaleString()} - ${to?.toLocaleString()}`,
        total: total.toLocaleString(),
      })
    }

    return renderCountTemplate(defaultLabels.simplePaginationPages, {
      page: safePage,
      pages: resolvedTotalPages,
    })
  }, [
    defaultLabels.simplePaginationEmpty,
    defaultLabels.simplePaginationItems,
    defaultLabels.simplePaginationPages,
    renderLabel,
    compact,
    resolvedFormat,
    safePage,
    resolvedTotalPages,
    total,
    pageSize,
    from,
    to,
  ])

  return (
    <nav
      role="navigation"
      aria-label={navLabel}
      data-slot="simple-pagination"
      className={cn(
        "flex items-center justify-between gap-2 sm:justify-center sm:gap-4",
        className
      )}
      {...props}
    >
      <Button
        type="button"
        variant="tertiary"
        size="sm"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label={previousLabel}
      >
        <ChevronLeftIcon />
        <span className={compact ? "sr-only sm:not-sr-only" : undefined}>
          {previousLabel}
        </span>
      </Button>

      <div
        className="typo-body-sm text-[var(--Text-High-Emphasis)] text-center"
        aria-live="polite"
      >
        {labelNode}
      </div>

      <Button
        type="button"
        variant="tertiary"
        size="sm"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label={nextLabel}
      >
        <span className={compact ? "sr-only sm:not-sr-only" : undefined}>
          {nextLabel}
        </span>
        <ChevronRightIcon />
      </Button>
    </nav>
  )
}

export { SimplePagination }
export type { SimplePaginationProps, SimplePaginationFormat }
