import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const tagVariants: (props?: {
    variant?: "default" | "success" | "info" | "warning" | "caution" | "brand";
} & import("class-variance-authority/types").ClassProp) => string;
declare function Tag({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof tagVariants>): import("react/jsx-runtime").JSX.Element;
export { Tag, tagVariants };
