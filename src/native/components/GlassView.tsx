import React from "react"
import { View, Platform, type ViewProps, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export type GlassIntensity = "subtle" | "regular" | "thick"
export type GlassTint = "light" | "dark" | "system"

export interface GlassViewProps extends ViewProps {
  intensity?: GlassIntensity
  tint?: GlassTint
  /** rim（縁の光屈折）を出す */
  showRim?: boolean
  /** 角丸 */
  borderRadius?: number
  children?: React.ReactNode
}

const intensityMap: Record<GlassIntensity, { blur: number; opacity: number }> = {
  subtle: { blur: 14, opacity: 0.10 },
  regular: { blur: 28, opacity: 0.18 },
  thick: { blur: 56, opacity: 0.28 },
}

/**
 * iOS 26 Liquid Glass マテリアル。
 *
 * 3-tier の表示戦略:
 *   1. iOS + expo-blur が入っている → UIVisualEffectView (本物の Liquid Glass)
 *   2. Web (RNW) → CSS の backdrop-filter で擬似
 *   3. それ以外 (Android / expo-blur 未導入) → 半透明 surface でフォールバック
 *
 * expo-blur は optional peerDependency。consumer 側で `npx expo install expo-blur` するだけで
 * 自動で 1 のパスに切り替わる。
 */
export function GlassView({
  intensity = "regular",
  tint = "system",
  showRim = true,
  borderRadius,
  style,
  children,
  ...rest
}: GlassViewProps) {
  const { theme, scales, mode } = useTheme()
  const radius = borderRadius ?? scales.borderRadius.lg
  const cfg = intensityMap[intensity]
  const resolvedTint: "light" | "dark" =
    tint === "system" ? (mode === "dark" ? "dark" : "light") : tint

  const baseStyle: ViewStyle = {
    borderRadius: radius,
    overflow: "hidden",
    backgroundColor:
      resolvedTint === "light"
        ? `rgba(255, 255, 255, ${cfg.opacity})`
        : `rgba(20, 20, 30, ${cfg.opacity})`,
    borderWidth: showRim ? 1 : 0,
    borderColor:
      resolvedTint === "light" ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.15)",
  }

  // ── Tier 1: iOS + expo-blur ──
  const BlurView = tryLoadBlurView()
  if (BlurView && Platform.OS === "ios") {
    return (
      <BlurView
        intensity={cfg.blur * 2.5}
        tint={resolvedTint === "dark" ? "dark" : "light"}
        style={[baseStyle, { backgroundColor: "transparent" }, style]}
        {...rest}
      >
        {showRim && (
          <View
            pointerEvents="none"
            style={{
              ...StyleAbsoluteFill,
              borderRadius: radius,
              borderWidth: 1,
              borderColor: baseStyle.borderColor,
            }}
          />
        )}
        {children}
      </BlurView>
    )
  }

  // ── Tier 2: Web (RN Web で CSS が効く) ──
  if (Platform.OS === "web") {
    const webStyle: ViewStyle & { backdropFilter?: string; WebkitBackdropFilter?: string } = {
      ...baseStyle,
      // RN Web は未知のスタイルキーを CSS としてそのまま出力する
      WebkitBackdropFilter: `blur(${cfg.blur}px) saturate(1.9) brightness(1.06)`,
      backdropFilter: `blur(${cfg.blur}px) saturate(1.9) brightness(1.06)`,
    }
    return (
      <View style={[webStyle as ViewStyle, style]} {...rest}>
        {children}
      </View>
    )
  }

  // ── Tier 3: Android / expo-blur 未導入 ──
  return (
    <View style={[baseStyle, style]} {...rest}>
      {children}
    </View>
  )
}

const StyleAbsoluteFill = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

/**
 * expo-blur をランタイムで try-load する。
 * 失敗（未インストール）なら null を返してフォールバックパスへ。
 */
type BlurViewComponent = React.ComponentType<{
  intensity?: number
  tint?: "light" | "dark" | "default"
  style?: ViewProps["style"]
  children?: React.ReactNode
}>

let cachedBlurView: BlurViewComponent | null | undefined = undefined

function tryLoadBlurView(): BlurViewComponent | null {
  if (cachedBlurView !== undefined) return cachedBlurView
  try {
    // optional peerDep: 入ってない環境では throw → null フォールバック
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("expo-blur") as { BlurView?: BlurViewComponent }
    cachedBlurView = mod.BlurView ?? null
  } catch {
    cachedBlurView = null
  }
  return cachedBlurView
}
