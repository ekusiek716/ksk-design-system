import React from "react";
export interface ErrorStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}
export declare function ErrorState({ title, description, icon, action, }: ErrorStateProps): import("react/jsx-runtime").JSX.Element;
