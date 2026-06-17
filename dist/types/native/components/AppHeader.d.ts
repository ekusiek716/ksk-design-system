import React from "react";
export interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    onBack?: () => void;
    centered?: boolean;
}
export declare function AppHeader({ title, subtitle, leading, trailing, onBack, centered }: AppHeaderProps): import("react/jsx-runtime").JSX.Element;
