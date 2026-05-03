import * as React from "react";
declare const SIZE_MAP: {
    sm: {
        size: number;
        stroke: number;
    };
    md: {
        size: number;
        stroke: number;
    };
    lg: {
        size: number;
        stroke: number;
    };
    xl: {
        size: number;
        stroke: number;
    };
};
interface ProgressRingProps {
    /** 0〜100 */
    value: number;
    size?: keyof typeof SIZE_MAP;
    /** 中央テキスト（省略時は % 表示） */
    label?: React.ReactNode;
    showLabel?: boolean;
    className?: string;
}
declare function ProgressRing({ value, size, label, showLabel, className, }: ProgressRingProps): import("react/jsx-runtime").JSX.Element;
export { ProgressRing };
export type { ProgressRingProps };
