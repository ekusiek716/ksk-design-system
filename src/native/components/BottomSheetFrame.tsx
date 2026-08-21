import React from "react"
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { useSafeAreaInsets } from "../theme/SafeAreaInsetsProvider"
import { resolveInsetEdge } from "../safe-area"
import { GlassView } from "./GlassView"

export type BottomSheetFramePreset = "mobile-full" | "mobile-form" | "desktop-floating"
export type SheetSurface = "default" | "glass"
/**
 * 高さの決め方（issue #448）。
 * - `"preset"`（既定・従来どおり）: preset ごとの maxHeight（520/620/720）と
 *   mobile-full の minHeight 360 が効く。
 * - `"fitContent"`: min/max を外し、中身の量にそのまま追従する。
 *   `maxHeight` を渡せば上限だけ付けられる。
 */
export type BottomSheetFrameHeight = "preset" | "fitContent"

export interface BottomSheetFrameProps {
  preset?: BottomSheetFramePreset
  surface?: SheetSurface
  /**
   * 高さの決め方。既定 `"preset"`（従来の固定高）。
   * 中身の量に追従させたいときは `"fitContent"`。
   */
  height?: BottomSheetFrameHeight
  /**
   * 高さ上限（pt）の明示指定。preset 由来の上限より優先する。
   * `height="fitContent"` と組み合わせると「中身に追従しつつ上限あり」になる。
   */
  maxHeight?: number
  /**
   * ホームインジケータ（bottom safe-area）分の内側余白を確保するか。既定 false。
   * 既定を true にすると既存 consumer の枠内余白が一斉に増えるため後方互換で false。
   * 実測 inset は `SafeAreaInsetsProvider` から供給する（未供給なら加算 0）。
   */
  safeArea?: boolean
  /**
   * 上端にドラッグハンドル（つまみ）を表示するか。既定 false。
   * `header` より上に描画される。ジェスチャは持たない見た目だけの要素で、
   * ドラッグ操作が要る場合は `Sheet` の snap モードを使う。
   */
  handle?: boolean
  header?: React.ReactNode
  footer?: React.ReactNode
  scrollable?: boolean
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  bodyStyle?: StyleProp<ViewStyle>
}

export function BottomSheetFrame({
  preset = "mobile-full",
  surface = "default",
  height = "preset",
  maxHeight: maxHeightProp,
  safeArea = false,
  handle = false,
  header,
  footer,
  scrollable = true,
  children,
  style,
  bodyStyle,
}: BottomSheetFrameProps) {
  const { theme, scales } = useTheme()
  const insets = useSafeAreaInsets()
  const fitContent = height === "fitContent"
  const presetMaxHeight = preset === "mobile-form" ? 520 : preset === "desktop-floating" ? 620 : 720
  const maxHeight = maxHeightProp ?? (fitContent ? undefined : presetMaxHeight)
  const borderRadius =
    preset === "mobile-full" ? scales.borderRadius["2xl"] : scales.borderRadius.xl
  const bottomInset = resolveInsetEdge(insets, "bottom", safeArea)
  // fitContent では親に高さが無いため flex:1 だと本文が潰れる。
  // 伸びは中身まで、縮みは maxHeight まで、という指定にする。
  const bodySizing: ViewStyle = fitContent ? { flexGrow: 0, flexShrink: 1 } : { flex: 1 }
  const body = scrollable ? (
    <ScrollView style={[bodySizing, bodyStyle]}>{children}</ScrollView>
  ) : (
    <View style={[bodySizing, bodyStyle]}>{children}</View>
  )

  const content = (
    <>
      {handle && (
        <View
          // 装飾のみ（ジェスチャ無し）。読み上げ対象から明示的に外す
          accessible={false}
          importantForAccessibility="no"
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.border["medium-emphasis"],
            alignSelf: "center",
            marginTop: scales.spacing.scale[3],
            marginBottom: scales.spacing.scale[2],
          }}
        />
      )}
      {header}
      {body}
      {footer}
    </>
  )
  const frameStyle: ViewStyle = {
    maxHeight,
    minHeight: !fitContent && preset === "mobile-full" ? 360 : undefined,
    paddingBottom: bottomInset > 0 ? bottomInset : undefined,
    overflow: "hidden",
    borderRadius,
    backgroundColor: surface === "glass" ? "transparent" : theme.surface.primary,
  }

  if (surface === "glass") {
    return (
      <GlassView
        intensity="thick"
        borderRadius={borderRadius}
        style={[frameStyle, style]}
      >
        {content}
      </GlassView>
    )
  }

  return <View style={[frameStyle, style]}>{content}</View>
}
