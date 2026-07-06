import React from "react";
export interface CheckboxFieldProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    label: string;
    description?: string;
}
export declare function CheckboxField({ checked, onChange, disabled, label, description, }: CheckboxFieldProps): React.JSX.Element;
