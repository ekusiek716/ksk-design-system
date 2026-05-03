import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const chipVariants: (props?: {
    variant?: "outline" | "filled" | "accent";
    size?: "sm" | "lg" | "md";
    shape?: "square" | "pill";
} & import("class-variance-authority/types").ClassProp) => string;
interface ChipProps extends React.ComponentProps<"button">, VariantProps<typeof chipVariants> {
    selected?: boolean;
    removable?: boolean;
    onRemove?: () => void;
}
declare function Chip({ className, variant, size, shape, selected, removable, onRemove, children, ...props }: ChipProps): import("react/jsx-runtime").JSX.Element;
export { Chip, chipVariants };
