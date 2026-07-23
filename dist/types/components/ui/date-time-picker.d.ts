import * as React from "react";
interface DateTimePickerProps extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
    value?: Date;
    onChange?: (value: Date | undefined) => void;
    /** 分の刻み幅。@default 5 */
    minuteStep?: number;
    min?: Date;
    max?: Date;
    disabled?: boolean;
    datePlaceholder?: string;
    timePlaceholder?: string;
    dateTriggerLabel?: string;
    timeTriggerLabel?: string;
}
declare function clampDate(value: Date, min?: Date, max?: Date): Date;
declare function replaceDatePart(current: Date | undefined, selected: Date, min?: Date, max?: Date): Date;
declare function replaceTimePart(current: Date, time: string, min?: Date, max?: Date): Date;
/**
 * 日付と時刻を単一の `Date` として編集する複合入力。
 *
 * `Date` のローカル getter / setter だけを使い、UTC や別タイムゾーンへの
 * 変換は行わない。JST 前提の業務画面など、利用側と保存側のタイムゾーンが
 * 一致する用途向け。
 */
declare function DateTimePicker({ id, value, onChange, minuteStep, min, max, disabled, datePlaceholder, timePlaceholder, dateTriggerLabel, timeTriggerLabel, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...props }: DateTimePickerProps): React.JSX.Element;
export { DateTimePicker, clampDate, replaceDatePart, replaceTimePart };
export type { DateTimePickerProps };
