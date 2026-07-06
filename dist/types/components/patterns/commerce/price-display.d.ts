import * as React from "react";
import { type VariantProps } from "class-variance-authority";
/** 価格表示バリアント定義 */
declare const priceVariants: (props?: {
    size?: "sm" | "lg" | "xl" | "md";
} & import("class-variance-authority/types").ClassProp) => string;
interface PriceDisplayProps extends React.ComponentProps<"div">, VariantProps<typeof priceVariants> {
    /** 表示価格 */
    price: number;
    /** 価格範囲の最大値（範囲表示用） */
    maxPrice?: number;
    /** 元の価格（セール時の打ち消し線表示用） */
    originalPrice?: number;
    /** 税込ラベルを表示するか */
    showTaxLabel?: boolean;
    /** 通貨記号 */
    currency?: string;
}
declare function PriceDisplay({ className, price, maxPrice, originalPrice, showTaxLabel, currency, size, ...props }: PriceDisplayProps): React.JSX.Element;
export { PriceDisplay, priceVariants };
