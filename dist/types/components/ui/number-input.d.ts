import * as React from "react";
interface NumberInputProps {
    value?: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    /** 数値フォーマッタ（例: 通貨表示） */
    format?: (value: number) => string;
    placeholder?: string;
    disabled?: boolean;
    size?: "sm" | "md";
    className?: string;
    /** 減算ボタンの aria-label。i18n 対応: 英語では "Decrease" を渡す。@default "減らす" */
    decrementLabel?: string;
    /** 加算ボタンの aria-label。i18n 対応: 英語では "Increase" を渡す。@default "増やす" */
    incrementLabel?: string;
}
declare function NumberInput({ value, onChange, min, max, step, format, placeholder, disabled, size, className, decrementLabel, incrementLabel, }: NumberInputProps): React.JSX.Element;
export { NumberInput };
export type { NumberInputProps };
