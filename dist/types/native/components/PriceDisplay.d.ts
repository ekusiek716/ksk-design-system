import React from "react";
export interface PriceDisplayProps {
    price: number;
    originalPrice?: number;
    currency?: string;
    size?: "sm" | "md" | "lg";
    showTax?: boolean;
}
export declare function PriceDisplay({ price, originalPrice, currency, size, showTax, }: PriceDisplayProps): React.JSX.Element;
