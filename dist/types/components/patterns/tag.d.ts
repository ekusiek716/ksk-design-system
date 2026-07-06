import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const tagVariants: (props?: {
    variant?: "success" | "info" | "warning" | "default" | "caution" | "brand";
} & import("class-variance-authority/types").ClassProp) => string;
declare function Tag({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof tagVariants>): React.JSX.Element;
export { Tag, tagVariants };
