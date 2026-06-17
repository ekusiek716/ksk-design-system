export interface StepItem {
    key: string;
    label: string;
}
export interface ProgressStepsProps {
    steps: StepItem[];
    current: number;
}
export declare function ProgressSteps({ steps, current }: ProgressStepsProps): import("react/jsx-runtime").JSX.Element;
