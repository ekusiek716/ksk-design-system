import React from "react";
import { type ChipProps } from "./Chip";
export interface FilterChipProps extends Omit<ChipProps, "shape" | "variant"> {
    /** 件数バッジ */
    count?: number;
}
/** Chip のフィルタ用プリセット（pill + filled）。 */
export declare function FilterChip(props: FilterChipProps): React.JSX.Element;
