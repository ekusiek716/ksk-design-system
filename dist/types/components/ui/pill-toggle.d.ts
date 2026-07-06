import * as React from "react";
interface PillToggleOption<T extends string = string> {
    label: string;
    value: T;
    icon?: React.ReactNode;
}
interface PillToggleProps<T extends string = string> {
    options: PillToggleOption<T>[];
    value: T;
    onChange: (value: T) => void;
    size?: "sm" | "md";
    className?: string;
}
declare function PillToggle<T extends string = string>({ options, value, onChange, size, className, }: PillToggleProps<T>): React.JSX.Element;
export { PillToggle };
export type { PillToggleProps, PillToggleOption };
