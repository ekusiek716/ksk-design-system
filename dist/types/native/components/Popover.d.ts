import React from "react";
export interface PopoverProps {
    open: boolean;
    onClose: () => void;
    /** triggerが描画される位置（画面座標）。anchor 計測は呼び出し側で行う */
    anchor?: {
        x: number;
        y: number;
        width?: number;
        height?: number;
    };
    children: React.ReactNode;
}
export declare function Popover({ open, onClose, anchor, children }: PopoverProps): import("react/jsx-runtime").JSX.Element;
