export interface CheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    size?: number;
}
export declare function Checkbox({ checked, onChange, disabled, size }: CheckboxProps): import("react/jsx-runtime").JSX.Element;
