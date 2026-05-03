interface BannerItem {
    /** 背景画像URL（なければ gradient） */
    imageSrc?: string;
    /** グラデーション色（imageSrcがない場合） */
    gradient?: string;
    caption?: string;
    subCaption?: string;
    href?: string;
    onClick?: () => void;
}
interface BannerCarouselProps {
    title?: string;
    items: BannerItem[];
    /** 「もっと見る」テキスト */
    moreLabel?: string;
    onMore?: () => void;
    /** バナーの縦横比 */
    itemAspectRatio?: "2/1" | "3/2" | "4/3";
    /** バナー幅（px） */
    itemWidth?: number;
    className?: string;
}
declare function BannerCarousel({ title, items, moreLabel, onMore, itemAspectRatio, itemWidth, className, }: BannerCarouselProps): import("react/jsx-runtime").JSX.Element;
export { BannerCarousel };
export type { BannerCarouselProps, BannerItem };
