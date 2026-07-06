import React from "react";
import { type TextInputProps } from "react-native";
export interface TextareaProps extends Omit<TextInputProps, "style" | "multiline"> {
    invalid?: boolean;
    disabled?: boolean;
    minHeight?: number;
}
export declare function Textarea({ invalid, disabled, minHeight, ...rest }: TextareaProps): React.JSX.Element;
