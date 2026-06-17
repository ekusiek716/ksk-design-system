import React from "react";
export interface ListItemProps {
    leading?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    trailing?: React.ReactNode;
    showChevron?: boolean;
    onPress?: () => void;
    disabled?: boolean;
}
export declare function ListItem({ leading, title, description, trailing, showChevron, onPress, disabled, }: ListItemProps): import("react/jsx-runtime").JSX.Element;
