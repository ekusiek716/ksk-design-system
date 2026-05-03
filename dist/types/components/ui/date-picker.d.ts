interface DatePickerProps {
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
     * @default placeholder と同じ値
     */
    triggerLabel?: string;
}
declare function DatePicker({ value, onChange, placeholder, disabled, className, dateFormat, triggerLabel, }: DatePickerProps): import("react/jsx-runtime").JSX.Element;
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
}
declare function DateRangePicker({ value, onChange, placeholder, disabled, className, dateFormat, triggerLabel, }: DateRangePickerProps): import("react/jsx-runtime").JSX.Element;
export { DatePicker, DateRangePicker };
export type { DatePickerProps, DateRangePickerProps };
