import * as React from "react";
import { SOCIAL_ICON_PLATFORMS, type SocialIconShape, type SocialIconTone } from "./social-icon-data";
export interface SocialIconProps extends Omit<React.ComponentProps<"svg">, "children"> {
    /** プラットフォーム名（小文字）。例: "github" / "spotify" / "tiktok" */
    platform: string;
    /**
     * アイコンの形。
     * - "original"（既定）: ロゴそのまま
     * - "square" / "rounded-square": 角丸四角の地に乗せた版
     * - "rounded": 円形地（一部ブランドのみ）
     */
    shape?: SocialIconShape;
    /**
     * 配色。
     * - "brand"（既定）: ブランドカラー
     * - "mono": 単色（currentColor — テキスト色に追従）
     * - "gray": グレー固定
     */
    tone?: SocialIconTone;
    /** 一辺のサイズ(px) @default 24 */
    size?: number;
}
/**
 * SocialIcon — SNS / 外部サービスのブランドアイコン
 *
 * `socialicon/` 配下の SVG を `scripts/generate-social-icons.mjs` で取り込んだ
 * 安定データ（`social-icon-data.tsx`）を描画する。`platform` はファイル名では
 * なく正規化済みキーで指定するため、元アセットの命名揺れに依存しない。
 *
 * ```tsx
 * <SocialIcon platform="github" />
 * <SocialIcon platform="spotify" tone="mono" />
 * <SocialIcon platform="tiktok" shape="rounded-square" size={32} />
 * ```
 *
 * 利用可能な platform は {@link SOCIAL_ICON_PLATFORMS}。未収録の指定は何も
 * 描画しない（null）。
 */
declare function SocialIcon({ platform, shape, tone, size, className, ...props }: SocialIconProps): import("react/jsx-runtime").JSX.Element;
export { SocialIcon, SOCIAL_ICON_PLATFORMS };
export type { SocialIconShape, SocialIconTone };
