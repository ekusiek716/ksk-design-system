import React, { useEffect, useMemo, useState } from "react"
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  Text as RNText,
  View,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import { useReduceMotion } from "./use-reduce-motion"

export type CelebrationTrigger = "confetti" | "emoji" | "both" | "none"
export type CelebrationPlacement = "overlay" | "inline"

export interface CelebrationProps {
  active?: boolean
  trigger?: CelebrationTrigger
  placement?: CelebrationPlacement
  emoji?: string
  title?: string
  description?: string
  actions?: React.ReactNode
  interactive?: boolean
  cardless?: boolean
  particleCount?: number
  durationMs?: number
  /**
   * confetti 1 粒あたりの落下アニメーション時間（ms）。未指定時は
   * durationMs（autoDismissMs 優先）から算出される既存挙動を維持する。
   */
  duration?: number
  /**
   * confetti カラーパレット。テーマの色トークン名（"brand"/"success"/"warning"/
   * "caution"/"info"）または任意の色文字列（#hex 等）を指定可能。
   * 未指定時は既定の 5 色を使用（後方互換）。
   */
  colors?: string[]
  /**
   * confetti の左右ドリフト幅（px）。粒ごとに ±driftRange/2 の範囲でランダム化。
   * 未指定時は既定の 160px を維持する。
   */
  driftRange?: number
  /**
   * emoji 表示アニメーション。
   * - "pop"（既定）: 既存のフェード＋スケールイン（opacity/pop の Animated.spring）のみ
   * - "bounce": emoji のみに弾むイージング（0→1.4→0.9→1 のスケール）を追加で適用
   */
  emojiAnimation?: "pop" | "bounce"
  autoDismissMs?: number
  onTapDismiss?: () => void
  onDone?: () => void
  style?: ViewStyle
  cardStyle?: ViewStyle
  testID?: string
}

const CONFETTI_COLORS = [
  "brand",
  "success",
  "warning",
  "caution",
  "info",
] as const

const CONFETTI_TOKEN_NAMES: readonly string[] = CONFETTI_COLORS

