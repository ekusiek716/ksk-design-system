import * as React from "react";
export interface TimePickerProps {
    id?: string;
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
    "aria-describedby"?: string;
    "aria-invalid"?: React.AriaAttributes["aria-invalid"];
}
declare function TimePicker({ id, value, onChange, placeholder, disabled, minuteStep, className, triggerLabel, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, }: TimePickerProps): React.JSX.Element;
export { TimePicker };
