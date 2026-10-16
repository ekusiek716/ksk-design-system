import * as React from "react"
import { cn } from "@/lib/utils"

interface ChipFilterBarProps {
  children: React.ReactNode
  /** 検索結果件数。指定すると children の下に件数テキストを表示する */
  resultCount?: number
  /**
   * 件数テキストのフォーマッタ。未指定時は `"{n}件"` を表示する。
   * i18n が必要な消費側はここに関数を渡して差し替える。
   */
  resultCountLabel?: (n: number) => string
  /**
   * true でチップ行をスクロール時に上部固定する。背景を敷いて下のリストの
   * 透けを防ぐ。固定位置は `stickyOffset` で調整する。
   */
  sticky?: boolean
  /**
   * sticky 時の `top` オフセット（px）。固定ヘッダー等の高さ分だけ相殺したい場合に指定する。
   * @default 0
   */
  stickyOffset?: number
  /**
   * true で自前の overflow/padding ラッパーを付けず children のみ返す。
   * 外側の 1 つのスクロール行に他の要素（view セレクタ等）と並べて横スクロールを
   * 共有させたい場合に使う（二重スクロールコンテナの回避）。
   */
  bare?: boolean
  /**
   * 内側（チップ列と件数テキスト）の左右余白（issue #667）。`Container` の gutter と同じ語彙
   * （`tight` = 16px / `default` = 24px）。外側（sticky の背景）は全幅のまま、チップと件数だけが
   * 余白の内側に収まる。横スクロールの始点・終点も余白ぶん内側になる。
   * @default "none"
   */
  gutter?: "none" | "tight" | "default"
  /**
   * 内側（チップ列 div と件数 p の両方）に付ける className（issue #667）。`gutter` の語彙に無い
   * 余白（consumer 独自のページ余白変数 `px-[var(--page-px)]` 等）を渡すときに使う。
   * 外側の `className` と違い、sticky の背景を狭めない。`bare` のときは無視される。
   */
  contentClassName?: string
  className?: string
}

const GUTTER_CLASS = {
  none: "",
  tight: "px-4",
  default: "px-6",
} as const

// ロケールを明示する（SSR 環境とブラウザでロケールが異なると hydration mismatch になるため）
const defaultResultCountLabel = (n: number) => `${n.toLocaleString("ja-JP")}件`

/**
 * ChipFilterBar — Chip を横スクロール表示するフィルターバーパターン。
 * belle-todo の FilterBar（Chips.tsx 107-134行）を移植。
 *
 * DS 既存の `commerce/FilterBar`（filters/sortOptions 統合型）とは別 API・別用途。
 * 本コンポーネントは children に任意の Chip 群を渡すシンプルな横スクロールラッパー。
 */
function ChipFilterBar({
  children,
  resultCount,
  resultCountLabel = defaultResultCountLabel,
  sticky = false,
  stickyOffset = 0,
  bare = false,
  gutter = "none",
  contentClassName,
  className,
}: ChipFilterBarProps) {
  if (bare) return <>{children}</>
  const innerClassName = cn(GUTTER_CLASS[gutter], contentClassName)

  return (
    <div data-slot="chip-filter-bar" className={className}>
      <div
        className={cn(
          // min-h-11 + items-center は Chip の 44px 当たり判定を守るために必須。
          // Chip は見た目の高さ(28/32/36px)を保ったまま透明な before 擬似要素で
          // タップ領域を 44px に広げているが、overflow-x-auto は仕様上
          // overflow-y も auto に落ちる（visible にはできない）ため、行の高さが
          // チップの実高のままだと擬似要素の上下がクリップされて当たり判定が戻ってしまう。
          // 行自体を 44px 確保し、チップは中央寄せにして見た目を変えずに収める。
          // items-center を外すと flex の stretch でチップ自体が 44px に伸びるので注意。
          "flex min-h-11 items-center gap-2 overflow-x-auto scrollbar-hide",
          sticky && "sticky z-[var(--Z-Sticky)] bg-[var(--Surface-Primary)] py-2"
        )}
        style={sticky ? { top: stickyOffset } : undefined}
      >
        {innerClassName ? (
          // 余白は背景を持つ行（スクロールコンテナ）ではなく、その内側のラッパーに付ける（issue #667）。
          // スクロールコンテナ自身の右 padding はスクロール末尾で効かないブラウザがあるため、
          // 中身ぶんの幅（w-max）を持つラッパーの padding にする。min-w-full で短いときも左余白を保つ。
          // 余白を指定しないときはラッパーを足さない（従来と同じ DOM）。
          <div
            data-slot="chip-filter-bar-content"
            className={cn("flex w-max min-w-full shrink-0 items-center gap-2", innerClassName)}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </div>
      {resultCount !== undefined && (
        <p className={cn("mt-2 typo-label-xs text-[var(--Text-Low-Emphasis)]", innerClassName)}>
          {resultCountLabel(resultCount)}
        </p>
      )}
    </div>
  )
}

export { ChipFilterBar }
export type { ChipFilterBarProps }
