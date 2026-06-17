export interface ComboboxOption {
    value: string;
    label: string;
}
export interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
}
export declare function Combobox({ options, value, onChange, placeholder, searchPlaceholder, emptyMessage, disabled, }: ComboboxProps): import("react/jsx-runtime").JSX.Element;
