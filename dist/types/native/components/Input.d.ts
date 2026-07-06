import React from "react";
import { type TextInputProps } from "react-native";
export interface InputProps extends Omit<TextInputProps, "style"> {
    invalid?: boolean;
    disabled?: boolean;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
}
export declare function Input({ invalid, disabled, leading, trailing, ...rest }: InputProps): React.JSX.Element;
