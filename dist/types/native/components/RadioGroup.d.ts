import React from "react";
export interface RadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}
export interface RadioGroupProps {
    options: RadioOption[];
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}
export declare function RadioGroup({ options, value, onChange, disabled }: RadioGroupProps): React.JSX.Element;
