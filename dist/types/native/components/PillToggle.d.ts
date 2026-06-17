export interface PillToggleOption {
    value: string;
    label: string;
    count?: number;
}
export interface PillToggleProps {
    options: PillToggleOption[];
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}
export declare function PillToggle({ options, value, onChange, disabled }: PillToggleProps): import("react/jsx-runtime").JSX.Element;
