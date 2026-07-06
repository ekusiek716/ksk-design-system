import React from "react";
export type ProgressVariant = "default" | "success" | "warning" | "caution";
export type ProgressTone = "accent" | "success" | "caution" | "warning";
export interface ProgressAutoColorConfig {
    successBelow?: number;
    warningFrom?: number;
    warningBelow?: number;
    cautionFrom?: number;
}
export interface ProgressProps {
    value: number;
    max?: number;
    height?: number;
    /** @deprecated Use variant instead. Kept for existing RN consumers. */
    tone?: ProgressTone;
    variant?: ProgressVariant;
    autoColor?: boolean | ProgressAutoColorConfig;
}
export declare function Progress({ value, max, height, tone, variant, autoColor, }: ProgressProps): React.JSX.Element;
