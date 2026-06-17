import { type ImageSourcePropType } from "react-native";
export interface ProductCardProps {
    image?: ImageSourcePropType;
    title: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviewCount?: number;
    badge?: string;
    soldOut?: boolean;
    onPress?: () => void;
    layout?: "vertical" | "horizontal";
}
export declare function ProductCard({ image, title, price, originalPrice, rating, reviewCount, badge, soldOut, onPress, layout, }: ProductCardProps): import("react/jsx-runtime").JSX.Element;
