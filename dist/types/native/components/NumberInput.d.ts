export interface NumberInputProps {
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}
export declare function NumberInput({ value, onChange, min, max, step, disabled, }: NumberInputProps): import("react/jsx-runtime").JSX.Element;
