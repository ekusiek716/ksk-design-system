import React from "react"
import { View, Text as RNText, type StyleProp, type ViewStyle } from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import {
  getProgressRingGeometry,
  getProgressRingMaskRotations,
  progressRingPct,
} from "../progress-ring-geometry"

/**
 * 開発ビルド判定。DS は node の型を持たないので globalThis 経由で参照する。
 * `proc` の存在を先に必須にする（ChipSelector / QuickActionGrid と同じ形）。
 * 省略すると process 自体が無い環境で undefined との比較が true になり、
 * 本番でも警告が出続ける。
 */
function isDev() {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  return Boolean(proc) && proc!.env?.NODE_ENV !== "production"
}

export interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  /**
   * リングの線の太さ（px）。Web の `strokeWidth` と同じ意味・同じ名前。
   *
   * @default 6
   */
  strokeWidth?: number
  /**
   * リングの線の太さ（px）。
   *
   * @deprecated issue #495。`strokeWidth` を使うこと（Web の同名 prop と語彙を揃えた）。
   * 後方互換のため型からは消していない。両方渡した場合は `strokeWidth` が優先される。
   *
   * @default 6
   */
  thickness?: number
  showLabel?: boolean
}

/**
 * value/max に比例した円弧を描く ProgressRing。
 *
 * - react-native-svg があれば strokeDasharray/strokeDashoffset で円弧を描く。
 * - 無い環境（optional peerDependency）では View の 2 マスク方式にフォールバックする。
 *
 * issue #540: 以前は半円 2 枚の重ね合わせだったため角度によらず常に半周の塗りになり、
 * 180 度ちょうど（50%）では塗りが消えていた。
 */
export function ProgressRing({
  value,
  max = 100,
  size = 64,
  strokeWidth,
  thickness,
  showLabel = true,
}: ProgressRingProps) {
  const { theme } = useTheme()
  // 非推奨の `thickness` は後方互換で読み続けるが、両方来たら新しい方を採る。
  const resolvedStrokeWidth = strokeWidth ?? thickness ?? 6

  if (isDev() && thickness !== undefined) {
    console.warn(
      "[ProgressRing] `thickness` は非推奨です（issue #495）。Web と語彙を揃えた `strokeWidth` を使ってください。"
    )
  }
  const pct = progressRingPct(value, max)
  const geometry = getProgressRingGeometry(value, max, size, resolvedStrokeWidth)
  const { rightRotation, leftRotation } = getProgressRingMaskRotations(value, max)

  const trackColor = theme.surface.tertiary
  const fillColor = theme.brand.primary

  const half = size / 2
  const svg = tryLoadSvg()

  /**
   * SVG 非対応環境向け: 半分の窓（overflow hidden）越しに半円を回転させて見せる。
   * side="right" は左半円を、side="left" は右半円を回す。
   */
  const renderMaskedHalf = (side: "right" | "left", rotation: number) => {
    if (rotation <= 0) return null
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: side === "right" ? half : 0,
          width: half,
          height: size,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: side === "right" ? -half : 0,
            width: size,
            height: size,
            transform: [{ rotate: `${rotation}deg` }],
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: side === "right" ? 0 : half,
              width: half,
              height: size,
              backgroundColor: fillColor,
              borderTopLeftRadius: side === "right" ? half : 0,
              borderBottomLeftRadius: side === "right" ? half : 0,
              borderTopRightRadius: side === "left" ? half : 0,
              borderBottomRightRadius: side === "left" ? half : 0,
            }}
          />
        </View>
      </View>
    )
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {svg ? (
        <svg.Svg
          style={{ position: "absolute", top: 0, left: 0, width: size, height: size }}
          width={size}
          height={size}
        >
          <svg.Circle
            cx={half}
            cy={half}
            r={geometry.radius}
            stroke={trackColor}
            strokeWidth={resolvedStrokeWidth}
            fill="none"
          />
          <svg.G rotation={-90} originX={half} originY={half}>
            <svg.Circle
              cx={half}
              cy={half}
              r={geometry.radius}
              stroke={fillColor}
              strokeWidth={resolvedStrokeWidth}
              strokeLinecap="butt"
              fill="none"
              strokeDasharray={[geometry.dashArray, geometry.dashArray]}
              strokeDashoffset={geometry.dashOffset}
            />
          </svg.G>
        </svg.Svg>
      ) : (
        <>
          <View
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: trackColor,
            }}
          />
          {renderMaskedHalf("right", rightRotation)}
          {renderMaskedHalf("left", leftRotation)}
        </>
      )}
      <View
        style={{
          width: size - resolvedStrokeWidth * 2,
          height: size - resolvedStrokeWidth * 2,
          borderRadius: (size - resolvedStrokeWidth * 2) / 2,
          backgroundColor: theme.surface.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showLabel && (
          <RNText style={[resolveTypo("label.sm"), { color: theme.text["high-emphasis"] }]}>
            {Math.round(pct)}%
          </RNText>
        )}
      </View>
    </View>
  )
}

/**
 * react-native-svg をランタイムで try-load する（GradientSurface と同じ方式）。
 * 失敗（未インストール）なら null を返して View の 2 マスク方式へフォールバック。
 */
type RingSvgModule = {
  Svg: React.ComponentType<{
    style?: StyleProp<ViewStyle>
    width?: number
    height?: number
    children?: React.ReactNode
  }>
  G: React.ComponentType<{
    rotation?: number
    originX?: number
    originY?: number
    children?: React.ReactNode
  }>
  Circle: React.ComponentType<{
    cx: number
    cy: number
    r: number
    stroke: string
    strokeWidth: number
    strokeLinecap?: "butt" | "round" | "square"
    fill: string
    strokeDasharray?: number[]
    strokeDashoffset?: number
  }>
}

let cachedRingSvg: RingSvgModule | null | undefined = undefined

function tryLoadSvg(): RingSvgModule | null {
  if (cachedRingSvg !== undefined) return cachedRingSvg
  try {
    // optional peerDep: 入ってない環境では throw → View フォールバック
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("react-native-svg") as Partial<RingSvgModule> & {
      default?: RingSvgModule["Svg"]
    }
    if (mod.Circle && mod.G && (mod.Svg ?? mod.default)) {
      cachedRingSvg = {
        Svg: (mod.Svg ?? mod.default) as RingSvgModule["Svg"],
        G: mod.G,
        Circle: mod.Circle,
      }
    } else {
      cachedRingSvg = null
    }
  } catch {
    cachedRingSvg = null
  }
  return cachedRingSvg
}
