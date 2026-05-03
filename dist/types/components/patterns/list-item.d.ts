import * as React from "react";
interface ListItemProps extends React.ComponentProps<"div"> {
    leftSlot?: React.ReactNode;
    rightSlot?: React.ReactNode;
    bottomSlot?: React.ReactNode;
    title?: string;
    description?: string;
    interactive?: boolean;
}
declare function ListItem({ className, leftSlot, rightSlot, bottomSlot, title, description, interactive, children, ...props }: ListItemProps): import("react/jsx-runtime").JSX.Element;
export { ListItem };
