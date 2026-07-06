import React from "react";
export interface SeparatorProps {
    orientation?: "horizontal" | "vertical";
    emphasis?: "low" | "medium";
}
export declare function Separator({ orientation, emphasis }: SeparatorProps): React.JSX.Element;
