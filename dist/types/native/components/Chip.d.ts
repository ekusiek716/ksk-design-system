import React from "react";
import { type PressableProps } from "react-native";
export type ChipVariant = "filled" | "accent" | "outline";
export type ChipSize = "sm" | "md" | "lg";
export type ChipShape = "pill" | "square";
export interface ChipProps extends Omit<PressableProps, "children" | "style"> {
    variant?: ChipVariant;
    size?: ChipSize;
    shape?: ChipShape;
    selected?: boolean;
    disabled?: boolean;
    count?: number;
    removable?: boolean;
    onRemove?: () => void;
    children?: React.ReactNode;
}
export declare function Chip({ variant, size, shape, selected, disabled, count, removable, onRemove, children, ...rest }: ChipProps): import("react/jsx-runtime").JSX.Element;
