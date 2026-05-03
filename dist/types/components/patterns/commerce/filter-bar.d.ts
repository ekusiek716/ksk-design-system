import * as React from "react";
/** フィルターの選択肢 */
interface FilterOption {
    label: string;
    value: string;
}
/** フィルターチップの定義 */
interface FilterChip {
    /** フィルターのラベル（例: "価格"） */
    label: string;
    /** 選択中の表示値（例: "¥3,000〜¥5,000"）。指定するとアクティブ表示 */
    value?: string;
    /** アクティブ状態 */
    isActive?: boolean;
    /** クリックハンドラ（options 未指定時に使用） */
    onClick?: () => void;
    /** 選択肢リスト（指定するとドロップダウンが開く） */
    options?: FilterOption[];
    /** 選択中の値 */
    selectedValue?: string;
    /** 選択時のコールバック */
    onSelect?: (value: string | null) => void;
}
/** フィルターバーのプロパティ定義 */
interface FilterBarProps extends React.ComponentProps<"nav"> {
    filters: FilterChip[];
    resultCount?: number;
    sortLabel?: string;
    sortOptions?: FilterOption[];
    selectedSort?: string;
    onSortSelect?: (value: string) => void;
    onSortClick?: () => void;
    onMoreFilters?: () => void;
    activeFilterCount?: number;
}
/** 汎用フィルターバーコンポーネント */
declare function FilterBar({ filters, resultCount, sortLabel, sortOptions, selectedSort, onSortSelect, onSortClick, onMoreFilters, activeFilterCount, className, ...props }: FilterBarProps): import("react/jsx-runtime").JSX.Element;
export { FilterBar };
export type { FilterChip, FilterOption, FilterBarProps };
