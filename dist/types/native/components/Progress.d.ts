import React from "react";
import { type ProgressAutoColorConfig, type ProgressTone, type ProgressVariant } from "../progress-logic";
export type { ProgressAutoColorConfig, ProgressTone, ProgressVariant };
export interface ProgressProps {
    value: number;
    max?: number;
    height?: number;
    /** @deprecated Use variant instead. Kept for existing RN consumers. */
    tone?: ProgressTone;
    variant?: ProgressVariant;
    autoColor?: boolean | ProgressAutoColorConfig;
    /**
     * true のとき、実 value に依存しない見た目にする（バー幅を固定表示にする）。
     * 未課金ユーザー向けティザー表示等、value からバー幅経由で実データを逆算されるのを防ぐための表示専用フラグ。
     * masked 時は value/max/autoColor を無視し、常に同じ幅・同じトーンで描画する。
     */
    masked?: boolean;
}
export declare function Progress({ value, max, height, tone, variant, autoColor, masked, }: ProgressProps): React.JSX.Element;
