export interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date) => void;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    formatter?: (d: Date) => string;
}
export declare function DatePicker({ value, onChange, placeholder, minDate, maxDate, disabled, formatter, }: DatePickerProps): import("react/jsx-runtime").JSX.Element;
