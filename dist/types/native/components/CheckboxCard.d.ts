import React from "react";
export interface CheckboxCardProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    title: string;
    description?: string;
}
export declare function CheckboxCard({ checked, onChange, disabled, title, description, }: CheckboxCardProps): React.JSX.Element;
