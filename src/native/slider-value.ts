// react-native に依存しない Slider の座標 ⇔ 値の純粋ロジック（issue #817）。
// vitest から react-native をロードせずに直接テストできるよう分離している。

export interface SliderValueFromXInput {
  /** Slider の外側コンテナ左端からの距離（pt）。 */
  x: number
  /** コンテナの幅（pt）。onLayout で測るまでは 0。 */
  width: number
  min: number
  max: number
  /** 0 / 未指定のときは snap しない。 */
  step?: number
}

/**
 * タッチ位置 x から Slider の値を求める。
 * x は外側コンテナ基準であること（子 View を pointerEvents="none" にして
 * nativeEvent.locationX の基準をコンテナにそろえている / issue #817）。
 * 幅が未計測（0 以下）のときは値を決められないので null を返す。
 */
export function sliderValueFromX({ x, width, min, max, step }: SliderValueFromXInput): number | null {
  if (!(width > 0)) return null
  const range = max - min
  if (!(range > 0)) return min
  const ratio = Math.max(0, Math.min(1, x / width))
  const raw = min + range * ratio
  const snapped = step ? Math.round(raw / step) * step : raw
  return Math.max(min, Math.min(max, snapped))
}

/** 値を 0..1 の比率へ変換する（溝の塗り幅・つまみ位置用）。min === max のときは 0。 */
export function sliderRatio({ value, min, max }: { value: number; min: number; max: number }): number {
  const range = max - min
  if (!(range > 0)) return 0
  return (Math.max(min, Math.min(max, value)) - min) / range
}
