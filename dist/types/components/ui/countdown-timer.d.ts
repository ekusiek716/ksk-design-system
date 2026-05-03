interface CountdownTimerProps {
    /** カウントダウン先の日時 */
    targetDate: Date;
    /** 表示前テキスト（開始前） */
    beforeLabel?: string;
    /** ラベルテキスト（カウント中） */
    label?: string;
    /** 終了時テキスト */
    endedLabel?: string;
    variant?: "filled" | "ghost";
    /** 時間を非表示にして 分:秒 のみ表示 */
    compact?: boolean;
    className?: string;
    onEnd?: () => void;
    /** 時間単位ラベル。i18n 対応: 英語では "h" を渡す。@default "時間" */
    hourUnit?: string;
    /** 分単位ラベル。i18n 対応: 英語では "m" を渡す。@default "分" */
    minuteUnit?: string;
    /** 秒単位ラベル。i18n 対応: 英語では "s" を渡す。@default "秒" */
    secondUnit?: string;
}
declare function CountdownTimer({ targetDate, beforeLabel, label, endedLabel, variant, compact, className, onEnd, hourUnit, minuteUnit, secondUnit, }: CountdownTimerProps): import("react/jsx-runtime").JSX.Element;
export { CountdownTimer };
export type { CountdownTimerProps };
