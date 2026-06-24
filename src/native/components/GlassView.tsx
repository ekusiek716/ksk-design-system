import React from "react"
import { View, Platform, type ViewProps, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"

export type GlassIntensity = "subtle" | "regular" | "thick"
export type GlassTint = "light" | "dark" | "system"
export type GlassFallback = "blur" | "surface"
export type GlassEffectStyle = "clear" | "regular" | "none"

export interface GlassViewProps extends ViewProps {
  intensity?: GlassIntensity
  tint?: GlassTint
  /** iOS 26+ で expo-glass-effect を使う。未導入/非対応なら fallback に落ちる */
  nativeGlass?: boolean
  /** native Liquid Glass が使えない時の fallback */
  fallback?: GlassFallback
  /** expo-glass-effect の glassEffectStyle */
  glassEffectStyle?: GlassEffectStyle
  /** expo-glass-effect の isInteractive */
  interactive?: boolean
  /** native glass の tintColor。未指定なら DS tint から導出 */
  tintColor?: string
  /** fallback surface の塗り。tabBarBackground など absolute 背景で明示したい時に指定 */
  backgroundFill?: string
  /** rim（縁）の色 */
  rimColor?: string
  /** 上辺 highlight の色 */
  highlightColor?: string
  /** rim（縁の光屈折）を出す */
  showRim?: boolean
  /** 上辺 highlight を出す */
  showHighlight?: boolean
  /** 角丸 */
  borderRadius?: number
  /** 背景として絶対配置する */
  absoluteFill?: boolean
  children?: React.ReactNode
}

const intensityMap: Record<GlassIntensity, { blur: number; opacity: number }> = {
  subtle: { blur: 14, opacity: 0.10 },
  regular: { blur: 28, opacity: 0.18 },
  thick: { blur: 56, opacity: 0.28 },
}

const glassEffectStyleMap: Record<GlassIntensity, GlassEffectStyle> = {
  subtle: "clear",
  regular: "regular",
  thick: "regular",
}

/**
 * Liquid Glass マテリアル。
 *
 * 4-tier の表示戦略:
 *   1. iOS 26+ + expo-glass-effect が入っている → native Liquid Glass
 *   2. expo-blur が入っている → BlurView fallback
 *   3. Web (RNW) → CSS の backdrop-filter で擬似
 *   4. それ以外 (Android / optional peer 未導入) → 半透明 surface
 *
 * expo-glass-effect / expo-blur は optional peerDependency。
 * consumer 側でインストールすると自動で上位 tier に切り替わる。
 */
export function GlassView({
  intensity = "regular",
  tint = "system",
  nativeGlass = true,
  fallback = "blur",
  glassEffectStyle,
  interactive = false,
  tintColor,
  backgroundFill,
  rimColor,
  highlightColor,
  showRim = true,
  showHighlight = true,
  borderRadius,
  absoluteFill = false,
  style,
  children,
  ...rest
}: GlassViewProps) {
  const { theme, scales, mode } = useTheme()
  const radius = borderRadius ?? scales.borderRadius.lg
  const cfg = intensityMap[intensity]
  const resolvedTint: "light" | "dark" =
    tint === "system" ? (mode === "dark" ? "dark" : "light") : tint
  const resolvedBackgroundFill = backgroundFill ??
    (resolvedTint === "light"
      ? `rgba(255, 255, 255, ${cfg.opacity})`
      : `rgba(20, 20, 30, ${cfg.opacity})`)
  const resolvedRimColor = rimColor ??
    (resolvedTint === "light" ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.15)")
  const resolvedHighlightColor = highlightColor ??
    (resolvedTint === "light" ? "rgba(255, 255, 255, 0.72)" : "rgba(255, 255, 255, 0.22)")

  const baseStyle: ViewStyle = {
    ...(absoluteFill ? StyleAbsoluteFill : {}),
    borderRadius: radius,
    overflow: "hidden",
    backgroundColor: resolvedBackgroundFill,
    borderWidth: showRim ? 1 : 0,
    borderColor: resolvedRimColor,
  }

  // ── Tier 1: iOS 26+ + expo-glass-effect ──
  const GlassEffectView = tryLoadGlassEffectView()
  if (nativeGlass && GlassEffectView && isNativeLiquidGlassAvailable()) {
    return (
      <GlassEffectView
        colorScheme={resolvedTint}
        glassEffectStyle={glassEffectStyle ?? glassEffectStyleMap[intensity]}
        isInteractive={interactive}
        tintColor={tintColor}
        style={[baseStyle, { backgroundColor: "transparent" }, style]}
        {...rest}
      >
        {showRim && <GlassRim borderRadius={radius} borderColor={resolvedRimColor} />}
        {showHighlight && <GlassHighlight borderRadius={radius} color={resolvedHighlightColor} />}
        {children}
      </GlassEffectView>
    )
  }

  // ── Tier 2: expo-blur fallback ──
  const BlurView = tryLoadBlurView()
  if (fallback === "blur" && BlurView && Platform.OS !== "web") {
    return (
      <BlurView
        intensity={cfg.blur * 2.5}
        tint={resolvedTint === "dark" ? "dark" : "light"}
        style={[baseStyle, { backgroundColor: "transparent" }, style]}
        {...rest}
      >
        {showRim && <GlassRim borderRadius={radius} borderColor={resolvedRimColor} />}
        {showHighlight && <GlassHighlight borderRadius={radius} color={resolvedHighlightColor} />}
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
        {showHighlight && <GlassHighlight borderRadius={radius} color={resolvedHighlightColor} />}
        {children}
      </View>
    )
  }

  // ── Tier 3: Android / expo-blur 未導入 ──
  return (
    <View style={[baseStyle, style]} {...rest}>
      {showHighlight && <GlassHighlight borderRadius={radius} color={resolvedHighlightColor} />}
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

function GlassRim({ borderRadius, borderColor }: { borderRadius: number; borderColor: string }) {
  return (
    <View
      pointerEvents="none"
      style={{
        ...StyleAbsoluteFill,
        borderRadius,
        borderWidth: 1,
        borderColor,
      }}
    />
  )
}

function GlassHighlight({ borderRadius, color }: { borderRadius: number; color: string }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 1,
        right: 1,
        height: 1,
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        backgroundColor: color,
      }}
    />
  )
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

type GlassEffectViewComponent = React.ComponentType<{
  colorScheme?: "auto" | "light" | "dark"
  glassEffectStyle?: GlassEffectStyle
  isInteractive?: boolean
  tintColor?: string
  style?: ViewProps["style"]
  children?: React.ReactNode
}>

type ExpoGlassEffectModule = {
  GlassView?: GlassEffectViewComponent
  isLiquidGlassAvailable?: () => boolean
  isGlassEffectAPIAvailable?: () => boolean
}

let cachedGlassEffectModule: ExpoGlassEffectModule | null | undefined = undefined

function tryLoadGlassEffectModule(): ExpoGlassEffectModule | null {
  if (cachedGlassEffectModule !== undefined) return cachedGlassEffectModule
  try {
    // optional peerDep: 入ってない環境では throw → null フォールバック
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedGlassEffectModule = require("expo-glass-effect") as ExpoGlassEffectModule
  } catch {
    cachedGlassEffectModule = null
  }
  return cachedGlassEffectModule
}

function tryLoadGlassEffectView(): GlassEffectViewComponent | null {
  return tryLoadGlassEffectModule()?.GlassView ?? null
}

function isNativeLiquidGlassAvailable(): boolean {
  if (Platform.OS !== "ios") return false
  const mod = tryLoadGlassEffectModule()
  if (!mod?.GlassView) return false
  const liquidAvailable = mod.isLiquidGlassAvailable?.() ?? true
  const apiAvailable = mod.isGlassEffectAPIAvailable?.() ?? true
  return liquidAvailable && apiAvailable
}

export { isNativeLiquidGlassAvailable }
