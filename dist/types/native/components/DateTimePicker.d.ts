import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { type TimePickerProps } from "./TimePicker";
export interface DateTimePickerProps {
    value?: Date;
    onChange?: (value: Date | undefined) => void;
    minuteStep?: TimePickerProps["minuteStep"];
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function DateTimePicker({ value, onChange, minuteStep, minDate, maxDate, disabled, style, }: DateTimePickerProps): React.JSX.Element;
