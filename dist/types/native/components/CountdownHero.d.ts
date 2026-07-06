import React from "react";
import { type ViewStyle } from "react-native";
export interface CountdownHeroProps {
    targetDate: Date | string;
    label?: string;
    todayLabel?: string;
    pastLabel?: string;
    unit?: string;
    illustration?: React.ReactNode;
    style?: ViewStyle;
    testID?: string;
}
/**
 * CountdownHero（native） — 装飾的な巨大数字で目標日までの残日数を表示する。
 * web 版と同じロジック（ローカルタイム基準の日数計算）。RN には CSS var / serif
 * フォントフォールバック機構が無いため、フォントは OS 標準の serif ファミリー名
 * （iOS: "Georgia" / Android: "serif"）を Platform 分岐せず単純に "serif" 指定し、
 * 消費側で theme.typography 拡張時に差し替えられるようにする。
 */
export declare function CountdownHero({ targetDate, label, todayLabel, pastLabel, unit, illustration, style, testID, }: CountdownHeroProps): React.JSX.Element;
