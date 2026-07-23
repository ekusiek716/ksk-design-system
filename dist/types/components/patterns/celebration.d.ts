import * as React from "react";
type CelebrationTrigger = "confetti" | "emoji" | "both" | "none";
type CelebrationPlacement = "overlay" | "inline";
/**
 * confetti の演出モード。
 * - "fall"（既定）: 上から降ってくる既存挙動（後方互換）
 * - "burst": 中央から全方位（360°）に放射状に弾ける party popper（クラッカー）演出
 */
type CelebrationEffect = "fall" | "burst";
interface CelebrationProps extends React.ComponentProps<"div"> {
    active?: boolean;
    trigger?: CelebrationTrigger;
    placement?: CelebrationPlacement;
    /**
     * confetti の演出モード。"fall"（既定・後方互換）または "burst"（クラッカー演出）。
     */
    effect?: CelebrationEffect;
    emoji?: string;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
    interactive?: boolean;
    cardless?: boolean;
    particleCount?: number;
    durationMs?: number;
    /**
     * confetti 1 粒あたりのアニメーション時間（ms）。未指定時は
     * effect="fall" では durationMs（autoDismissMs 優先）から算出される既存挙動を維持し、
     * effect="burst" では 900〜1400ms 程度（seededRatio でばらつき）を既定値とする。
     * 指定時はその値を基準にばらつき（0.78〜1.22倍）をかける。
     */
    duration?: number;
    /**
     * confetti カラーパレット。CSS 変数文字列（"var(--...)"）推奨。
     * 未指定時は既定の DS セマンティックカラー 5 色を使用（後方互換）。
     */
    colors?: string[];
    /**
     * confetti の左右ドリフト幅（px）。粒ごとに ±driftRange/2 の範囲でランダム化。
     * 未指定時は既定の 160px を維持する。
     * effect="burst" では飛距離（120〜280px 基準）のばらつき幅としても再利用する
     * （driftRange が大きいほど burst の飛距離ばらつきが大きくなる）。
     */
    driftRange?: number;
    /**
     * emoji 表示アニメーション。
     * - "pop"（既定）: 既存の celebration-pop と同時にフェード＋スケールインする控えめな挙動
     * - "bounce": emoji のみに弾むイージング（0→1.4→0.9→1 のスケール）を追加で適用
     */
    emojiAnimation?: "pop" | "bounce";
    autoDismissMs?: number;
    onTapDismiss?: () => void;
    onDone?: () => void;
}
export declare function usePrefersReducedMotion(): boolean;
declare function Celebration({ active, trigger, placement, effect, emoji, title, description, actions, interactive, cardless, particleCount, durationMs, duration, colors, driftRange, emojiAnimation, autoDismissMs, onTapDismiss, onDone, className, style, ...props }: CelebrationProps): React.JSX.Element;
export { Celebration };
export type { CelebrationProps, CelebrationTrigger, CelebrationPlacement, CelebrationEffect };
