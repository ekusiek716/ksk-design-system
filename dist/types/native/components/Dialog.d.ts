import React from "react";
export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    /** タップで閉じるか */
    dismissOnBackdrop?: boolean;
}
export declare function Dialog({ open, onClose, title, description, footer, children, dismissOnBackdrop, }: DialogProps): React.JSX.Element;
