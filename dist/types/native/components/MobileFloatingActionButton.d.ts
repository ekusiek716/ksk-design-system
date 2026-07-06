import React from "react";
import { type PressableProps, type StyleProp, type ViewStyle } from "react-native";
export type MobileFloatingActionButtonPlacement = "end" | "start" | "center";
export type MobileFloatingActionButtonKeyboardBehavior = "hide" | "lift" | "stay";
export type MobileFloatingActionButtonBottomOffset = "none" | "bottom-nav" | "bottom-nav-pill" | "bottom-nav-pill-inline";
export interface MobileFloatingActionButtonProps extends Omit<PressableProps, "children" | "style"> {
    label: string;
    icon?: React.ReactNode;
    showLabel?: boolean;
    placement?: MobileFloatingActionButtonPlacement;
    bottomOffset?: MobileFloatingActionButtonBottomOffset;
    keyboardBehavior?: MobileFloatingActionButtonKeyboardBehavior;
    style?: StyleProp<ViewStyle>;
}
export declare function MobileFloatingActionButton({ label, icon, showLabel, placement, bottomOffset, keyboardBehavior, style, ...rest }: MobileFloatingActionButtonProps): React.JSX.Element;
