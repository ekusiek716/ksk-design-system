import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/lib/server-variants/button-variants";
/** navigator.vibrate のパターン (ms) */
declare const HAPTIC_PATTERNS: Record<string, number | number[]>;
type HapticType = keyof typeof HAPTIC_PATTERNS;
interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    /** モバイルでの触覚フィードバック。navigator.vibrate() を使用。未対応環境では無視される。 */
    haptic?: HapticType;
}
declare function Button({ className, variant, size, layout, haptic, onClick, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export { Button, buttonVariants };
export type { ButtonProps, HapticType };
