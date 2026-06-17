export interface ChipSelectorOption {
    value: string;
    label: string;
    count?: number;
    disabled?: boolean;
}
export interface ChipSelectorProps {
    options: ChipSelectorOption[];
    values?: string[];
    onChange?: (values: string[]) => void;
    multiple?: boolean;
}
export declare function ChipSelector({ options, values, onChange, multiple, }: ChipSelectorProps): import("react/jsx-runtime").JSX.Element;
