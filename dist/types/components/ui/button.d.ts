import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const buttonVariants: (props?: {
    variant?: "link" | "default" | "secondary" | "secondary-switch" | "tertiary" | "ghost" | "destructive" | "glass";
    size?: "default" | "xs" | "sm" | "lg" | "xl" | "icon" | "icon-sm" | "icon-lg" | "icon-xl";
} & import("class-variance-authority/types").ClassProp) => string;
/** navigator.vibrate のパターン (ms) */
declare const HAPTIC_PATTERNS: Record<string, number | number[]>;
type HapticType = keyof typeof HAPTIC_PATTERNS;
interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    /** モバイルでの触覚フィードバック。navigator.vibrate() を使用。未対応環境では無視される。 */
    haptic?: HapticType;
}
declare function Button({ className, variant, size, haptic, onClick, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export { Button, buttonVariants };
export type { ButtonProps, HapticType };
