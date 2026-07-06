import React from "react";
export interface CheckboxGroupOption {
    value: string;
    label: string;
    description?: string;
}
export interface CheckboxGroupProps {
    options: CheckboxGroupOption[];
    values?: string[];
    onChange?: (values: string[]) => void;
    disabled?: boolean;
}
export declare function CheckboxGroup({ options, values, onChange, disabled }: CheckboxGroupProps): React.JSX.Element;
