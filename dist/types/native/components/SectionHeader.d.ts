import React from "react";
export interface SectionHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        onPress: () => void;
    };
    variant?: "default" | "subtle";
}
export declare function SectionHeader({ title, description, action, variant }: SectionHeaderProps): React.JSX.Element;
