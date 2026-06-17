export interface SimplePaginationProps {
    page: number;
    total: number;
    onChange?: (page: number) => void;
}
/** モバイル向けの「‹ 3/10 ›」型ページャ。 */
export declare function SimplePagination({ page, total, onChange }: SimplePaginationProps): import("react/jsx-runtime").JSX.Element;
