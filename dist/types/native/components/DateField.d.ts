import React from "react";
export interface DateFieldProps {
    /** "YYYY-MM-DD" 形式の ISO 日付文字列。未選択は "" */
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    /** DatePicker に渡す表示フォーマッタ（trigger の表示のみ。value/onChange は常に ISO 文字列） */
    formatter?: (d: Date) => string;
}
/**
 * DateField — native DatePicker（Date オブジェクト API）を
 * "YYYY-MM-DD" ISO 文字列 API でラップする adapter。web 版と同じ変換ロジック。
 */
export declare function DateField({ value, onChange, placeholder, disabled, formatter }: DateFieldProps): React.JSX.Element;
