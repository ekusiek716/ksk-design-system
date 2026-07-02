import React, { useId } from "react"
import { View, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { themes } from "../../tokens/native"

export interface GradientSurfaceStop {
  /** 0〜1 */
  offset: number
  color: string
}

export interface GradientSurfaceProps {
  /** グラデ方向。既定 "vertical"（上→下） */
  direction?: "vertical" | "horizontal"
  /**
   * 明示 stops。省略時は現在テーマの Brand ランプから
   * 400（明）→ 500（コア）→ 600（深）を縦に流すヒーロー用グラデになる。
   */
  stops?: GradientSurfaceStop[]
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

/**
 * ヒーロー画面向けのフルブリード・ブランドグラデーション面。
 *
 * - 色は semantic トークンのみ（既定 stops はテーマの Brand ランプ由来）。
 *   テーマを差し替えるとグラデも追従する。
 * - react-native-svg は optional peerDependency。未導入環境では
 *   コア色（中間 stop）の単色フィルにフォールバックする。
 */
export function GradientSurface({
  direction = "vertical",
  stops,
  style,
  children,
}: GradientSurfaceProps) {
  const { name } = useTheme()
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, "")

  // Brand ランプのアンカー（400/500/600 相当）を semantic トークン経由で解決:
  // dark.brand.primary = 400 / surface.accent-primary = 500 / light.brand.primary = 600
  const ramp = themes[name]
  const resolvedStops: GradientSurfaceStop[] =
    stops && stops.length >= 2
      ? stops
      : [
          { offset: 0, color: ramp.dark.brand.primary },
          { offset: 0.55, color: ramp.dark.surface["accent-primary"] },
          { offset: 1, color: ramp.light.brand.primary },
        ]

  const midStop = resolvedStops[Math.floor(resolvedStops.length / 2)]
  const svg = tryLoadSvg()

  return (
    <View style={[{ flex: 1, backgroundColor: midStop.color, overflow: "hidden" }, style]}>
      {svg ? (
        <svg.Svg
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          preserveAspectRatio="xMidYMid slice"
        >
          <svg.Defs>
            <svg.LinearGradient
              id={gradientId}
              x1="0"
              y1="0"
              x2={direction === "horizontal" ? "1" : "0"}
              y2={direction === "horizontal" ? "0" : "1"}
            >
              {resolvedStops.map((stop) => (
                <svg.Stop key={stop.offset} offset={String(stop.offset)} stopColor={stop.color} />
              ))}
            </svg.LinearGradient>
          </svg.Defs>
          <svg.Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
        </svg.Svg>
      ) : null}
      {children}
    </View>
  )
}

/**
 * react-native-svg をランタイムで try-load する。
 * 失敗（未インストール）なら null を返して単色フォールバックへ。
 */
type SvgModule = {
  Svg: React.ComponentType<{
    style?: StyleProp<ViewStyle>
    preserveAspectRatio?: string
    children?: React.ReactNode
  }>
  Defs: React.ComponentType<{ children?: React.ReactNode }>
  LinearGradient: React.ComponentType<{
    id: string
    x1: string
    y1: string
    x2: string
    y2: string
    children?: React.ReactNode
  }>
  Stop: React.ComponentType<{ offset: string; stopColor: string }>
  Rect: React.ComponentType<{ x: string; y: string; width: string; height: string; fill: string }>
}

let cachedSvg: SvgModule | null | undefined = undefined

function tryLoadSvg(): SvgModule | null {
  if (cachedSvg !== undefined) return cachedSvg
  try {
    // optional peerDep: 入ってない環境では throw → 単色フォールバック
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("react-native-svg") as Partial<SvgModule> & { default?: SvgModule["Svg"] }
    if (mod.Defs && mod.LinearGradient && mod.Stop && mod.Rect && (mod.Svg ?? mod.default)) {
      cachedSvg = {
        Svg: (mod.Svg ?? mod.default) as SvgModule["Svg"],
        Defs: mod.Defs,
        LinearGradient: mod.LinearGradient,
        Stop: mod.Stop,
        Rect: mod.Rect,
      }
    } else {
      cachedSvg = null
    }
  } catch {
    cachedSvg = null
  }
  return cachedSvg
}
