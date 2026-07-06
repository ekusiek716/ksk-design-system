import * as React from "react";
interface GalleryImage {
    src: string;
    alt?: string;
}
interface ImageGalleryProps {
    images: GalleryImage[];
    indicatorType?: "thumbnail" | "dot";
    aspectRatio?: "square" | "4/3" | "16/9" | "3/4";
    onImageClick?: (index: number) => void;
    className?: string;
    /**
     * 前の画像ボタンの aria-label。i18n 対応: 英語では "Previous image" を渡す。@default "前の画像"
     */
    prevLabel?: string;
    /**
     * 次の画像ボタンの aria-label。i18n 対応: 英語では "Next image" を渡す。@default "次の画像"
     */
    nextLabel?: string;
    /**
     * 画像インデックスラベル生成関数。サムネイル / ドットの aria-label と alt テキストに使用。
     * i18n 対応: 英語では `(i) => \`Image ${i + 1}\`` を渡す。
     * @default (i) => `画像 ${i + 1}`
     */
    imageLabel?: (index: number) => string;
}
declare function ImageGallery({ images, indicatorType, aspectRatio, onImageClick, className, prevLabel, nextLabel, imageLabel, }: ImageGalleryProps): React.JSX.Element;
export { ImageGallery };
export type { ImageGalleryProps, GalleryImage };
