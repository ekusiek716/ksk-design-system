import React from "react";
import { type TextProps as RNTextProps } from "react-native";
import { type TypoVariant } from "../typography";
export interface TextProps extends RNTextProps {
    variant?: TypoVariant;
    color?: string;
    children: React.ReactNode;
}
/**
 * typo トークンを適用する DS テキスト。
 * 色は未指定なら text.high-emphasis。ただし variant が caption 系（出典・補足・注釈）の
 * ときは既定で text.low-emphasis（hint 相当）にする — 各consumerが `text-hint` を
 * 手書きしていた箇所を variant だけで賄えるようにするため。
 */
export declare function Text({ variant, color, style, children, ...rest }: TextProps): React.JSX.Element;
