import { type ImageSourcePropType } from "react-native";
export interface BannerProps {
    title?: string;
    description?: string;
    image?: ImageSourcePropType;
    onPress?: () => void;
    tone?: "neutral" | "accent" | "success" | "warning" | "caution";
    height?: number;
}
export declare function Banner({ title, description, image, onPress, tone, height }: BannerProps): import("react/jsx-runtime").JSX.Element;
