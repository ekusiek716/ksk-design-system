import React from "react";
export interface CheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    size?: number;
}
export declare function Checkbox({ checked, onChange, disabled, size }: CheckboxProps): React.JSX.Element;
