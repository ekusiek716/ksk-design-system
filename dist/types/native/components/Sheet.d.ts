import React from "react";
export type SheetSide = "bottom" | "top" | "left" | "right";
export interface SheetProps {
    open: boolean;
    onClose: () => void;
    side?: SheetSide;
    title?: string;
    children?: React.ReactNode;
}
export declare function Sheet({ open, onClose, side, title, children }: SheetProps): import("react/jsx-runtime").JSX.Element;
