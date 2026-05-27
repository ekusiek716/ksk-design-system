type Granularity = "day" | "hour" | "minute" | "second";
interface CountdownTimerProps {
    /** カウントダウン先の日時 */
    targetDate: Date;
    /**
     * 表示粒度（既定 "second"）。
     * - "day"   : 日のみ表示 (結婚式 / 旅行 / 出産予定日まで N 日)。1日1回ペースで再計算。
     * - "hour"  : 時間まで (1分ごとに再計算)
     * - "minute": 分まで (秒ごとに再計算)
     * - "second": 秒まで (旧デフォルト、競技的カウントダウン)
     */
    granularity?: Granularity;
    /** ラベルテキスト（カウント中、既定 "残り"） */
    label?: string;
    /** 終了時テキスト（既定 "受付終了"） */
    endedLabel?: string;
    /** 当日 (残り 0 日) 時のテキスト。granularity="day" で使用（既定 "本日"） */
    todayLabel?: string;
    variant?: "filled" | "ghost";
    /** [hh:mm:ss モードのみ] 時間を非表示にして 分:秒 のみ表示 */
    compact?: boolean;
    className?: string;
    onEnd?: () => void;
    /** 日単位ラベル。granularity="day" で使用。@default "日" */
    dayUnit?: string;
    /** 時間単位ラベル。@default "時間" */
    hourUnit?: string;
    /** 分単位ラベル。@default "分" */
    minuteUnit?: string;
    /** 秒単位ラベル。@default "秒" */
    secondUnit?: string;
}
declare function CountdownTimer({ targetDate, granularity, label, endedLabel, todayLabel, variant, compact, className, onEnd, dayUnit, hourUnit, minuteUnit, secondUnit, }: CountdownTimerProps): import("react/jsx-runtime").JSX.Element;
export { CountdownTimer };
export type { CountdownTimerProps };
