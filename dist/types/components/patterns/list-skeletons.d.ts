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
    rows?: number;
    /** 上部のフィルタチップ列を出すか。既定 true */
    hasFilter?: boolean;
    /** aria-label 用テキスト。既定 "Loading..." */
    loadingLabel?: string;
    /** 外枠の追加 className（既定 `px-4 pt-3`） */
    className?: string;
    /** リスト行の高さ (px、既定 56) */
    rowHeight?: number;
}
export declare function ListSkeleton({ rows, hasFilter, loadingLabel, className, rowHeight, }: ListSkeletonProps): import("react").JSX.Element;
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
    rows?: number;
    /** グリッドの列数。既定 2 */
    columns?: number;
    /** カード 1 枚の高さ (px、既定 140) */
    cardHeight?: number;
    /** aria-label 用テキスト */
    loadingLabel?: string;
    /** 外枠の追加 className */
    className?: string;
}
export declare function GridSkeleton({ rows, columns, cardHeight, loadingLabel, className, }: GridSkeletonProps): import("react").JSX.Element;
