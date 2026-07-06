import React from "react";
export interface ProgressRingProps {
    value: number;
    max?: number;
    size?: number;
    thickness?: number;
    showLabel?: boolean;
}
/**
 * SVG非依存の簡易ProgressRing。
 * 半円を2枚使った clip 風表現で React Native のViewのみで完結させる。
 */
export declare function ProgressRing({ value, max, size, thickness, showLabel, }: ProgressRingProps): React.JSX.Element;
