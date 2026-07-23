import React from "react";
import { TextInput, type TextInputProps } from "react-native";
export interface InputProps extends Omit<TextInputProps, "style"> {
    invalid?: boolean;
    disabled?: boolean;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<TextInput>>;
