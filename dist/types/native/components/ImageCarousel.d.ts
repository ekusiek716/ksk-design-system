import React from "react";
import { type ImageSourcePropType } from "react-native";
export interface ImageCarouselProps {
    images: ImageSourcePropType[];
    height?: number;
    showCounter?: boolean;
    showDots?: boolean;
}
export declare function ImageCarousel({ images, height, showCounter, showDots, }: ImageCarouselProps): React.JSX.Element;
