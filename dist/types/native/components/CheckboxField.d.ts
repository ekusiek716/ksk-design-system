import React from "react";
export interface CheckboxFieldProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    label: string;
    description?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
}
export declare function CheckboxField({ checked, onChange, disabled, label, description, accessibilityLabel, accessibilityHint, }: CheckboxFieldProps): React.JSX.Element;
