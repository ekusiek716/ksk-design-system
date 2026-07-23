import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const sectionVariants: (props?: {
    spacing?: "sm" | "lg" | "xl" | "md";
    background?: "none" | "subtle" | "accent-subtle";
} & import("class-variance-authority/types").ClassProp) => string;
type SectionElement = "section" | "div" | "footer" | "aside";
interface SectionProps extends React.ComponentProps<"section">, VariantProps<typeof sectionVariants> {
    as?: SectionElement;
}
/**
 * 全幅の背景帯とセクション間の縦リズムを管理する。
 * 最大幅・中央寄せ・左右 gutter は内側の Container に委ねる。
 */
declare function Section({ as: Component, className, spacing, background, ...props }: SectionProps): React.JSX.Element;
export { Section, sectionVariants };
export type { SectionElement, SectionProps };
