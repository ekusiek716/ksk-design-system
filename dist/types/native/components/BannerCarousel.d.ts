import { type BannerProps } from "./Banner";
export interface BannerCarouselProps {
    banners: BannerProps[];
    itemWidth?: number;
    height?: number;
    showIndicator?: boolean;
}
export declare function BannerCarousel({ banners, itemWidth, height, showIndicator, }: BannerCarouselProps): import("react/jsx-runtime").JSX.Element;
