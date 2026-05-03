import * as React from "react";
interface ProductCardTag {
    label: string;
    variant?: "default" | "brand" | "caution" | "success";
}
interface ProductCardProps extends React.ComponentProps<"div"> {
    name: string;
    imageUrl: string;
    imageAlt?: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviewCount?: number;
    shopName?: string;
    tags?: ProductCardTag[];
    isFavorite?: boolean;
    onFavoriteToggle?: () => void;
    href?: string;
    onCardClick?: () => void;
    ranking?: number;
    deliveryLabel?: string;
    orientation?: "vertical" | "horizontal";
    showCartButton?: boolean;
    onCartAdd?: () => void;
    cartButtonLabel?: string;
}
declare function ProductCard({ className, name, imageUrl, imageAlt, price, originalPrice, rating, reviewCount, shopName, tags, isFavorite, onFavoriteToggle, href, onCardClick, ranking, deliveryLabel, orientation, showCartButton, onCartAdd, cartButtonLabel, ...props }: ProductCardProps): import("react/jsx-runtime").JSX.Element;
export { ProductCard };
export type { ProductCardProps, ProductCardTag };
