import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export type ActionTileVariant = "neutral" | "selected" | "success" | "info" | "caution";
export interface ActionTileProps {
    icon?: React.ReactNode;
    emoji?: React.ReactNode;
    label: React.ReactNode;
    description?: React.ReactNode;
    meta?: React.ReactNode;
    selected?: boolean;
    loading?: boolean;
    disabled?: boolean;
    variant?: ActionTileVariant;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}
export interface QuickActionGridProps {
    columns?: 2 | 3 | 4;
    gap?: number;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function ActionTile({ icon, emoji, label, description, meta, selected, loading, disabled, variant, onPress, style, }: ActionTileProps): React.JSX.Element;
export declare function QuickActionGrid({ columns, gap, children, style, }: QuickActionGridProps): React.JSX.Element;
