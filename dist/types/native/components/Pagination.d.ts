export interface PaginationProps {
    page: number;
    total: number;
    onChange?: (page: number) => void;
    windowSize?: number;
}
export declare function Pagination({ page, total, onChange, windowSize }: PaginationProps): import("react/jsx-runtime").JSX.Element;
