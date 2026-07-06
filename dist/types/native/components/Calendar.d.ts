import React from "react";
export interface CalendarProps {
    value?: Date;
    onChange?: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    locale?: "ja" | "en";
}
export declare function Calendar({ value, onChange, minDate, maxDate, locale }: CalendarProps): React.JSX.Element;
