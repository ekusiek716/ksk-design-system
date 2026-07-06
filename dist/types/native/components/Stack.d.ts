import React from "react";
import { type ViewProps } from "react-native";
export interface StackProps extends ViewProps {
    /** spacing.scale のインデックス（0–15）。既定 3 = 12px */
    gap?: number;
    direction?: "row" | "column";
    align?: "flex-start" | "center" | "flex-end" | "stretch";
    justify?: "flex-start" | "center" | "flex-end" | "space-between";
    wrap?: boolean;
    children: React.ReactNode;
}
/** spacing トークン駆動の Flex レイアウト。Row/Column の薄いラッパ。 */
export declare function Stack({ gap, direction, align, justify, wrap, style, children, ...rest }: StackProps): React.JSX.Element;
