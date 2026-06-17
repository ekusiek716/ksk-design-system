import { type NumberInputProps } from "./NumberInput";
export interface QuantitySelectorProps extends Omit<NumberInputProps, "min"> {
    min?: number;
}
/** commerce 用の数量セレクタ。NumberInput を min=1 で使うだけ。 */
export declare function QuantitySelector({ min, ...rest }: QuantitySelectorProps): import("react/jsx-runtime").JSX.Element;
