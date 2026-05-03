import * as React from "react";
interface ChipSelectorOption<T extends string = string> {
    label: string;
    value: T;
    icon?: React.ReactNode;
}
interface ChipSelectorProps<T extends string = string> {
    options: ChipSelectorOption<T>[];
    value: T[];
    onChange: (value: T[]) => void;
    /** true: 複数選択可 / false: 1つのみ */
    multiple?: boolean;
    /** 最大選択数（multiple=true 時のみ有効） */
    max?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
}
declare function ChipSelector<T extends string = string>({ options, value, onChange, multiple, max, size, className, }: ChipSelectorProps<T>): import("react/jsx-runtime").JSX.Element;
export { ChipSelector };
export type { ChipSelectorProps, ChipSelectorOption };
