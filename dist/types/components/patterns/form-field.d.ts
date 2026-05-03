import * as React from "react";
interface FormFieldProps extends React.ComponentProps<"div"> {
    label: string;
    htmlFor?: string;
    required?: boolean;
    error?: string;
    description?: string;
}
declare function FormField({ className, label, htmlFor, required, error, description, children, ...props }: FormFieldProps): import("react/jsx-runtime").JSX.Element;
export { FormField };
