import React from "react";
import { type PressableProps } from "react-native";
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive" | "glass";
export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
    variant?: ButtonVariant;
    children: React.ReactNode;
}
/** variant を semantic トークン（brand / active / caution / border）で表現するボタン。 */
export declare function Button({ variant, children, ...rest }: ButtonProps): import("react/jsx-runtime").JSX.Element;
