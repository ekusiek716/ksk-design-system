import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * ListSkeleton — リスト型サブタブ用の汎用 Skeleton。
 *
 * 上部にフィルタチップ風プレースホルダ 3 枚、その下にカード行 N 枚を並べる。
 * 「データ取得中だが画面構造は読める」状態を返したいときに使う。
 *
 * @example
 * <ListSkeleton rows={5} hasFilter loadingLabel="読み込み中..." />
 */
export interface ListSkeletonProps {
  /** 並べるリスト行数。既定 5 */
  rows?: number
  /** 上部のフィルタチップ列を出すか。既定 true */
  hasFilter?: boolean
  /** aria-label 用テキスト。既定 "Loading..." */
  loadingLabel?: string
  /** 外枠の追加 className（既定 `px-4 pt-3`） */
  className?: string
  /** リスト行の高さ (px、既定 56) */
  rowHeight?: number
}

export function ListSkeleton({
  rows = 5,
  hasFilter = true,
  loadingLabel = "Loading...",
  className,
  rowHeight = 56,
}: ListSkeletonProps) {
  return (
    <div
      data-slot="list-skeleton"
      className={cn("animate-fade-in px-4 pt-3", className)}
      aria-busy="true"
      aria-label={loadingLabel}
    >
      {hasFilter && (
        <div className="flex gap-2 mb-3">
          <Skeleton width={80} height={36} rounded="full" />
          <Skeleton width={80} height={36} rounded="full" />
          <Skeleton width={80} height={36} rounded="full" />
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} width="100%" height={rowHeight} rounded="2xl" />
        ))}
      </div>
    </div>
  )
}

/**
 * GridSkeleton — グリッド型サブタブ用の汎用 Skeleton。
 *
 * デフォルトは 2 カラム × N 行。サムネカード並びに使用。
 *
 * @example
 * <GridSkeleton rows={3} columns={2} loadingLabel="読み込み中..." />
 */
export interface GridSkeletonProps {
  /** グリッドの行数。既定 3 */
  rows?: number
  /** グリッドの列数。既定 2 */
  columns?: number
  /** カード 1 枚の高さ (px、既定 140) */
  cardHeight?: number
  /** aria-label 用テキスト */
  loadingLabel?: string
  /** 外枠の追加 className */
  className?: string
}

export function GridSkeleton({
  rows = 3,
  columns = 2,
  cardHeight = 140,
  loadingLabel = "Loading...",
  className,
}: GridSkeletonProps) {
  const gridColsClass = columns === 1
    ? "grid-cols-1"
    : columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-3"
        : columns === 4
          ? "grid-cols-4"
          : "grid-cols-2"
  return (
    <div
      data-slot="grid-skeleton"
      className={cn("animate-fade-in px-4 pt-3", className)}
      aria-busy="true"
      aria-label={loadingLabel}
    >
      <div className={cn("grid gap-3", gridColsClass)}>
        {Array.from({ length: rows * columns }).map((_, i) => (
          <Skeleton key={i} width="100%" height={cardHeight} rounded="2xl" />
        ))}
      </div>
    </div>
  )
}
