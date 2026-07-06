import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export type BottomSheetFramePreset = "mobile-full" | "mobile-form" | "desktop-floating";
export interface BottomSheetFrameProps {
    preset?: BottomSheetFramePreset;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    scrollable?: boolean;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    bodyStyle?: StyleProp<ViewStyle>;
}
export declare function BottomSheetFrame({ preset, header, footer, scrollable, children, style, bodyStyle, }: BottomSheetFrameProps): React.JSX.Element;
