import React from "react";
import { type ViewProps } from "react-native";
export type GlassIntensity = "subtle" | "regular" | "thick";
export type GlassTint = "light" | "dark" | "system";
export interface GlassViewProps extends ViewProps {
    intensity?: GlassIntensity;
    tint?: GlassTint;
    /** rim（縁の光屈折）を出す */
    showRim?: boolean;
    /** 角丸 */
    borderRadius?: number;
    children?: React.ReactNode;
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
export declare function GlassView({ intensity, tint, showRim, borderRadius, style, children, ...rest }: GlassViewProps): import("react/jsx-runtime").JSX.Element;
