export interface TimeValue {
    hour: number;
    minute: number;
}
export interface TimePickerProps {
    value?: TimeValue;
    onChange?: (time: TimeValue) => void;
    placeholder?: string;
    minuteStep?: 1 | 5 | 10 | 15 | 30;
    disabled?: boolean;
}
export declare function TimePicker({ value, onChange, placeholder, minuteStep, disabled, }: TimePickerProps): import("react/jsx-runtime").JSX.Element;
