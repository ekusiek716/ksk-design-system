// react-native に依存しない IconButton の寸法ロジック（issue #298③）。
// 視覚サイズが最小タップ領域を下回る分を hitSlop で補う計算を、
// vitest から react-native をロードせずに検証できるよう分離している。

export type IconButtonSize = "sm" | "md" | "lg"

export interface IconButtonMetrics {
  /** 見た目の一辺（pt） */
  box: number
  /** 中のアイコンの推奨サイズ（pt） */
  icon: number
  /** 実効タップ領域を最小値まで広げるための不可視マージン（pt） */
  hitSlop: number
}

const VISUAL_SIZES: Record<IconButtonSize, { box: number; icon: number }> = {
  sm: { box: 36, icon: 18 },
  md: { box: 44, icon: 20 },
  lg: { box: 48, icon: 24 },
}

/**
 * 視覚サイズと hitSlop を解決する。
 * `box + hitSlop * 2 >= minTarget`（既定 44pt = WCAG 2.5.5 / Apple HIG）を常に満たす。
 */
export function resolveIconButtonMetrics(
  size: IconButtonSize,
  minTarget: number,
): IconButtonMetrics {
  const { box, icon } = VISUAL_SIZES[size]
  return { box, icon, hitSlop: Math.max(0, Math.ceil((minTarget - box) / 2)) }
}

/** 実効タップ領域（一辺, pt）。テストと監査で使う。 */
export function effectiveTouchTarget(metrics: IconButtonMetrics): number {
  return metrics.box + metrics.hitSlop * 2
}
