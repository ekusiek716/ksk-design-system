import React from "react";
import { type ViewProps } from "react-native";
export type GlassIntensity = "subtle" | "regular" | "thick";
export type GlassTint = "light" | "dark" | "system";
export type GlassFallback = "blur" | "surface";
export type GlassEffectStyle = "clear" | "regular" | "none";
export interface GlassViewProps extends ViewProps {
    intensity?: GlassIntensity;
    tint?: GlassTint;
    /** iOS 26+ で expo-glass-effect を使う。未導入/非対応なら fallback に落ちる */
    nativeGlass?: boolean;
    /** native Liquid Glass が使えない時の fallback */
    fallback?: GlassFallback;
    /** expo-glass-effect の glassEffectStyle */
    glassEffectStyle?: GlassEffectStyle;
    /** expo-glass-effect の isInteractive */
    interactive?: boolean;
    /** native glass の tintColor。未指定なら DS tint から導出 */
    tintColor?: string;
    /** fallback surface の塗り。tabBarBackground など absolute 背景で明示したい時に指定 */
    backgroundFill?: string;
    /** rim（縁）の色 */
    rimColor?: string;
    /** 上辺 highlight の色 */
    highlightColor?: string;
    /** rim（縁の光屈折）を出す */
    showRim?: boolean;
    /** 上辺 highlight を出す */
    showHighlight?: boolean;
    /** 角丸 */
    borderRadius?: number;
    /** 背景として絶対配置する */
    absoluteFill?: boolean;
    children?: React.ReactNode;
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
export declare function GlassView({ intensity, tint, nativeGlass, fallback, glassEffectStyle, interactive, tintColor, backgroundFill, rimColor, highlightColor, showRim, showHighlight, borderRadius, absoluteFill, style, children, ...rest }: GlassViewProps): React.JSX.Element;
declare function isNativeLiquidGlassAvailable(): boolean;
export { isNativeLiquidGlassAvailable };
