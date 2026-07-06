import React from "react";
import { type TextProps as RNTextProps } from "react-native";
import { type TypoVariant } from "../typography";
export interface TextProps extends RNTextProps {
    variant?: TypoVariant;
    color?: string;
    children: React.ReactNode;
}
/** typo トークンを適用する DS テキスト。色は未指定なら text.high-emphasis。 */
export declare function Text({ variant, color, style, children, ...rest }: TextProps): React.JSX.Element;
