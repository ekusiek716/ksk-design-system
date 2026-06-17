export interface FilterBarFilter {
    key: string;
    label: string;
    value?: string;
    active?: boolean;
    onPress?: () => void;
}
export interface FilterBarProps {
    filters: FilterBarFilter[];
    sortLabel?: string;
    onPressSort?: () => void;
}
export declare function FilterBar({ filters, sortLabel, onPressSort }: FilterBarProps): import("react/jsx-runtime").JSX.Element;
