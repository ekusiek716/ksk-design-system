export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface SelectProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    title?: string;
}
export declare function Select({ options, value, onChange, placeholder, disabled, title, }: SelectProps): import("react/jsx-runtime").JSX.Element;
