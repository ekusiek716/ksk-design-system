interface ReviewSummaryProps {
    /** 平均評価 (0-5) */
    averageRating: number;
    /** 総レビュー数 */
    totalCount: number;
    /** 各星評価の件数 [5星, 4星, 3星, 2星, 1星] */
    distribution: [number, number, number, number, number];
    className?: string;
}
declare function ReviewSummary({ averageRating, totalCount, distribution, className, }: ReviewSummaryProps): import("react").JSX.Element;
export { ReviewSummary };
export type { ReviewSummaryProps };
