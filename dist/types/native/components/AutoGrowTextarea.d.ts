import React from "react";
import { type TextInputProps } from "react-native";
export type AutoGrowTextareaDensity = "default" | "compact";
export interface AutoGrowTextareaProps extends Omit<TextInputProps, "style" | "multiline"> {
    invalid?: boolean;
    disabled?: boolean;
    minHeight?: number;
    maxHeight?: number;
    density?: AutoGrowTextareaDensity;
}
export declare function AutoGrowTextarea({ invalid, disabled, minHeight, maxHeight, density, ...rest }: AutoGrowTextareaProps): React.JSX.Element;
