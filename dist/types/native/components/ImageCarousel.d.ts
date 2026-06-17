import { type ImageSourcePropType } from "react-native";
export interface ImageCarouselProps {
    images: ImageSourcePropType[];
    height?: number;
    showCounter?: boolean;
    showDots?: boolean;
}
export declare function ImageCarousel({ images, height, showCounter, showDots, }: ImageCarouselProps): import("react/jsx-runtime").JSX.Element;
