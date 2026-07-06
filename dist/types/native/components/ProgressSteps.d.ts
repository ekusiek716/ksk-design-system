import React from "react";
export interface StepItem {
    key: string;
    label: string;
}
export interface ProgressStepsProps {
    steps: StepItem[];
    current: number;
}
export declare function ProgressSteps({ steps, current }: ProgressStepsProps): React.JSX.Element;
