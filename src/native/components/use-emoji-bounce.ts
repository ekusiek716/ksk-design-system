import { useEffect } from "react"
import { Animated, Easing } from "react-native"
import { startAnimationWithFallback } from "../modal-reveal-lifecycle"

/** emoji bounce の総尺（200ms delay + 300 + 120 + 180）＋余裕 */
const EMOJI_BOUNCE_FALLBACK_DELAY = 800 + 200

export interface EmojiBounceOptions {
  /** バウンスさせる条件（表示中 かつ emojiAnimation === "bounce"） */
  enabled: boolean
  reduceMotion: boolean
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
export function useEmojiBounce(
  emojiScale: Animated.Value,
  { enabled, reduceMotion }: EmojiBounceOptions,
) {
  useEffect(() => {
    if (!enabled) return
    if (reduceMotion) {
      // Reduce Motion 有効時はバウンスさせず最終スケールで静止表示する
      // （初期値 0 のまま return すると絵文字が不可視になる）
      emojiScale.setValue(1)
      return
    }
    emojiScale.setValue(0)
    const animation = Animated.sequence([
      Animated.delay(200),
      Animated.timing(emojiScale, {
        toValue: 1.4,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(emojiScale, {
        toValue: 0.9,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(emojiScale, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ])
    const cancelFallback = startAnimationWithFallback(
      EMOJI_BOUNCE_FALLBACK_DELAY,
      (complete) => animation.start(({ finished }) => complete(finished)),
      () => emojiScale.setValue(1),
    )
    return () => {
      cancelFallback()
      animation.stop()
    }
  }, [enabled, reduceMotion, emojiScale])
}
