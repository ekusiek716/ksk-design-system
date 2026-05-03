interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    max?: number;
    size?: "sm" | "md" | "lg" | "xl";
    /** 右端に "2/5" 形式のテキストを表示 */
    showLabel?: boolean;
    className?: string;
}
declare function StarRating({ value, onChange, max, size, showLabel, className, }: StarRatingProps): import("react/jsx-runtime").JSX.Element;
export { StarRating };
export type { StarRatingProps };
