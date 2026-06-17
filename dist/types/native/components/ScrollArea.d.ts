import React from "react";
import { type ScrollViewProps } from "react-native";
export interface ScrollAreaProps extends ScrollViewProps {
    maxHeight?: number;
    bordered?: boolean;
    children: React.ReactNode;
}
/** ScrollView の薄いラッパ。max-height と枠線つけたいケース用。 */
export declare function ScrollArea({ maxHeight, bordered, children, ...rest }: ScrollAreaProps): import("react/jsx-runtime").JSX.Element;
