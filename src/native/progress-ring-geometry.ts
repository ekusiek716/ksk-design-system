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
