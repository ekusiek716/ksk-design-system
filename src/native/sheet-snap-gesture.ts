/**
 * snap mode bottom sheet のドラッグ判定（純ロジック）。
 *
 * Sheet.tsx の PanResponder は生成時のクロージャを保持し続けるため、
 * 可変値（props / 実測値）は毎回この関数の引数として渡す。
 * ここに閾値を集約してテスト可能にしておく。
 */

/** この量未満の縦移動では responder を奪わない（横スクロール等を邪魔しない） */
export const DRAG_THRESHOLD = 6
/** ラバーバンドで許す最大はみ出し量 (px) */
export const RUBBER_MAX = 4
/** close 判定：minSnap から panelH × この比率を超えて引いたら閉じる */
export const CLOSE_DRAG_RATIO = 0.18
/** 上方向に 1 段階 snap を上げる閾値 */
export const UP_SNAP_DY = -20
/** FULL から minSnap へ collapse する閾値 */
export const COLLAPSE_DY = 40

export interface SnapGestureConfig {
  /** 昇順の snap 比率 */
  points: number[]
  minSnap: number
  maxSnap: number
  /** パネル高 = H × maxSnap。完全に閉じた位置の translateY でもある */
  panelH: number
  /** 画面高 */
  H: number
  dismissible: boolean
}

export interface DragCaptureState {
  /** 現在の active snap 比率 */
  active: number
  maxSnap: number
  /** ScrollView の contentOffset.y */
  scrollTop: number
  /** snap アニメーション実行中か */
  animating: boolean
}

/**
 * ドラッグを sheet 側で受け取るか。
 * アニメーション中は受け取らない（開始位置がアニメ途中の値になり、パネルが飛ぶ）。
 * FULL では ScrollView が先頭にある時の下方向ドラッグだけ受け取る。
 */
export function shouldCaptureDrag(dy: number, state: DragCaptureState): boolean {
  if (state.animating) return false
  if (Math.abs(dy) < DRAG_THRESHOLD) return false
  if (state.active === state.maxSnap) {
    return dy > 0 && state.scrollTop <= 0
  }
  return true
}

/** ドラッグ中の translateY（両端はラバーバンド） */
export function resolveDragTranslateY(
  startTY: number,
  dy: number,
  config: SnapGestureConfig,
): number {
  let next = startTY + dy
  // フル超え（上方向 overshoot）はラバーバンド
  if (next < 0) return Math.max(-RUBBER_MAX, next / 4)
  // 非 dismissible は minSnap より下にスワイプさせない（rubber-band）
  const minTY = config.dismissible
    ? config.panelH
    : (config.maxSnap - config.minSnap) * config.H
  if (next > minTY) {
    const over = next - minTY
    next = minTY + Math.min(RUBBER_MAX, over / 4)
  }
  return next
}

export type ReleaseAction = { kind: "close" } | { kind: "snap"; snap: number }

/** 指を離した時の着地先。close は dismissible のときだけ返す。 */
export function resolveRelease(
  startTY: number,
  dy: number,
  startActive: number,
  config: SnapGestureConfig,
): ReleaseAction {
  const { points, minSnap, maxSnap, panelH, H, dismissible } = config

  // 1) FULL からさらに上 → ラバーバンドで戻る
  if (startActive === maxSnap && dy < 0) {
    return { kind: "snap", snap: maxSnap }
  }

  // 2) 上方向 → 1段階上の snap
  if (dy < UP_SNAP_DY) {
    const idx = points.indexOf(startActive)
    const nextSnap = idx >= 0 && idx < points.length - 1 ? points[idx + 1] : maxSnap
    return { kind: "snap", snap: nextSnap }
  }

  // 3) 下方向：dismissible 時のみ close 判定
  if (dy > 0) {
    if (dismissible && startActive === minSnap && dy > panelH * CLOSE_DRAG_RATIO) {
      return { kind: "close" }
    }
    if (startActive === maxSnap) {
      const collapseDelta = (maxSnap - minSnap) * H
      if (dismissible && dy > collapseDelta + panelH * CLOSE_DRAG_RATIO) {
        return { kind: "close" }
      }
      if (dy > COLLAPSE_DY) {
        return { kind: "snap", snap: minSnap }
      }
    }
  }

  // 4) その他は最近接 snap に戻す
  const released = Math.max(0, Math.min(panelH, startTY + dy))
  const releasedActive = maxSnap - released / H
  let best = points[0]
  let bestD = Math.abs(points[0] - releasedActive)
  for (let i = 1; i < points.length; i++) {
    const d = Math.abs(points[i] - releasedActive)
    if (d < bestD) {
      bestD = d
      best = points[i]
    }
  }
  return { kind: "snap", snap: best }
}
