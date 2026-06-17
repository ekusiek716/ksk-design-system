export interface PriceDisplayProps {
    price: number;
    originalPrice?: number;
    currency?: string;
    size?: "sm" | "md" | "lg";
    showTax?: boolean;
}
export declare function PriceDisplay({ price, originalPrice, currency, size, showTax, }: PriceDisplayProps): import("react/jsx-runtime").JSX.Element;
