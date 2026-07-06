import React from "react";
import { type ViewStyle } from "react-native";
export interface SkeletonProps {
    width?: number | `${number}%`;
    height?: number;
    radius?: number;
    style?: ViewStyle;
}
export declare function Skeleton({ width, height, radius, style }: SkeletonProps): React.JSX.Element;
export declare function SkeletonText({ lines }: {
    lines?: number;
}): React.JSX.Element;
