import React from "react";
export interface FormFieldProps {
    label?: string;
    required?: boolean;
    description?: string;
    error?: string;
    children: React.ReactNode;
}
export declare function FormField({ label, required, description, error, children }: FormFieldProps): React.JSX.Element;
