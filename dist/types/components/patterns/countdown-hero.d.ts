import * as React from "react";
interface CountdownHeroProps {
    /**
     * カウントダウン先の日付。"YYYY-MM-DD" 形式の文字列はローカルタイムの日付として
     * 解釈する（`new Date("YYYY-MM-DD")` は UTC midnight 扱いになり、UTC より西の
     * タイムゾーンで 1 日ずれるため自前でパースする）。それ以外の文字列は `new Date()` に委譲。
     */
    targetDate: Date | string;
    /** 残り日数の上に表示するラベル（既定 "残り"） */
    label?: string;
    /** 当日（残り 0 日）時のラベル（既定 "本日"） */
    todayLabel?: string;
    /** 経過後（残り日数が負）のラベル（既定 "経過"） */
    pastLabel?: string;
    /** 日数の単位テキスト（既定 "days"、装飾セリフ書体で表示） */
    unit?: string;
    /**
     * 数字の下に表示する目標日そのもの（例 "2027.01.03 (日)"）。
     * 曜日・ロケール等のフォーマットは消費側の責務（DS はドメイン非依存を保つ）。
     * 未指定なら日付行を出さない。
     */
    dateLabel?: string;
    /**
     * 当日（残り 0 日）に、数字 "0" の代わりに表示する値（例 "本日"）。
     * 指定時は単位（unit）も表示しない。未指定なら従来どおり "0 <unit>" 表示。
     */
    todayValue?: string;
    /** 右上に敷く装飾イラストスロット。wedding 画像等は消費側で用意する */
    illustration?: React.ReactNode;
    className?: string;
}
/**
 * CountdownHero — 装飾的な serif 数字で目標日までの残日数を表示するヒーロー表示。
 *
 * belle-todo の CountdownSection（src/components/home/CountdownSection.tsx 8-90行）を
 * 参考に、日付編集フォーム・イラスト画像・i18n・zustand は持ち込まず表示専用に再設計。
 * イラストは `illustration` スロットで受け取る（wedding 画像はここに持ち込まない）。
 *
 * serif フォントは DS に `--font-display-serif` トークンが存在しないため、
 * `var(--font-display-serif, Georgia, "Noto Serif JP", serif)` の形で
 * 標準 serif 総称へのフォールバックを明示する。消費側でトークンを定義すれば
 * そのまま差し替わる。
 *
 * 日数計算はローカルタイム基準（`new Date()` の解釈に依存）。
 * 既存の `CountdownTimer`（残日数ピル表示）とは別物で、こちらは装飾ヒーロー表示専用。
 */
declare function CountdownHero({ targetDate, label, todayLabel, pastLabel, unit, dateLabel, todayValue, illustration, className, }: CountdownHeroProps): React.JSX.Element;
export { CountdownHero };
export type { CountdownHeroProps };
