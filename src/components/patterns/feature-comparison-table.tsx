import * as React from "react"
import { TickCircle } from "iconsax-reactjs"
import { cn } from "@/lib/utils"

interface FeatureComparisonColumn {
  /** rows[].values のキー */
  key: string
  /** 列見出し（「Free」「Plus」等） */
  label: React.ReactNode
  /** 推したい列（有料プラン等）を淡いアクセント面で強調する */
  highlight?: boolean
}

/** セルの値。true = 使える（✓）/ false・未指定・空文字 = 使えない（—）/ 文字列・ReactNode = その値（「月 3 件」等） */
type FeatureComparisonValue = boolean | React.ReactNode

interface FeatureComparisonRow {
  /** 機能名（行見出し） */
  label: React.ReactNode
  values: Record<string, FeatureComparisonValue>
}

interface FeatureComparisonTableProps extends Omit<React.ComponentProps<"table">, "children"> {
  columns: FeatureComparisonColumn[]
  rows: FeatureComparisonRow[]
  /** 表の名前（読み上げ用・画面には出さない）。例: "Free と Plus の機能比較" */
  caption?: string
  /** 左上の見出しセル（機能名の列）の文言。@default "機能" */
  featureLabel?: string
  /** true のセルの読み上げ文言。@default "利用できる" */
  availableLabel?: string
  /** false のセルの読み上げ文言。@default "利用できない" */
  unavailableLabel?: string
}

/**
 * FeatureComparisonTable — プランの機能比較表（issue #687）
 *
 * Free / Plus のような列ごとの可否（✓ / —）や値（「月 3 件」）を、`<table>` と `th scope` で
 * 意味付きで出す。✓ / — は装飾で、読み上げには availableLabel / unavailableLabel が使われるので
 * 「機能名・プラン名・可否」がセルごとに読める。div grid + アイコンだけで自作しない。
 *
 * - 列数は 2〜3 を想定（スマホ幅で 1 行に収まる数）。それ以上は横スクロールの親で包む
 * - highlight 列（推奨プラン）は Surface-Accent-Primary-Light の面と Text-Accent-Primary の見出し
 */
/** 「利用できない」扱いの値（false・未指定・null・空文字）。空セルにしない */
function isUnavailable(value: FeatureComparisonValue | undefined) {
  return value === false || value == null || value === ""
}

function FeatureComparisonTable({
  columns,
  rows,
  caption,
  featureLabel = "機能",
  availableLabel = "利用できる",
  unavailableLabel = "利用できない",
  className,
  ...props
}: FeatureComparisonTableProps) {
  const cellBg = (column: FeatureComparisonColumn) =>
    column.highlight ? "bg-[var(--Surface-Accent-Primary-Light)]" : undefined

  return (
    <table
      data-slot="feature-comparison-table"
      className={cn("w-full border-collapse text-left", className)}
      {...props}
    >
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr className="border-b border-[var(--Border-Low-Emphasis)]">
          <th scope="col" className="py-2 pr-2 typo-label-sm text-[var(--Text-Medium-Emphasis)]">
            {featureLabel}
          </th>
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              data-highlight={column.highlight || undefined}
              className={cn(
                "w-20 rounded-t-lg px-2 py-2 text-center typo-label-md",
                column.highlight ? "text-[var(--Text-Accent-Primary)]" : "text-[var(--Text-High-Emphasis)]",
                cellBg(column)
              )}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b border-[var(--Border-Low-Emphasis)] last:border-b-0">
            <th scope="row" className="py-3 pr-2 typo-body-sm text-[var(--Text-High-Emphasis)]">
              {row.label}
            </th>
            {columns.map((column) => {
              const value = row.values[column.key]
              return (
                <td
                  key={column.key}
                  data-value={value === true ? "available" : isUnavailable(value) ? "unavailable" : "text"}
                  className={cn("px-2 py-3 text-center typo-body-sm text-[var(--Text-High-Emphasis)]", cellBg(column))}
                >
                  {value === true ? (
                    <>
                      <TickCircle size={20} variant="Bold" aria-hidden="true" className="mx-auto text-[var(--Object-Success)]" />
                      <span className="sr-only">{availableLabel}</span>
                    </>
                  ) : isUnavailable(value) ? (
                    <>
                      <span aria-hidden="true" className="text-[var(--Text-Medium-Emphasis)]">—</span>
                      <span className="sr-only">{unavailableLabel}</span>
                    </>
                  ) : (
                    value
                  )}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export { FeatureComparisonTable }
export type {
  FeatureComparisonColumn,
  FeatureComparisonRow,
  FeatureComparisonTableProps,
  FeatureComparisonValue,
}
