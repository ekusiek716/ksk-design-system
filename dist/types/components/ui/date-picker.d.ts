import * as React from "react";
interface DatePickerProps {
    id?: string;
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    /**
     * トリガーボタンのプレースホルダーテキスト。
     * i18n 対応: 英語では "Select date"、日本語では "日付を選択" を渡す。
     * @default "日付を選択"
     */
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    dateFormat?: string;
    /**
     * トリガーボタンのアクセシビリティラベル。
     * カレンダーポップアップを開くボタンの読み上げテキスト。
     * 未指定時は選択済みの日付、未選択なら placeholder が読み上げられる。
     */
    triggerLabel?: string;
    /**
     * ポップアップを開いたときに最初に表示する月。
     * 未指定なら選択値（value）の月、value も無ければ今月を表示する。
     * 優先順: defaultMonth > value > 今月。
     */
    defaultMonth?: Date;
    /** 選択可能な最小日時。Calendar では日単位で判定する。 */
    min?: Date;
    /** 選択可能な最大日時。Calendar では日単位で判定する。 */
    max?: Date;
    "aria-describedby"?: string;
    "aria-invalid"?: React.AriaAttributes["aria-invalid"];
}
declare function DatePicker({ id, value, onChange, placeholder, disabled, className, dateFormat, triggerLabel, defaultMonth, min, max, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, }: DatePickerProps): React.JSX.Element;
interface DateRangePickerProps {
    value?: {
        from?: Date;
        to?: Date;
    };
    onChange?: (range: {
        from?: Date;
        to?: Date;
    } | undefined) => void;
    /**
     * トリガーボタンのプレースホルダーテキスト。
     * @default "期間を選択"
     */
    placeholder?: string;
    /**
     * 開始日フィールドのプレースホルダー（分割レイアウト用）。
     * @default "開始日"
     */
    fromPlaceholder?: string;
    /**
     * 終了日フィールドのプレースホルダー（分割レイアウト用）。
     * @default "終了日"
     */
    toPlaceholder?: string;
    disabled?: boolean;
    className?: string;
    dateFormat?: string;
    /** アクセシビリティラベル */
    triggerLabel?: string;
    /**
     * ポップアップを開いたときに最初に表示する月。
     * 未指定なら開始日（value.from）の月、それも無ければ今月を表示する。
     * 優先順: defaultMonth > value.from > 今月。
     */
    defaultMonth?: Date;
}
declare function DateRangePicker({ value, onChange, placeholder, disabled, className, dateFormat, triggerLabel, defaultMonth, }: DateRangePickerProps): React.JSX.Element;
export { DatePicker, DateRangePicker };
export type { DatePickerProps, DateRangePickerProps };
