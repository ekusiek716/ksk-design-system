import React from "react";
export interface BottomSheetFormProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    footer?: React.ReactNode;
    children: React.ReactNode;
}
export declare function BottomSheetForm({ open, onClose, title, description, footer, children, }: BottomSheetFormProps): import("react/jsx-runtime").JSX.Element;
