import React, { useEffect, useState } from "react"
import { Animated, Easing, Modal, Pressable, Text as RNText, View } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { Celebration, type CelebrationProps } from "./Celebration"
import { useReduceMotion } from "./use-reduce-motion"

function useAnimatedValue(initialValue: number) {
  const [value] = useState(() => new Animated.Value(initialValue))
  return value
}

export interface CelebrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** バッジに表示するアイコン。指定時は emoji より優先される（web 版と同じスロット設計） */
  icon?: React.ReactNode
  emoji?: string
  title: string
  description?: string
  actions?: React.ReactNode
  autoDismissMs?: number
  emojiAnimation?: CelebrationProps["emojiAnimation"]
  particleCount?: CelebrationProps["particleCount"]
  duration?: CelebrationProps["duration"]
  colors?: CelebrationProps["colors"]
  driftRange?: CelebrationProps["driftRange"]
  testID?: string
}

/**
 * CelebrationDialog（native） — Modal + Celebration confetti + emoji/title/description/actions。
 * web 版と同じスロット設計。belle-todo の MilestoneCelebration 相当の業務ロジック
 * （MILESTONES/アップセル/store/analytics）は持ち込まない。
 */
export function CelebrationDialog({
  open,
  onOpenChange,
  icon,
  emoji,
  title,
  description,
  actions,
  autoDismissMs,
  emojiAnimation = "pop",
  particleCount,
  duration,
  colors,
  driftRange,
  testID,
}: CelebrationDialogProps) {
  const { theme, scales } = useTheme()
  const reduceMotion = useReduceMotion()
  const emojiScale = useAnimatedValue(0)

  useEffect(() => {
    if (!open || !autoDismissMs) return
    const id = setTimeout(() => onOpenChange(false), autoDismissMs)
    return () => clearTimeout(id)
  }, [open, autoDismissMs, onOpenChange])

  useEffect(() => {
    if (!open || emojiAnimation !== "bounce") return
    if (reduceMotion) {
      // Reduce Motion 有効時はバウンスさせず最終スケールで静止表示する
      // （初期値 0 のまま return すると絵文字が不可視になる）
      emojiScale.setValue(1)
      return
    }
    emojiScale.setValue(0)
    const animation = Animated.sequence([
      Animated.delay(200),
      Animated.timing(emojiScale, { toValue: 1.4, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(emojiScale, { toValue: 0.9, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(emojiScale, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ])
    animation.start()
    return () => animation.stop()
  }, [open, emojiAnimation, emojiScale, reduceMotion])

  if (!open) return null

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => onOpenChange(false)}>
      <Pressable
        testID={testID}
        onPress={() => onOpenChange(false)}
        style={{
          flex: 1,
          backgroundColor: theme.overlay.dark,
          alignItems: "center",
          justifyContent: "center",
          padding: scales.spacing.scale[4],
        }}
      >
        <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
          <Celebration
            active
            trigger="confetti"
            placement="overlay"
            cardless
            particleCount={particleCount}
            duration={duration}
            colors={colors}
            driftRange={driftRange}
          />
        </View>
        <Pressable
          onPress={() => {}}
          style={{
            width: "100%",
            maxWidth: 360,
            alignItems: "center",
            backgroundColor: theme.surface.primary,
            borderRadius: scales.borderRadius["2xl"],
            paddingHorizontal: scales.spacing.scale[6],
            paddingVertical: scales.spacing.scale[5],
          }}
        >
          {(icon || emoji) && (
            // アイコン/絵文字は素置きせず、ブランド連動のソフトな円形バッジ + 外側の淡い光輪に載せる
            //（web 版 CelebrationDialog と同じ見た目。bounce はバッジ内のグリフのみに適用）
            <View
              style={{
                width: 80,
                height: 80,
                marginBottom: scales.spacing.scale[4],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: -12,
                  left: -12,
                  right: -12,
                  bottom: -12,
                  borderRadius: 999,
                  backgroundColor: theme.surface["accent-primary-subtle"],
                  opacity: 0.5,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 999,
                  backgroundColor: theme.surface["accent-primary-light"],
                  borderWidth: 1,
                  borderColor: theme.surface["accent-primary-subtle"],
                }}
              />
              {icon ? (
                <Animated.View
                  style={emojiAnimation === "bounce" ? { transform: [{ scale: emojiScale }] } : undefined}
                >
                  {icon}
                </Animated.View>
              ) : (
                <Animated.Text
                  style={[
                    resolveTypo("display.lg"),
                    emojiAnimation === "bounce" ? { transform: [{ scale: emojiScale }] } : null,
                  ]}
                >
                  {emoji}
                </Animated.Text>
              )}
            </View>
          )}
          <RNText
            style={[
              resolveTypo("heading.xl"),
              { color: theme.text["high-emphasis"], textAlign: "center" },
            ]}
          >
            {title}
          </RNText>
          {description && (
            <RNText
              style={[
                resolveTypo("body.sm"),
                {
                  color: theme.text["medium-emphasis"],
                  marginTop: scales.spacing.scale[1],
                  textAlign: "center",
                },
              ]}
            >
              {description}
            </RNText>
          )}
          {actions && (
            <View style={{ marginTop: scales.spacing.scale[4], width: "100%" }}>{actions}</View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}
