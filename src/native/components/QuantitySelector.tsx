import React from "react"
import { NumberInput, type NumberInputProps } from "./NumberInput"

export interface QuantitySelectorProps extends Omit<NumberInputProps, "min"> {
  min?: number
}

/** commerce 用の数量セレクタ。NumberInput を min=1 で使うだけ。 */
export function QuantitySelector({ min = 1, ...rest }: QuantitySelectorProps) {
  return <NumberInput min={min} {...rest} />
}
