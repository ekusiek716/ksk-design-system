import React from "react";
export interface SliderProps {
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}
export declare function Slider({ value, onChange, min, max, step, disabled, }: SliderProps): React.JSX.Element;
