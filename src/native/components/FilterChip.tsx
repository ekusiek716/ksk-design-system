import React from "react"
import { Chip, type ChipProps } from "./Chip"

export interface FilterChipProps extends Omit<ChipProps, "shape" | "variant"> {
  /** 件数バッジ */
  count?: number
}

/** Chip のフィルタ用プリセット（pill + filled）。 */
export function FilterChip(props: FilterChipProps) {
  return <Chip {...props} shape="pill" variant="filled" />
}
