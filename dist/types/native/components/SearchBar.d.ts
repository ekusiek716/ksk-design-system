import React from "react";
export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onSubmit?: () => void;
    onClear?: () => void;
    autoFocus?: boolean;
}
export declare function SearchBar({ value, onChange, placeholder, onSubmit, onClear, autoFocus, }: SearchBarProps): React.JSX.Element;
