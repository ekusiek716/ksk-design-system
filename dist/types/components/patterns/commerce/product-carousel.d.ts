import * as React from "react";
import { type ProductCardProps } from "./product-card";
interface ProductCarouselProps extends React.ComponentProps<"section"> {
    title: string;
    subtitle?: string;
    moreHref?: string;
    moreLabel?: string;
    onMoreClick?: () => void;
    products: ProductCardProps[];
    cardSize?: "sm" | "md" | "lg";
    showRanking?: boolean;
    showCartButton?: boolean;
}
declare function ProductCarousel({ className, title, subtitle, moreHref, moreLabel, onMoreClick, products, cardSize, showRanking, showCartButton, ...props }: ProductCarouselProps): import("react/jsx-runtime").JSX.Element;
export { ProductCarousel };
