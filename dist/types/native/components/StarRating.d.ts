import React from "react";
export interface StarRatingProps {
    value: number;
    max?: number;
    size?: number;
    onChange?: (value: number) => void;
    readOnly?: boolean;
}
/** ★を文字で描画する簡易実装。半端値は0.5刻みで切り捨て。 */
export declare function StarRating({ value, max, size, onChange, readOnly }: StarRatingProps): React.JSX.Element;
