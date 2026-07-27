import { Animated } from "react-native";
export interface EmojiBounceOptions {
    /** バウンスさせる条件（表示中 かつ emojiAnimation === "bounce"） */
    enabled: boolean;
    reduceMotion: boolean;
}
/**
 * belle-todo の milestone-emoji keyframe（0%→0, 50%→1.4, 70%→0.9, 100%→1、
 * 600ms ease-out, 200ms delay）を Animated.sequence で再現する。
 *
 * scale 0 から始まるため、Modal 表示前にアニメーションが走って失われると
 * emoji が不可視のまま残る。完走しなかった場合は最終 scale へ復旧させる（#250）。
 *
 * Celebration / CelebrationDialog の両方から使う。片方だけ直して挙動が
 * 分岐しないよう、ここを唯一の実装とする。
 */
export declare function useEmojiBounce(emojiScale: Animated.Value, { enabled, reduceMotion }: EmojiBounceOptions): void;
