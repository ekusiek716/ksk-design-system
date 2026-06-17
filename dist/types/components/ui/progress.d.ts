import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
type ProgressVariant = "default" | "success" | "warning" | "caution";
type ProgressDuration = "none" | "sm" | "md" | "lg";
export interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
    /**
     * 色バリアント。値の閾値に応じて呼び出し側で切り替える想定 (例: 100% 超で caution)。
     * @default "default"
     */
    variant?: ProgressVariant;
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
declare function Progress({ className, value, variant, transitionDuration, ...props }: ProgressProps): import("react/jsx-runtime").JSX.Element;
export { Progress };
