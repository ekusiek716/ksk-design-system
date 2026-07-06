import React from "react";
export interface MultiSelectOption {
    value: string;
    label: string;
}
export interface MultiSelectProps {
    options: MultiSelectOption[];
    values?: string[];
    onChange?: (values: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
}
export declare function MultiSelect({ options, values, onChange, placeholder, searchPlaceholder, disabled, }: MultiSelectProps): React.JSX.Element;
