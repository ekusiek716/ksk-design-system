import React from "react"
import {
  View,
  Text as RNText,
  type AccessibilityRole,
  type AccessibilityValue,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useTheme } from "../theme/ThemeProvider"
import { resolveTypo } from "../typography"
import {
  getProgressRingAccessibilityValue,
  getProgressRingGeometry,
  getProgressRingMaskRotations,
  progressRingPct,
  resolveProgressRingFill,
  shouldDrawProgressArc,
  type ProgressRingLineCap,
  type ProgressRingTone,
} from "../progress-ring-geometry"

export type { ProgressRingLineCap, ProgressRingTone }

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
  /**
   * リングの塗り色を意味名で指定する（issue #559）。未指定は `"accent"`（= `theme.brand.primary`）で
   * 従来の見た目と同じ。値は Badge / Tag と同じ語彙で、`theme` から解決するため
   * テーマ・ダークモード切替に追随する。生の色文字列は受け取らない。
   *
   * トラック（未塗り部分）の色は tone では変わらない。
   *
   * @default "accent"
   */
  tone?: ProgressRingTone
  /**
   * 色の直接注入点（issue #559）。Calendar の `colors`（#304）/ Sheet の `surfaceColor`（#448）と
   * 同じ Native 専用の逃げ道で、Web は `color` / `trackColor`（semantic トークン文字列）が担う。
   *
   * 使うのは、必要な色が DS theme に無いときだけ:
   * consumer 所有の brand palette（AGENTS.md §8 の theme 契約）や、
   * DS トークンに無い学習体験の意味色（例: correct の緑）を出す場合。
   * DS theme にある役割で足りるなら `tone` を使う（テーマ・ダークモード切替に追随する）。
   *
   * `fill` は `tone` より優先する。`track` 未指定なら従来どおり `theme.surface.tertiary`。
   */
  colors?: {
    /** 進捗円弧の色。 */
    fill?: string
    /** 背面トラック（未塗り部分）の色。 */
    track?: string
    /**
     * react-native-svg が無い環境のフォールバック描画でのみ使う中央の塗り。
     * リングを置く面の色に合わせる。SVG 描画時は中央が透明なので不要。
     */
    center?: string
  }
  /**
   * 円弧の線端（issue #559）。既定 `"butt"` で従来どおり。
   * Web の同名 prop と同じ意味で、SVG の `stroke-linecap` に渡る。
   *
   * フォールバック描画（react-native-svg が無い環境の View 2 マスク方式）は
   * 丸い線端を表現できないため、指定に関わらず `"butt"` 相当で描かれる。
   *
   * @default "butt"
   */
  lineCap?: ProgressRingLineCap
  /**
   * リング中央に置く要素（issue #559）。Web の同名 prop と同じ意味。
   * 省略時は `${パーセント}%` の既定ラベルになる。
   *
   * 文字列・数値はそのまま既定のラベル体裁（label.sm）で描画し、
   * それ以外の ReactNode は中央寄せで素通しする（2 行テキストやアイコンを置ける）。
   * 中央の描画領域はリングの内径（`size - strokeWidth * 2`）で、はみ出しは切らない。
   * 収まらない場合に `size` を上げるか中身を縮めるのは利用側の責任。
   *
   * `showLabel={false}` のときは既定ラベルも `label` も描画しない（Web と同じ）。
   */
  label?: React.ReactNode
  showLabel?: boolean
  /**
   * ルート View をひとつの読み上げ要素にまとめる（issue #559 / #564）。
   *
   * 既定（未指定）は `true`。Web の `role="progressbar"` が読み上げ上の葉になるのと同じく、
   * リング全体をひとつの進捗として読ませ、中央ラベルの文字は個別に読ませない。
   *
   * リングを含むカード側で説明文を組み立てている場合は `accessible={false}` を渡す。
   * このとき役割・値・名前の既定も付かず、#564 以前と同じ「ただの図形＋文字」に戻る。
   */
  accessible?: boolean
  /**
   * ルート View の読み上げ名。
   * 既定は Web の `aria-label` と同じ決め方で、`label` が文字列ならその文字列、
   * それ以外（未指定・ReactNode）は `"進捗"`（issue #564）。
   * `"✓"` のような記号を `label` に置く場合は意味の通る名前を明示すること。
   * 同じ画面に複数のリングを並べる場合も、既定のままだとすべて同じ名前で読まれて
   * 区別できないため、リングごとに（例: `"正解数"` / `"正答率"`）明示すること。
   */
  accessibilityLabel?: string
  /**
   * ルート View の役割。既定は `"progressbar"`（issue #564。Web の `role="progressbar"` と対称）。
   * 明示した値が優先される。
   */
  accessibilityRole?: AccessibilityRole
  /**
   * ルート View の読み上げ値。
   * 既定は `{ min: 0, max, now: <クランプ後の value> }`（issue #564）。
   * `max` が 0 以下・非有限のときは Web と同じ 0〜100 の尺度へ落とす。明示した値が優先される。
   */
  accessibilityValue?: AccessibilityValue
  /** iOS: ルート配下をアクセシビリティツリーから隠す。既定では付けない。 */
  accessibilityElementsHidden?: boolean
  /** Android: ルート配下をアクセシビリティツリーから隠す（`"no-hide-descendants"`）。既定では付けない。 */
  importantForAccessibility?: "auto" | "yes" | "no" | "no-hide-descendants"
  /** テスト用の識別子。既定では付けない。 */
  testID?: string
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
  tone,
  colors,
  lineCap = "butt",
  label,
  showLabel = true,
  accessible,
  accessibilityLabel,
  accessibilityRole,
  accessibilityValue,
  accessibilityElementsHidden,
  importantForAccessibility,
  testID,
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

  /**
   * 読み上げの既定（issue #564）。Web は常に `role="progressbar"` + `aria-valuenow` を持つのに、
   * Native は何も付かず「図形＋中央の文字」として読まれていた非対称の解消。
   *
   * `accessible={false}`（周りのカードが説明文を持つ場合）のときは、役割・値・名前の既定も付けない。
   * 読み上げから外したい意図なので、#564 以前とまったく同じ結果になる。
   */
  const isAccessibleGroup = accessible ?? true
  const resolvedAccessibilityRole = isAccessibleGroup
    ? (accessibilityRole ?? "progressbar")
    : accessibilityRole
  const resolvedAccessibilityValue = isAccessibleGroup
    ? (accessibilityValue ?? getProgressRingAccessibilityValue(value, max))
    : accessibilityValue
  // 名前の決め方は Web の `aria-label ?? (typeof label === "string" ? label : "進捗")` と同じ。
  const resolvedAccessibilityLabel = isAccessibleGroup
    ? (accessibilityLabel ?? (typeof label === "string" ? label : "進捗"))
    : accessibilityLabel
  /**
   * 二重読みの回避（issue #564）。役割と値を持つ要素の中に「80%」の文字があると、
   * 名前（label）と中央の文字で同じ数字が 2 回読まれる。Web は `role="progressbar"` が
   * 読み上げ上の葉になり中央 span が読まれないので、Native も中央だけをツリーから隠して揃える。
   * `accessible={false}` のときは隠さない（従来の読まれ方を保つ）。
   */
  const hideCenterFromA11y = isAccessibleGroup
  const geometry = getProgressRingGeometry(value, max, size, resolvedStrokeWidth)
  const { rightRotation, leftRotation } = getProgressRingMaskRotations(value, max)

  const trackColor = colors?.track ?? theme.surface.tertiary
  // tone / colors は SVG 分岐・View フォールバック分岐の両方がこの 1 値だけを見る（描き分けを増やさない）。
  const fillColor = colors?.fill ?? resolveProgressRingFill(tone, theme)

  const half = size / 2
  const svg = tryLoadSvg()

  /**
   * 中央の塗り。SVG 分岐では描かない（円弧は stroke で描くので円板は不要で、
   * 旧・半円重ね方式の名残りだった）。塗ってしまうと、リングを surface.primary 以外の
   * 面に置いたときに円板が浮いて見える。
   * フォールバック分岐は半円を隠すために円板が構造上必要なので残す。
   */
  const centerBackground = svg ? undefined : (colors?.center ?? theme.surface.primary)

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
      // 読み上げ系は明示的に受けた分だけルートへ渡す（...rest の無差別素通しはしない）。
      // 役割・値・名前・グループ化は既定を持つ（issue #564）。利用側の指定は必ず優先される。
      accessible={accessible ?? true}
      accessibilityLabel={resolvedAccessibilityLabel}
      accessibilityRole={resolvedAccessibilityRole}
      accessibilityValue={resolvedAccessibilityValue}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={importantForAccessibility}
      testID={testID}
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
          {/* 0% では円弧自体を描かない。lineCap="round" だと長さ 0 でも線端の丸が点として残る。 */}
          {shouldDrawProgressArc(value, max) && (
            <svg.G rotation={-90} originX={half} originY={half}>
              <svg.Circle
                cx={half}
                cy={half}
                r={geometry.radius}
                stroke={fillColor}
                strokeWidth={resolvedStrokeWidth}
                strokeLinecap={lineCap}
                fill="none"
                strokeDasharray={[geometry.dashArray, geometry.dashArray]}
                strokeDashoffset={geometry.dashOffset}
              />
            </svg.G>
          )}
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
          backgroundColor: centerBackground,
          alignItems: "center",
          justifyContent: "center",
        }}
        // 二重読みの回避（issue #564）。ルートが進捗として読まれるので中央の文字は読ませない。
        accessibilityElementsHidden={hideCenterFromA11y || undefined}
        importantForAccessibility={hideCenterFromA11y ? "no-hide-descendants" : undefined}
      >
        {showLabel &&
          (label === undefined ? (
            <RNText style={[resolveTypo("label.sm"), { color: theme.text["high-emphasis"] }]}>
              {Math.round(pct)}%
            </RNText>
          ) : typeof label === "string" || typeof label === "number" ? (
            // 素の文字列・数値は RN では <Text> の外に置けないため、既定と同じ体裁で包む。
            <RNText style={[resolveTypo("label.sm"), { color: theme.text["high-emphasis"] }]}>
              {label}
            </RNText>
          ) : (
            label
          ))}
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
