import { type ImageSourcePropType } from "react-native";
export interface ReviewCardProps {
    authorName: string;
    authorAvatar?: ImageSourcePropType;
    rating: number;
    date?: string;
    title?: string;
    comment: string;
    helpfulCount?: number;
}
export declare function ReviewCard({ authorName, authorAvatar, rating, date, title, comment, helpfulCount, }: ReviewCardProps): import("react/jsx-runtime").JSX.Element;
