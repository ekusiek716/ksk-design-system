export type ProgressVariant = "default" | "success" | "warning" | "caution";
export type ProgressTone = "accent" | "success" | "caution" | "warning";
export interface ProgressAutoColorConfig {
    successBelow?: number;
    warningFrom?: number;
    warningBelow?: number;
    cautionFrom?: number;
}
/** masked=true のときに使う固定表示の割合（%）。value に一切依存しない。 */
export declare const MASKED_PROGRESS_PCT = 45;
/**
 * 描画に使う実効パーセンテージを決める純粋関数。
 * masked=true のときは value/max を一切見ず常に同じ値を返す（逆算防止の要件そのもの）。
 */
export declare function resolveProgressPct(value: number, max: number, masked: boolean | undefined): number;
export declare function toneToVariant(tone: ProgressTone): ProgressVariant;
export declare function getAutoProgressVariant(value: number, fallback: ProgressVariant, autoColor: boolean | ProgressAutoColorConfig | undefined): ProgressVariant;
/**
 * masked 時に実際に描画へ使う variant を決める純粋関数。
 * masked=true のときは autoColor による value 依存の色分岐を無視する
 * （バー幅だけでなく色からの逆算も防ぐのが要件）。
 */
export declare function resolveProgressVariant(pct: number, tone: ProgressTone, variant: ProgressVariant | undefined, autoColor: boolean | ProgressAutoColorConfig | undefined, masked: boolean | undefined): ProgressVariant;
