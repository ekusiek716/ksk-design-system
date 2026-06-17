export interface ProgressProps {
    value: number;
    max?: number;
    height?: number;
    tone?: "accent" | "success" | "caution" | "warning";
}
export declare function Progress({ value, max, height, tone }: ProgressProps): import("react/jsx-runtime").JSX.Element;
