export interface CoachMarkProps {
    title?: string;
    description: string;
    step?: number;
    total?: number;
    onNext?: () => void;
    onSkip?: () => void;
    nextLabel?: string;
    skipLabel?: string;
}
/**
 * Tooltip 風の説明バルーン（Radix Popover の TourGuide パターン参考）。
 * CoachMarkOverlay と組み合わせて使う前提。
 * - ステップは dot indicator（1/3 等の表記より視覚的）
 * - アクションは小さめの pill ボタンを内製（DS Button は CTA 用で大きすぎるため）
 */
export declare function CoachMark({ title, description, step, total, onNext, onSkip, nextLabel, skipLabel, }: CoachMarkProps): import("react/jsx-runtime").JSX.Element;
