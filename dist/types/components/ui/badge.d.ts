import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const badgeVariants: (props?: {
    variant?: "default" | "success" | "info" | "warning" | "secondary" | "ghost" | "destructive" | "outline" | "subtle";
} & import("class-variance-authority/types").ClassProp) => string;
declare function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>): import("react/jsx-runtime").JSX.Element;
export { Badge, badgeVariants };
