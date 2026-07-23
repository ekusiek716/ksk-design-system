import * as React from "react";
interface ContentCarouselProps extends React.ComponentProps<"div"> {
    /** 任意の React コンテンツを 1 枚ずつ表示する。 */
    slides: React.ReactNode[];
    showDots?: boolean;
    showArrows?: boolean;
    /** 自動送りの間隔（ms）。0 で無効。 */
    autoPlay?: number;
}
/**
 * ReactNode をスライドとして扱える汎用カルーセル。
 *
 * 矢印とドットは ImageCarousel と同じ内部プリミティブを使い、意匠と挙動を
 * 同期する。画像だけなら ImageCarousel、商品一覧なら ProductCarousel を使う。
 */
declare function ContentCarousel({ slides, showDots, showArrows, autoPlay, className, "aria-label": ariaLabel, onKeyDown, onMouseEnter, onMouseLeave, onFocusCapture, onBlurCapture, tabIndex, ...props }: ContentCarouselProps): React.JSX.Element;
export { ContentCarousel };
export type { ContentCarouselProps };
