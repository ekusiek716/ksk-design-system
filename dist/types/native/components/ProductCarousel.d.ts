import React from "react";
import { type ProductCardProps } from "./ProductCard";
export interface ProductCarouselProps {
    title?: string;
    action?: {
        label: string;
        onPress: () => void;
    };
    products: ProductCardProps[];
    cardWidth?: number;
}
export declare function ProductCarousel({ title, action, products, cardWidth, }: ProductCarouselProps): React.JSX.Element;
