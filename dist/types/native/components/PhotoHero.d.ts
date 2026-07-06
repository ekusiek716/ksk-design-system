import React from "react";
import { type ImageStyle, type ImageSourcePropType, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
export type PhotoHeroOverlay = "none" | "medium" | "dark";
export type PhotoHeroAlign = "bottom" | "center";
type PhotoHeroSource = ImageSourcePropType | string;
export interface PhotoHeroProps {
    src: PhotoHeroSource;
    alt?: string;
    overlay?: PhotoHeroOverlay;
    align?: PhotoHeroAlign;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}
interface PhotoHeroTextProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
}
interface PhotoHeroActionsProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
declare function PhotoHeroRoot({ src, alt, overlay, align, children, style, imageStyle, contentStyle, }: PhotoHeroProps): React.JSX.Element;
declare function PhotoHeroEyebrow({ children, style, numberOfLines }: PhotoHeroTextProps): React.JSX.Element;
declare function PhotoHeroTitle({ children, style, numberOfLines }: PhotoHeroTextProps): React.JSX.Element;
declare function PhotoHeroBody({ children, style, numberOfLines }: PhotoHeroTextProps): React.JSX.Element;
declare function PhotoHeroActions({ children, style }: PhotoHeroActionsProps): React.JSX.Element;
export declare const PhotoHero: typeof PhotoHeroRoot & {
    Eyebrow: typeof PhotoHeroEyebrow;
    Title: typeof PhotoHeroTitle;
    Body: typeof PhotoHeroBody;
    Actions: typeof PhotoHeroActions;
};
export {};
