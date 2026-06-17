import { type ImageSourcePropType } from "react-native";
export interface ImageGalleryProps {
    images: ImageSourcePropType[];
    initialIndex?: number;
    thumbnailSize?: number;
}
export declare function ImageGallery({ images, initialIndex, thumbnailSize }: ImageGalleryProps): import("react/jsx-runtime").JSX.Element;
