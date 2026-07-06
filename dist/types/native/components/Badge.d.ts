import React from "react";
export type BadgeTone = "neutral" | "accent" | "success" | "caution" | "warning" | "info";
export interface BadgeProps {
    tone?: BadgeTone;
    children: React.ReactNode;
}
/** status / accent を surface + text トークンで塗り分けるピル。 */
export declare function Badge({ tone, children }: BadgeProps): React.JSX.Element;
