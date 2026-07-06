import * as React from "react";
import type { CelebrationProps } from "./celebration";
interface CelebrationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /**
     * ダイアログ上部のバッジに表示するアイコン。iconsax の Bulk variant 推奨
     * （例: `<MedalStar size={40} variant="Bulk" color="var(--Brand-Primary)" />`）。
     * 指定時は emoji より優先される。
     */
    icon?: React.ReactNode;
    /** ダイアログ上部のバッジに表示する絵文字。icon 未指定時のみ使用。省略時はバッジ非表示 */
    emoji?: string;
    title: string;
    description?: string;
    /** CTA スロット。ボタン群などを渡す */
    actions?: React.ReactNode;
    /** 指定時、この ms 経過後に自動で onOpenChange(false) を呼ぶ */
    autoDismissMs?: number;
    /** Celebration の emoji 表示アニメーション（既定 "pop"） */
    emojiAnimation?: CelebrationProps["emojiAnimation"];
    /**
     * Celebration confetti の演出モード。既定は "burst"
     * （達成演出はクラッカーが弾けた感じを標準とする）。
     */
    effect?: CelebrationProps["effect"];
    /** Celebration confetti のパススルー props */
    particleCount?: CelebrationProps["particleCount"];
    duration?: CelebrationProps["duration"];
    colors?: CelebrationProps["colors"];
    driftRange?: CelebrationProps["driftRange"];
    className?: string;
}
/**
 * CelebrationDialog — 達成演出用の Dialog + Celebration confetti + emoji 合成パターン。
 *
 * belle-todo の MilestoneCelebration（src/components/home/MilestoneCelebration.tsx）を
 * 参考に、MILESTONES 定義・アップセル CTA・zustand・i18n・analytics は一切持ち込まず、
 * emoji/title/description/actions をスロット化した汎用コンポーネントとして再設計。
 *
 * - DS の Dialog（Radix ベース、Esc/overlay クリックで閉じる）を土台にする。
 * - 背面に Celebration（trigger="confetti", cardless）を全画面オーバーレイとして重ね、
 *   Dialog 本体には emoji/title/description/actions のみを表示する
 *   （Celebration 側のカード演出とは重複させず、Dialog の見た目に統一する）。
 * - autoDismissMs 指定時は経過後に onOpenChange(false) を呼ぶ。
 */
declare function CelebrationDialog({ open, onOpenChange, icon, emoji, title, description, actions, autoDismissMs, emojiAnimation, effect, particleCount, duration, colors, driftRange, className, }: CelebrationDialogProps): React.JSX.Element;
export { CelebrationDialog };
export type { CelebrationDialogProps };
