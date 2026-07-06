import * as React from "react";
/** "YYYY-MM-DD" → Date（ローカル midnight）。空文字・不正値は undefined。 */
declare function strToDate(s: string): Date | undefined;
/** Date → "YYYY-MM-DD"（ローカル）。 */
declare function dateToStr(d: Date | undefined): string;
interface DateFieldProps {
    /** "YYYY-MM-DD" 形式の ISO 日付文字列。未選択は "" */
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    /** DatePicker に渡す表示フォーマット（trigger の表示のみ。value/onChange は常に ISO 文字列） */
    dateFormat?: string;
}
/**
 * DateField — DS の DatePicker（Date オブジェクト API）を
 * "YYYY-MM-DD" ISO 文字列 API でラップする adapter。
 *
 * バックエンド/store が ISO date 文字列で日付を保持するケース向け。
 * strToDate/dateToStr は `new Date(y, m-1, d)` のローカルタイム方式で
 * UTC 変換を経由しないため、日付が前後にずれない。
 */
declare function DateField({ value, onChange, placeholder, disabled, className, dateFormat }: DateFieldProps): React.JSX.Element;
export { DateField, strToDate, dateToStr };
export type { DateFieldProps };
