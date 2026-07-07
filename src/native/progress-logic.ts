// react-native に依存しない Progress の純粋ロジック。
// vitest から react-native をロードせずに直接テストできるよう分離している。

export type ProgressVariant = "default" | "success" | "warning" | "caution"
export type ProgressTone = "accent" | "success" | "caution" | "warning"

export interface ProgressAutoColorConfig {
  successBelow?: number
  warningFrom?: number
  warningBelow?: number
  cautionFrom?: number
}

/** masked=true のときに使う固定表示の割合（%）。value に一切依存しない。 */
export const MASKED_PROGRESS_PCT = 45

const DEFAULT_AUTO_COLOR: ProgressAutoColorConfig = {
  warningFrom: 80,
  cautionFrom: 100,
}

/**
 * 描画に使う実効パーセンテージを決める純粋関数。
 * masked=true のときは value/max を一切見ず常に同じ値を返す（逆算防止の要件そのもの）。
 */
export function resolveProgressPct(value: number, max: number, masked: boolean | undefined): number {
  if (masked) return MASKED_PROGRESS_PCT
  return max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100))
}

export function toneToVariant(tone: ProgressTone): ProgressVariant {
  if (tone === "accent") return "default"
  return tone
}

export function getAutoProgressVariant(
  value: number,
  fallback: ProgressVariant,
  autoColor: boolean | ProgressAutoColorConfig | undefined
): ProgressVariant {
  if (!autoColor) return fallback
  const config: ProgressAutoColorConfig =
    autoColor === true ? DEFAULT_AUTO_COLOR : { ...DEFAULT_AUTO_COLOR, ...autoColor }

  if (config.successBelow != null && value < config.successBelow) return "success"
  if (config.cautionFrom != null && value >= config.cautionFrom) return "caution"
  if (config.warningFrom != null && value >= config.warningFrom) return "warning"
  if (config.warningBelow != null && value < config.warningBelow) return "warning"
  return fallback
}

/**
 * masked 時に実際に描画へ使う variant を決める純粋関数。
 * masked=true のときは autoColor による value 依存の色分岐を無視する
 * （バー幅だけでなく色からの逆算も防ぐのが要件）。
 */
export function resolveProgressVariant(
  pct: number,
  tone: ProgressTone,
  variant: ProgressVariant | undefined,
  autoColor: boolean | ProgressAutoColorConfig | undefined,
  masked: boolean | undefined
): ProgressVariant {
  const fallback = variant ?? toneToVariant(tone)
  if (masked) return fallback
  return getAutoProgressVariant(pct, fallback, autoColor)
}
