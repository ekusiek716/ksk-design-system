export interface RatingDisplayProps {
    rating: number;
    count?: number;
    size?: number;
    layout?: "row" | "stacked";
}
export declare function RatingDisplay({ rating, count, size, layout }: RatingDisplayProps): import("react/jsx-runtime").JSX.Element;
