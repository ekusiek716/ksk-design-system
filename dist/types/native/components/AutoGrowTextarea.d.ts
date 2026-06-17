import { type TextInputProps } from "react-native";
export interface AutoGrowTextareaProps extends Omit<TextInputProps, "style" | "multiline"> {
    invalid?: boolean;
    disabled?: boolean;
    minHeight?: number;
    maxHeight?: number;
}
export declare function AutoGrowTextarea({ invalid, disabled, minHeight, maxHeight, ...rest }: AutoGrowTextareaProps): import("react/jsx-runtime").JSX.Element;
