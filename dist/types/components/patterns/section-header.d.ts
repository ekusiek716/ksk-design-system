import * as React from "react";
interface SectionHeaderProps extends React.ComponentProps<"div"> {
    title: string;
    description?: string;
    action?: React.ReactNode;
}
declare function SectionHeader({ className, title, description, action, ...props }: SectionHeaderProps): import("react/jsx-runtime").JSX.Element;
export { SectionHeader };
