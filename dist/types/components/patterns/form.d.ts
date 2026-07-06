import * as React from "react";
interface FormRootProps extends React.ComponentProps<"form"> {
    /** Prevent default form submission */
    preventDefault?: boolean;
}
declare function FormRoot({ className, preventDefault, onSubmit, ...props }: FormRootProps): React.JSX.Element;
interface FormSectionProps extends React.ComponentProps<"fieldset"> {
    title?: string;
    description?: string;
}
declare function FormSection({ className, title, description, children, ...props }: FormSectionProps): React.JSX.Element;
declare function FormActions({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export { FormRoot, FormSection, FormActions };
