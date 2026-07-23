import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
type ProgressVariant = "default" | "success" | "warning" | "caution";
type ProgressDuration = "none" | "sm" | "md" | "lg";
interface ProgressAutoColorConfig {
    /** value がこの値未満なら success。未指定なら success 自動判定なし。 */
    successBelow?: number;
    /** value がこの値以上なら warning。@default 80 */
    warningFrom?: number;
    /** value がこの値未満なら warning。warningFrom より細かい範囲指定が必要な時に使用。 */
    warningBelow?: number;
    /** value がこの値以上なら caution。@default 100 */
    cautionFrom?: number;
}
/**
 * 描画に使う実効値を決める純粋関数。
 * masked=true のときは value を一切見ず常に同じ値を返す（バー幅からの逆算防止）。
 */
export declare function resolveProgressDisplayValue(value: number | null | undefined, masked: boolean | undefined): number;
export interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
    /**
     * 色バリアント。autoColor=false の時はこの値がそのまま使われる。
     * @default "default"
     */
    variant?: ProgressVariant;
    /**
     * 値に応じて success / warning / caution を自動切替。
     * true の既定閾値: 80 以上 warning、100 以上 caution。
     * 個別指定例: { successBelow: 80, warningBelow: 100, cautionFrom: 100 }
     */
    autoColor?: boolean | ProgressAutoColorConfig;
    /**
     * indicator のトランジション時間プリセット。
     * - "none" : アニメーション無効
     * - "sm" (150ms) : 既定値、Tailwind デフォルトと同等
     * - "md" (300ms) : 緩やか
     * - "lg" (500ms) : 大幅変化向け (達成カードなど)
     * @default "sm"
     */
    transitionDuration?: ProgressDuration;
    /** 進捗値（0〜100）。Radix v2 系で `React.ComponentProps` 経由だと型に出てこないため明示。 */
    value?: number | null;
    className?: string;
    id?: string;
    /**
     * true のとき、実 value に依存しない見た目にする（バー幅を固定表示にする）。
     * 未課金ユーザー向けティザー表示等、value からバー幅経由で実データを逆算されるのを防ぐための表示専用フラグ。
     * masked 時は value/autoColor を無視し、常に同じ幅・同じトーンで描画する。
     */
    masked?: boolean;
}
/**
 * Progress — 進捗バー。
 *
 * - value: 0-100
 * - variant: 色バリアント (default/success/warning/caution)
 * - transitionDuration: アニメ速度 (none/sm/md/lg)
 *
 * @example
 * <Progress value={42} />
 * <Progress value={120} variant="caution" />              // 予算超過
 * <Progress value={progress} transitionDuration="lg" />   // ホームの達成バー
 */
declare function Progress({ className, value, variant, autoColor, transitionDuration, masked, ...props }: ProgressProps): React.JSX.Element;
export { Progress };
export type { ProgressAutoColorConfig, ProgressDuration, ProgressVariant };
