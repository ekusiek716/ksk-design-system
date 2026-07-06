import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export type MediaActionClusterOrientation = "vertical" | "horizontal" | "auto";
export type MediaActionClusterAnchor = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-left" | "center-right";
export type MediaActionClusterPosition = "absolute" | "fixed" | "relative";
export type MediaActionClusterLabelPosition = "below" | "side" | "auto";
export interface MediaActionClusterItem {
    id?: string;
    label: string;
    accessibilityLabel?: string;
    ariaLabel?: string;
    icon: React.ReactNode;
    href?: string;
    onPress?: () => void;
    onClick?: () => void;
    active?: boolean;
    badge?: React.ReactNode;
    disabled?: boolean;
}
export interface MediaActionClusterProps {
    items: MediaActionClusterItem[];
    orientation?: MediaActionClusterOrientation;
    anchor?: MediaActionClusterAnchor;
    position?: MediaActionClusterPosition;
    labelPosition?: MediaActionClusterLabelPosition;
    autoHideMs?: number | null;
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
}
export declare function MediaActionCluster({ items, orientation, anchor, position, labelPosition, autoHideMs, defaultVisible, onVisibleChange, accessibilityLabel, style, }: MediaActionClusterProps): React.JSX.Element;
