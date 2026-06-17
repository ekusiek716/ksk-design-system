import { type ImageSourcePropType } from "react-native";
export type AvatarSize = "sm" | "md" | "lg" | "xl";
export interface AvatarProps {
    source?: ImageSourcePropType;
    fallback?: string;
    size?: AvatarSize;
}
export declare function Avatar({ source, fallback, size }: AvatarProps): import("react/jsx-runtime").JSX.Element;