function seededRatio(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

function useAnimatedValue(initialValue: number) {
  const [value] = useState(() => new Animated.Value(initialValue))
  return value
}

function Celebration({
  active = true,
  trigger = "confetti",
  placement = "overlay",
  emoji = "🎉",
  title,
  description,
  actions,
  interactive = false,
  cardless = false,
  particleCount = 36,
  durationMs = 2600,
  duration,
  colors,
  driftRange = 160,
  emojiAnimation = "pop",
  autoDismissMs,
  onTapDismiss,
  onDone,
  style,
  cardStyle,
  testID,
}: CelebrationProps) {
  const { theme, scales } = useTheme()
  const reduceMotion = useReduceMotion()
  const resolvedDurationMs = autoDismissMs ?? durationMs
  const particleDurationBase = duration ?? resolvedDurationMs
  const palette = colors && colors.length > 0 ? colors : CONFETTI_COLORS
  const showConfetti = trigger === "confetti" || trigger === "both"
  const showMessage = !cardless && (trigger === "confetti" || trigger === "emoji" || trigger === "both")
  const canTapDismiss = Boolean(onTapDismiss || interactive)
  const overlay = placement === "overlay"
  const pop = useAnimatedValue(0.94)
  const opacity = useAnimatedValue(0)
  const emojiScale = useAnimatedValue(0)

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) => ({
        id: index,
        left: Math.round(seededRatio(index + 1) * 100),
        delay: Math.round(seededRatio(index + 11) * 420),
        duration: Math.round(particleDurationBase * (0.78 + seededRatio(index + 21) * 0.44)),
        drift: Math.round((seededRatio(index + 31) - 0.5) * driftRange),
        rotate: Math.round(seededRatio(index + 41) * 720),
        size: 6 + Math.round(seededRatio(index + 51) * 6),
        color: palette[index % palette.length],
      })),
    [particleCount, particleDurationBase, driftRange, palette],
  )

  useEffect(() => {
    if (!active) return
    pop.setValue(0.94)
    opacity.setValue(0)
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(pop, {
        toValue: 1,
        friction: 7,
        tension: 110,
        useNativeDriver: true,
      }),
    ]).start()
  }, [active, opacity, pop])

  useEffect(() => {
    if (!active || emojiAnimation !== "bounce") return
    if (reduceMotion) {
      // Reduce Motion 有効時はバウンスさせず最終スケールで静止表示する
      // （初期値 0 のまま return すると絵文字が不可視になる）
      emojiScale.setValue(1)
      return
    }
    emojiScale.setValue(0)
    // belle-todo の milestone-emoji keyframe（0%→0, 50%→1.4, 70%→0.9, 100%→1、
    // 600ms ease-out, 200ms delay）を Animated.sequence で再現。
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
    animation.start()
    return () => animation.stop()
  }, [active, emojiAnimation, emojiScale, reduceMotion])

  useEffect(() => {
    if (!active || !onDone) return
    const id = setTimeout(onDone, resolvedDurationMs)
    return () => clearTimeout(id)
  }, [active, onDone, resolvedDurationMs])

  if (!active || trigger === "none") return null

  const handleTapDismiss = () => {
    if (onTapDismiss) {
      onTapDismiss()
      return
    }
    if (interactive) onDone?.()
  }

  const content = (
    <View
      pointerEvents="box-none"
      testID={testID}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        overlay
          ? {
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }
          : {
              position: "relative",
              minHeight: showMessage ? 180 : 80,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            },
        style,
      ]}
    >
      {showConfetti && (
        <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
          {particles.map((piece) => (
            <ConfettiPiece
              key={piece.id}
              color={resolveConfettiColor(theme, piece.color as string)}
              delay={piece.delay}
              duration={piece.duration}
              drift={piece.drift}
              left={`${piece.left}%`}
              rotate={piece.rotate}
              size={piece.size}
            />
          ))}
        </View>
      )}

      {canTapDismiss && (
        <Pressable
          accessibilityLabel="閉じる"
          onPress={handleTapDismiss}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}

      {showMessage && (
        <Animated.View style={{ opacity, transform: [{ scale: pop }] }}>
          <Pressable
            onPress={canTapDismiss ? handleTapDismiss : undefined}
            style={[
              {
                width: "100%",
                maxWidth: 360,
                marginHorizontal: scales.spacing.scale[4],
                alignItems: "center",
                borderRadius: scales.borderRadius["2xl"],
                borderWidth: 1,
                borderColor: theme.border["low-emphasis"],
                backgroundColor: theme.surface.primary,
                paddingHorizontal: scales.spacing.scale[6],
                paddingVertical: scales.spacing.scale[5],
                shadowColor: theme.overlay.dark,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.14,
                shadowRadius: 24,
                elevation: 10,
              },
              cardStyle,
            ]}
          >
            {emoji && (
              <Animated.Text
                style={[
                  resolveTypo("display.lg"),
                  { marginBottom: scales.spacing.scale[3] },
                  emojiAnimation === "bounce" ? { transform: [{ scale: emojiScale }] } : null,
                ]}
              >
                {emoji}
              </Animated.Text>
            )}
            {title && (
              <RNText
                style={[
                  resolveTypo("heading.md"),
                  { color: theme.text["high-emphasis"], textAlign: "center" },
                ]}
              >
                {title}
              </RNText>
            )}
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
              <Pressable onPress={() => {}} style={{ marginTop: scales.spacing.scale[4], width: "100%" }}>
                {actions}
              </Pressable>
            )}
          </Pressable>
        </Animated.View>
      )}
    </View>
  )

  if (!overlay) return content

  return (
    <Modal visible transparent animationType="none" onRequestClose={handleTapDismiss}>
      <View style={{ flex: 1, backgroundColor: "transparent" }}>{content}</View>
    </Modal>
  )
}

function resolveConfettiColor(
  theme: ReturnType<typeof useTheme>["theme"],
  color: string,
) {
  if (color === "brand") return theme.brand.primary
  if (color === "success") return theme.success.base
  if (color === "warning") return theme.warning.base
  if (color === "caution") return theme.caution.base
  if (color === "info") return theme.info.base
  // colors prop で任意色（#hex 等）が渡された場合はそのまま使う。
  // 既知のトークン名以外は CONFETTI_TOKEN_NAMES に含まれないため、ここに到達する。
  if (!CONFETTI_TOKEN_NAMES.includes(color)) return color
  return theme.info.base
}

function ConfettiPiece({
  color,
  delay,
  duration,
  drift,
  left,
  rotate,
  size,
}: {
  color: string
  delay: number
  duration: number
  drift: number
  left: `${number}%`
  rotate: number
  size: number
}) {
  const progress = useAnimatedValue(0)

  useEffect(() => {
    progress.setValue(0)
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    })
    animation.start()
    return () => animation.stop()
  }, [delay, duration, progress])

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: -12,
        left,
        width: size,
        height: Math.max(4, size - 2),
        borderRadius: 2,
        backgroundColor: color,
        opacity: progress.interpolate({ inputRange: [0, 0.08, 0.92, 1], outputRange: [0, 1, 1, 0] }),
        transform: [
          {
            translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 760] }),
          },
          {
            translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, drift] }),
          },
          {
            rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", `${rotate}deg`] }),
          },
        ],
      }}
    />
  )
}

export { Celebration }
