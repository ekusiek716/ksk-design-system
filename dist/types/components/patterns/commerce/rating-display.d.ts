import * as React from "react";
interface RatingDisplayProps extends React.ComponentProps<"div"> {
    /** 評価値（0〜5） */
    rating: number;
    /** レビュー件数 */
    reviewCount?: number;
    /** 表示サイズ */
    size?: "sm" | "md" | "lg";
    /** レビュー件数を表示するか */
    showCount?: boolean;
    /** 評価値を数値で表示するか */
    showValue?: boolean;
}
declare function RatingDisplay({ className, rating, reviewCount, size, showCount, showValue, ...props }: RatingDisplayProps): import("react/jsx-runtime").JSX.Element;
export { RatingDisplay };
