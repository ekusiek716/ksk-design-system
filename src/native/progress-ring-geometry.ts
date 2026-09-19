// react-native に依存しない ProgressRing の純粋ジオメトリ。
// vitest から react-native をロードせずに直接テストできるよう分離している（progress-logic と同じ方針）。
//
// issue #540: 半円 2 枚の重ね合わせでは角度によらず常に半周しか塗られず、
// 180 度ちょうどでは塗りが消えていた。角度・ダッシュオフセットの算出をここに集約し、
// 描画側（SVG / View クリップ）は両方ともこの値だけを見る。

/** value を 0〜max にクランプする。max<=0 は 0 として扱う（ゼロ除算ガード）。 */
export function clampProgressValue(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0
  if (!Number.isFinite(max) || max <= 0) return 0
  return Math.min(max, Math.max(0, value))
}

/** 0〜100 の実効パーセンテージ。 */
export function progressRingPct(value: number, max: number): number {
  if (!Number.isFinite(max) || max <= 0) return 0
  return (clampProgressValue(value, max) / max) * 100
}

/** 0〜360 度の円弧角度。0/25/50/80/100% → 0/90/180/288/360 度。 */
export function progressRingAngle(value: number, max: number): number {
  return (progressRingPct(value, max) / 100) * 360
}

export interface ProgressRingGeometry {
  /** ストロークの中心半径（= (size - strokeWidth) / 2） */
  radius: number
  /** 中心半径の円周 */
  circumference: number
  /** strokeDasharray に渡す値 */
  dashArray: number
  /** strokeDashoffset に渡す値（0% で circumference、100% で 0） */
  dashOffset: number
  /** 角度（度） */
  angle: number
}

/** SVG 円弧（strokeDasharray / strokeDashoffset）用のジオメトリ。 */
export function getProgressRingGeometry(
  value: number,
  max: number,
  size: number,
  strokeWidth: number
): ProgressRingGeometry {
  const radius = Math.max(0, (size - strokeWidth) / 2)
  const circumference = 2 * Math.PI * radius
  const pct = progressRingPct(value, max)
  return {
    radius,
    circumference,
    dashArray: circumference,
    dashOffset: circumference * (1 - pct / 100),
    angle: (pct / 100) * 360,
  }
}

export interface ProgressRingMaskRotations {
  /** 右半分の窓に見せる左半円の回転角（0〜180 度） */
  rightRotation: number
  /** 左半分の窓に見せる右半円の回転角（0〜180 度） */
  leftRotation: number
}

/**
 * react-native-svg が無い環境向けの 2 マスク方式の回転角。
 * 0〜180 度は右半分の窓だけが埋まり、180 度を超えると右は塗り切った状態のまま
 * 左半分の窓が 0→180 度で埋まる（180 度ちょうどで塗りが消えない）。
 */
export function getProgressRingMaskRotations(
  value: number,
  max: number
): ProgressRingMaskRotations {
  const angle = progressRingAngle(value, max)
  return {
    rightRotation: Math.min(angle, 180),
    leftRotation: Math.max(0, angle - 180),
  }
}

/**
 * リングの塗り色を意味名で指定するためのトーン（issue #559）。
 *
 * Badge / Tag と同じ語彙に揃えている（brand 色は `accent`）。
 * 生の色文字列は受け取らない: native は theme（ThemeProvider）からしか
 * テーマ切替可能な色を解決できないため、値ではなく役割で受ける。
 */
export type ProgressRingTone = "accent" | "success" | "caution" | "warning" | "info"

/** `resolveProgressRingFill` が読むテーマの最小形（react-native 非依存にするための構造型）。 */
export interface ProgressRingToneTheme {
  brand: { primary: string }
  success: { base: string }
  caution: { base: string }
  warning: { base: string }
  info: { base: string }
}

/**
 * tone → theme 上の塗り色を解決する純粋関数。
 * 既定（tone 未指定 = "accent"）は従来どおり `theme.brand.primary` で、見た目は変わらない。
 */
export function resolveProgressRingFill(
  tone: ProgressRingTone | undefined,
  theme: ProgressRingToneTheme
): string {
  switch (tone) {
    case "success":
      return theme.success.base
    case "caution":
      return theme.caution.base
    case "warning":
      return theme.warning.base
    case "info":
      return theme.info.base
    case "accent":
    default:
      return theme.brand.primary
  }
}

/**
 * 円弧の線端（issue #559）。Web の `lineCap` と同じ意味で、SVG の `stroke-linecap` に渡る。
 *
 * react-native-svg が無い環境のフォールバック描画（View の 2 マスク方式）は
 * 半円の角丸で線端を表現できないため、常に `"butt"` 相当で描かれる。
 */
export type ProgressRingLineCap = "butt" | "round"

/**
 * 進捗の円弧を描くかどうかを判定する純粋関数。
 *
 * 0% では描かない。`lineCap="round"` のとき、長さ 0 の円弧でも線端の丸が
 * 「点」として残ってしまい、0% なのに塗りがあるように見えるため
 * （`butt` では見た目が変わらないので、線端によらず同じ判定にしてある）。
 */
export function shouldDrawProgressArc(value: number, max: number): boolean {
  return progressRingPct(value, max) > 0
}
