import * as React from "react";
/**
 * SimplePagination のラベル形式。
 * - `items`: 「N - M / 全 T 件」(アイテム数ベース)
 * - `pages`: 「N / M ページ」(ページ数ベース)
 */
type SimplePaginationFormat = "items" | "pages";
interface SimplePaginationBaseProps extends Omit<React.ComponentProps<"nav">, "onChange"> {
    /** 現在のページ (1-indexed) */
    page: number;
    /** ページ変更時のコールバック (1-indexed) */
    onPageChange?: (page: number) => void;
    /**
     * 表示形式の指定。明示しない場合は props から推測:
     * - `total` + `pageSize` あり → "items"
     * - `totalPages` あり → "pages"
     */
    format?: SimplePaginationFormat;
    /** モバイル時にラベルを省略表示（"3 / 10" のような簡略表示） */
    compact?: boolean;
    /** 「前へ」ボタンのラベル / aria-label */
    previousLabel?: string;
    /** 「次へ」ボタンのラベル / aria-label */
    nextLabel?: string;
    /**
     * 中央ラベルのカスタムレンダラ。
     * 指定された場合、format によらず常にこの関数の結果が表示される。
     */
    renderLabel?: (info: {
        page: number;
        totalPages: number;
        pageSize?: number;
        total?: number;
        from?: number;
        to?: number;
    }) => React.ReactNode;
}
type SimplePaginationItemsProps = SimplePaginationBaseProps & {
    /** 全アイテム数 */
    total: number;
    /** 1ページあたりのアイテム数 */
    pageSize: number;
    totalPages?: never;
};
type SimplePaginationPagesProps = SimplePaginationBaseProps & {
    /** 全ページ数 */
    totalPages: number;
    total?: never;
    pageSize?: never;
};
type SimplePaginationProps = SimplePaginationItemsProps | SimplePaginationPagesProps;
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
declare function SimplePagination({ page, onPageChange, format, compact, previousLabel, nextLabel, renderLabel, className, total, pageSize, totalPages, ...props }: SimplePaginationProps): React.JSX.Element;
export { SimplePagination };
export type { SimplePaginationProps, SimplePaginationFormat };
