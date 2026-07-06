import React from "react";
import { type ImageSourcePropType } from "react-native";
export type AvatarSize = "sm" | "md" | "lg" | "xl";
export interface AvatarProps {
    source?: ImageSourcePropType;
    fallback?: string;
    size?: AvatarSize;
}
export declare function Avatar({ source, fallback, size }: AvatarProps): React.JSX.Element;
