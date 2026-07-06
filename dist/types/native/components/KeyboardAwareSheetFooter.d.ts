import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export type KeyboardAwareSheetFooterBehavior = "fixed" | "hide" | "scroll";
export interface KeyboardAwareSheetFooterProps {
    behavior?: KeyboardAwareSheetFooterBehavior;
    hideWhenInputFocused?: boolean;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function KeyboardAwareSheetFooter({ behavior, hideWhenInputFocused, children, style, }: KeyboardAwareSheetFooterProps): React.JSX.Element;
