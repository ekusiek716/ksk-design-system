import React from "react";
import { type AccessibilityProps, type StyleProp, type ViewStyle } from "react-native";
export type IconBadgeSize = "md" | "ml" | "lg";
export interface IconBadgeRenderProps {
    color: string;
    size: number;
}
export interface IconBadgeProps extends AccessibilityProps {
    size?: IconBadgeSize;
    children: React.ReactNode | ((props: IconBadgeRenderProps) => React.ReactNode);
    style?: StyleProp<ViewStyle>;
}
export declare function IconBadge({ size, children, style, accessibilityLabel, ...accessibilityProps }: IconBadgeProps): React.JSX.Element;
