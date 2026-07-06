import * as React from "react";
export interface TimePickerProps {
    /** "HH:mm" 形式の値。例: "09:30" */
    value?: string;
    onChange?: (time: string) => void;
    placeholder?: string;
    disabled?: boolean;
    /** 分の刻み幅。@default 1 */
    minuteStep?: number;
    className?: string;
    /** トリガーボタンの aria-label。@default placeholder */
    triggerLabel?: string;
}
declare function TimePicker({ value, onChange, placeholder, disabled, minuteStep, className, triggerLabel, }: TimePickerProps): React.JSX.Element;
export { TimePicker };
