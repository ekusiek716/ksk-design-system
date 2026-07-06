import React from "react";
import { type CelebrationProps } from "./Celebration";
export interface CelebrationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** バッジに表示するアイコン。指定時は emoji より優先される（web 版と同じスロット設計） */
    icon?: React.ReactNode;
    emoji?: string;
    title: string;
    description?: string;
    actions?: React.ReactNode;
    autoDismissMs?: number;
    emojiAnimation?: CelebrationProps["emojiAnimation"];
    /**
     * Celebration confetti の演出モード。既定は "burst"
     * （達成演出はクラッカーが弾けた感じを標準とする。web 版と同じ）。
     */
    effect?: CelebrationProps["effect"];
    particleCount?: CelebrationProps["particleCount"];
    duration?: CelebrationProps["duration"];
    colors?: CelebrationProps["colors"];
    driftRange?: CelebrationProps["driftRange"];
    testID?: string;
}
/**
 * CelebrationDialog（native） — Modal + Celebration confetti + emoji/title/description/actions。
 * web 版と同じスロット設計。belle-todo の MilestoneCelebration 相当の業務ロジック
 * （MILESTONES/アップセル/store/analytics）は持ち込まない。
 */
export declare function CelebrationDialog({ open, onOpenChange, icon, emoji, title, description, actions, autoDismissMs, emojiAnimation, effect, particleCount, duration, colors, driftRange, testID, }: CelebrationDialogProps): React.JSX.Element;
