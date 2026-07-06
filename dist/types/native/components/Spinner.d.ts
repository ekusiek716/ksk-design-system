import React from "react";
export type SpinnerSize = "sm" | "md" | "lg";
export interface SpinnerProps {
    size?: SpinnerSize;
    color?: string;
}
export declare function Spinner({ size, color }: SpinnerProps): React.JSX.Element;
