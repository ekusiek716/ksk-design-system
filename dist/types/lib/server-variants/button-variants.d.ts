import { type VariantProps } from "class-variance-authority";
/**
 * Button の className 生成器（pure cva）。
 *
 * このファイルは **React に依存しない**。Button コンポーネント (button.tsx)
 * と、Server Component 向けの再エクスポート (src/class-names.ts) の両方から
 * 参照される。React フックを含むファイルから export すると "use client" 境界に
 * 巻き込まれて Server Component から import できなくなるため、純粋な variants
 * 定義はここに集約する。
 *
 * 変更時は button.tsx の Button コンポーネントの見た目に直接影響する。
 */
declare const buttonVariants: (props?: {
    variant?: "link" | "default" | "secondary" | "secondary-switch" | "tertiary" | "ghost" | "destructive" | "glass" | "glass-inverse" | "glass-accent" | "accent" | "inverse" | "ghost-inverse";
    size?: "match" | "icon" | "default" | "xs" | "sm" | "lg" | "xl" | "hero" | "icon-sm" | "icon-lg" | "icon-xl" | "icon-fab";
    layout?: "horizontal" | "vertical";
} & import("class-variance-authority/types").ClassProp) => string;
type ButtonVariantsProps = VariantProps<typeof buttonVariants>;
export { buttonVariants };
export type { ButtonVariantsProps };
