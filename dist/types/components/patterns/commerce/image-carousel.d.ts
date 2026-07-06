import * as React from "react";
interface ImageCarouselProps extends React.ComponentProps<"div"> {
    images: Array<{
        src: string;
        alt: string;
        href?: string;
    }>;
    aspectRatio?: "square" | "video" | "banner";
    showDots?: boolean;
    showArrows?: boolean;
    autoPlay?: number;
}
declare function ImageCarousel({ images, aspectRatio, showDots, showArrows, autoPlay, className, ...props }: ImageCarouselProps): React.JSX.Element;
export { ImageCarousel };
