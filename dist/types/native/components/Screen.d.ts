import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export type ScreenPadding = "none" | "page";
export interface ScreenProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
    header?: React.ReactNode;
    scroll?: boolean;
    padding?: ScreenPadding;
    style?: StyleProp<ViewStyle>;
    bodyStyle?: StyleProp<ViewStyle>;
    headerStyle?: StyleProp<ViewStyle>;
    footerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
}
export declare function Screen({ children, footer, header, scroll, padding, style, bodyStyle, headerStyle, footerStyle, contentContainerStyle, }: ScreenProps): React.JSX.Element;
