// =============================================================
// Scrim のレイアウト解決（React / RN 非依存の純関数）
// issue #555: 全面スクリムの子（パネル）をどこへ置くかだけを決める。
// 子へ背景・padding・maxWidth を強制しないことが要件なので、ここで返すのは
// 「コンテナ側の寄せ方」と「子ラッパの伸ばし方」だけ。
// =============================================================

/** スクリムの中で子（パネル）をどこへ寄せるか。 */
export type ScrimAlign = "center" | "top" | "bottom" | "stretch"

export interface ScrimAlignmentStyle {
  /** 交差軸（横方向）の寄せ */
  alignItems: "center" | "stretch"
  /** 主軸（縦方向）の寄せ */
  justifyContent: "center" | "flex-start" | "flex-end"
}

/** 子ラッパに与えるスタイル。stretch のときだけ全面へ伸ばす。 */
export interface ScrimContentStyle {
  flex?: number
  alignSelf?: "stretch"
}

/**
 * align からコンテナの寄せスタイルを返す。
 * "stretch" は子を全面へ伸ばす（ViewShot のキャプチャ対象など、
 * 子が自前で全面レイアウトを持つ場合向け）。
 */
export function resolveScrimAlignment(align: ScrimAlign = "center"): ScrimAlignmentStyle {
  switch (align) {
    case "top":
      return { alignItems: "center", justifyContent: "flex-start" }
    case "bottom":
      return { alignItems: "center", justifyContent: "flex-end" }
    case "stretch":
      return { alignItems: "stretch", justifyContent: "flex-start" }
    case "center":
    default:
      return { alignItems: "center", justifyContent: "center" }
  }
}

/**
 * 子ラッパのスタイル。stretch 以外では何も足さない（= 子の内在サイズのまま）。
 * 背景色・padding・maxWidth・overflow は一切与えない。
 * ラッパは押下面 Pressable の兄弟として前面に置かれ、余白部分のタップは
 * `pointerEvents="box-none"` で押下面へ抜ける（コンポーネント側で付与）。
 */
export function resolveScrimContentStyle(align: ScrimAlign = "center"): ScrimContentStyle {
  return align === "stretch" ? { flex: 1, alignSelf: "stretch" } : {}
}
