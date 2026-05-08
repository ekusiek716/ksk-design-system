export interface DropdownFilterOption<K extends string = string> {
    key: K;
    label: string;
}
export interface DropdownFilterProps<K extends string = string> {
    label: string;
    value: K | "all";
    options: DropdownFilterOption<K>[];
    onSelect: (key: K | "all") => void;
    /** "すべて" オプションを非表示にする */
    hideAll?: boolean;
    allLabel?: string;
    className?: string;
}
declare function DropdownFilter<K extends string = string>({ label, value, options, onSelect, hideAll, allLabel, className, }: DropdownFilterProps<K>): import("react/jsx-runtime").JSX.Element;
export { DropdownFilter };
