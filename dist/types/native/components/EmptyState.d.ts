import React from "react";
export interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}
export declare function EmptyState({ title, description, icon, action }: EmptyStateProps): import("react/jsx-runtime").JSX.Element;
