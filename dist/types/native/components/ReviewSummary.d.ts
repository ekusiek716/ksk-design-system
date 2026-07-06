import React from "react";
export interface ReviewSummaryProps {
    average: number;
    total: number;
    /** rating -> 件数 のマップ。例: { 5: 120, 4: 32, 3: 11, 2: 4, 1: 2 } */
    distribution: Record<number, number>;
}
export declare function ReviewSummary({ average, total, distribution }: ReviewSummaryProps): React.JSX.Element;
