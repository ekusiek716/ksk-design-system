import * as React from "react";
type CoachMarkPlacement = "top" | "bottom" | "left" | "right";
type CoachMarkVariant = "default" | "brand";
interface CoachMarkProps {
    /** バルーンに表示するコンテンツ */
    content: React.ReactNode;
    children: React.ReactNode;
    placement?: CoachMarkPlacement;
    variant?: CoachMarkVariant;
    /** 制御モード: open を外から制御 */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** ステップ番号（オンボーディング用） */
    step?: number;
    /** 合計ステップ数 */
    totalSteps?: number;
    /** 次へボタンクリック */
    onNext?: () => void;
    /** 閉じるボタン表示 */
    showClose?: boolean;
    onClose?: () => void;
    delayDuration?: number;
    className?: string;
}
declare function CoachMark({ content, children, placement, variant, open, onOpenChange, step, totalSteps, onNext, showClose, onClose, delayDuration, className, }: CoachMarkProps): import("react/jsx-runtime").JSX.Element;
export { CoachMark };
export type { CoachMarkProps, CoachMarkPlacement, CoachMarkVariant };
