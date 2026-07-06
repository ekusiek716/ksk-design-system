import * as React from "react";
interface ProgressStepsProps extends React.ComponentProps<"div"> {
    steps: string[];
    currentStep: number;
}
declare function ProgressSteps({ className, steps, currentStep, ...props }: ProgressStepsProps): React.JSX.Element;
export { ProgressSteps };
