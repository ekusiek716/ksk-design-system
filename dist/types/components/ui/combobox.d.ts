import * as React from "react";
export interface ComboboxOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyLabel?: string;
    disabled?: boolean;
    className?: string;
    /** トリガーボタンの aria-label */
    triggerLabel?: string;
}
declare function Combobox({ options, value, onChange, placeholder, searchPlaceholder, emptyLabel, disabled, className, triggerLabel, }: ComboboxProps): React.JSX.Element;
export { Combobox };
