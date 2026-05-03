import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const bannerVariants: (props?: {
    variant?: "success" | "info" | "warning" | "caution";
} & import("class-variance-authority/types").ClassProp) => string;
interface BannerProps extends React.ComponentProps<"div">, VariantProps<typeof bannerVariants> {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    action?: React.ReactNode;
}
declare function Banner({ className, variant, icon, title, description, action, children, ...props }: BannerProps): import("react/jsx-runtime").JSX.Element;
export { Banner, bannerVariants };
