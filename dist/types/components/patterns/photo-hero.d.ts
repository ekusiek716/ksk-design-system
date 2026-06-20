import * as React from "react";
type PhotoHeroOverlay = "none" | "medium" | "dark";
type PhotoHeroAlign = "bottom" | "center";
interface PhotoHeroProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
    src: string;
    alt?: string;
    /** 文字可読性のための暗化 */
    overlay?: PhotoHeroOverlay;
    /** コンテンツの縦配置 */
    align?: PhotoHeroAlign;
    children: React.ReactNode;
    imageClassName?: string;
    contentClassName?: string;
    loading?: React.ImgHTMLAttributes<HTMLImageElement>["loading"];
}
declare function PhotoHeroRoot({ src, alt, overlay, align, children, className, imageClassName, contentClassName, loading, ...props }: PhotoHeroProps): import("react/jsx-runtime").JSX.Element;
declare function PhotoHeroEyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>): import("react/jsx-runtime").JSX.Element;
declare function PhotoHeroTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>): import("react/jsx-runtime").JSX.Element;
declare function PhotoHeroBody({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>): import("react/jsx-runtime").JSX.Element;
declare function PhotoHeroActions({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
declare const PhotoHero: typeof PhotoHeroRoot & {
    Eyebrow: typeof PhotoHeroEyebrow;
    Title: typeof PhotoHeroTitle;
    Body: typeof PhotoHeroBody;
    Actions: typeof PhotoHeroActions;
};
export { PhotoHero };
export type { PhotoHeroAlign, PhotoHeroOverlay, PhotoHeroProps };
