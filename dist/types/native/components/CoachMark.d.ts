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
/** Tooltip 風の説明バルーン。CoachMarkOverlay と組み合わせて使う前提。 */
export declare function CoachMark({ title, description, step, total, onNext, onSkip, nextLabel, skipLabel, }: CoachMarkProps): import("react/jsx-runtime").JSX.Element;
