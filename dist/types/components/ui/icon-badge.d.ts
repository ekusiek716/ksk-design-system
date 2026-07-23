import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const iconBadgeVariants: (props?: {
    size?: "lg" | "md" | "ml";
    appearance?: "accent" | "plain";
} & import("class-variance-authority/types").ClassProp) => string;
interface IconBadgeProps extends React.ComponentProps<"span">, VariantProps<typeof iconBadgeVariants> {
}
/**
 * 淡いアクセント面に装飾アイコンを収める、外側余白を持たないバッジ。
 *
 * `appearance="plain"` は既存パターン内のアイコン枠を同じ DOM 責務へ
 * 集約するための互換モード。寸法・色・余白は利用側の className が担当する。
 */
declare function IconBadge({ className, size, appearance, "aria-label": ariaLabel, ...props }: IconBadgeProps): React.JSX.Element;
export { IconBadge, iconBadgeVariants };
export type { IconBadgeProps };
