import * as React from "react";
interface SectionHeaderProps extends React.ComponentProps<"div"> {
    title: string;
    description?: string;
    action?: React.ReactNode;
}
declare function SectionHeader({ className, title, description, action, ...props }: SectionHeaderProps): React.JSX.Element;
export { SectionHeader };
