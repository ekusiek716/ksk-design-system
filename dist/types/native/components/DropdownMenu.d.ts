import React from "react";
export interface DropdownMenuItem {
    key: string;
    label: string;
    destructive?: boolean;
    disabled?: boolean;
    onSelect?: () => void;
}
export interface DropdownMenuProps {
    open: boolean;
    onClose: () => void;
    anchor?: {
        x: number;
        y: number;
        width?: number;
        height?: number;
    };
    items: DropdownMenuItem[];
}
export declare function DropdownMenu({ open, onClose, anchor, items }: DropdownMenuProps): React.JSX.Element;
