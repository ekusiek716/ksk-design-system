import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const containerVariants: (props?: {
    size?: "page" | "narrow" | "wide" | "fluid";
    gutter?: "none" | "default" | "tight" | "spacious";
} & import("class-variance-authority/types").ClassProp) => string;
interface ContainerProps extends React.ComponentProps<"div">, VariantProps<typeof containerVariants> {
}
/**
 * ページ内容の最大幅・中央寄せ・左右 gutter を一元管理する。
 * 縦方向の余白や背景帯は Section に委ねる。
 */
declare function Container({ className, size, gutter, ...props }: ContainerProps): React.JSX.Element;
export { Container, containerVariants };
export type { ContainerProps };
