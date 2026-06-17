import { type SocialIconBrand } from "./social-icon-data";
export type { SocialIconBrand };
export interface SocialIconProps {
    brand: SocialIconBrand;
    size?: number;
}
/**
 * Web側のSocialIconはSVGでブランドロゴを忠実再現するが、
 * RN側はサードパーティに依存しないので「ブランド色 + 1〜2文字」での簡略表現。
 * ブランドカラー定数は ./social-icon-data に分離している。
 */
export declare function SocialIcon({ brand, size }: SocialIconProps): import("react/jsx-runtime").JSX.Element;
