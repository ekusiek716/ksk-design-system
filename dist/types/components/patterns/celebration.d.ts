import * as React from "react";
type CelebrationTrigger = "confetti" | "emoji" | "both" | "none";
type CelebrationPlacement = "overlay" | "inline";
interface CelebrationProps extends React.ComponentProps<"div"> {
    active?: boolean;
    trigger?: CelebrationTrigger;
    placement?: CelebrationPlacement;
    emoji?: string;
    title?: string;
    description?: string;
    particleCount?: number;
    durationMs?: number;
    onDone?: () => void;
}
declare function Celebration({ active, trigger, placement, emoji, title, description, particleCount, durationMs, onDone, className, ...props }: CelebrationProps): import("react/jsx-runtime").JSX.Element;
export { Celebration };
export type { CelebrationProps, CelebrationTrigger, CelebrationPlacement };
