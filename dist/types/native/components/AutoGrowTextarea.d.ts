import React from "react";
import { TextInput, type TextInputProps } from "react-native";
export type AutoGrowTextareaDensity = "default" | "compact";
export interface AutoGrowTextareaProps extends Omit<TextInputProps, "style" | "multiline"> {
    invalid?: boolean;
    disabled?: boolean;
    minHeight?: number;
    maxHeight?: number;
    density?: AutoGrowTextareaDensity;
}
export declare const AutoGrowTextarea: React.ForwardRefExoticComponent<AutoGrowTextareaProps & React.RefAttributes<TextInput>>;
