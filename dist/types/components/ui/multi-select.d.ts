export interface MultiSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface MultiSelectProps {
    options: MultiSelectOption[];
    value?: string[];
    onChange?: (values: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyLabel?: string;
    disabled?: boolean;
    className?: string;
    /** 選択済みチップの最大表示数（超えると "+N" で省略） @default 3 */
    maxDisplay?: number;
    /** 選択済みをクリアするボタンを表示 @default true */
    clearable?: boolean;
}
declare function MultiSelect({ options, value, onChange, placeholder, searchPlaceholder, emptyLabel, disabled, className, maxDisplay, clearable, }: MultiSelectProps): import("react/jsx-runtime").JSX.Element;
export { MultiSelect };
