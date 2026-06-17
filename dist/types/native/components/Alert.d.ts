import React from "react";
export type AlertTone = "info" | "success" | "warning" | "caution";
export interface AlertProps {
    tone?: AlertTone;
    title?: string;
    description?: string;
    children?: React.ReactNode;
}
export declare function Alert({ tone, title, description, children }: AlertProps): import("react/jsx-runtime").JSX.Element;
