interface ReviewCardProps {
    reviewer: string;
    /** アバターの頭文字（画像がない場合） */
    avatarChar?: string;
    avatarSrc?: string;
    rating: number;
    title?: string;
    body: string;
    date: string;
    helpfulCount?: number;
    onHelpful?: () => void;
    /** helpful 済みかどうか */
    helpful?: boolean;
    className?: string;
}
declare function StarRow({ rating, size }: {
    rating: number;
    size?: number;
}): import("react").JSX.Element;
declare function ReviewCard({ reviewer, avatarChar, avatarSrc, rating, title, body, date, helpfulCount, onHelpful, helpful, className, }: ReviewCardProps): import("react").JSX.Element;
export { ReviewCard, StarRow };
export type { ReviewCardProps };
