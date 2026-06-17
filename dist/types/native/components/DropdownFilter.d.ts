export interface DropdownFilterOption {
    value: string;
    label: string;
    count?: number;
}
export interface DropdownFilterProps {
    label: string;
    options: DropdownFilterOption[];
    value?: string;
    onChange?: (value: string | undefined) => void;
}
export declare function DropdownFilter({ label, options, value, onChange }: DropdownFilterProps): import("react/jsx-runtime").JSX.Element;
