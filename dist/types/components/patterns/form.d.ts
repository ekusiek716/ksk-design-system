import * as React from "react";
interface FormRootProps extends React.ComponentProps<"form"> {
    /** Prevent default form submission */
    preventDefault?: boolean;
}
declare function FormRoot({ className, preventDefault, onSubmit, ...props }: FormRootProps): import("react/jsx-runtime").JSX.Element;
interface FormSectionProps extends React.ComponentProps<"fieldset"> {
    title?: string;
    description?: string;
}
declare function FormSection({ className, title, description, children, ...props }: FormSectionProps): import("react/jsx-runtime").JSX.Element;
declare function FormActions({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { FormRoot, FormSection, FormActions };
