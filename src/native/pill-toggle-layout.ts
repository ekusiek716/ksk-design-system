// native PillToggle の「文字の大きさに合わせた並べ方」（issue #861）。
// 部品から切り出しているのは、RN を起動しない単体テストで境界値を固定するため（公開 API ではない）。

/**
 * 項目の見た目の高さの下限（Web の pill trigger `h-9` と同じ 36）。
 * 文字が大きいときはこれを下限に伸ばす（旧: `height: 36` 固定で、文字が枠からはみ出して隣と重なった）。
 */
export const PILL_TOGGLE_ITEM_MIN_HEIGHT = 36

/**
 * 横に並べたままにするか、縦に積むかを決める。
 *
 * ラベル 1 行の高さ（`label.sm` の行の高さ 18 × OS の文字の倍率）が項目の高さ 36 を超えたら縦に積む。
 * RN の `Text` は既定で lineHeight にも倍率が掛かるので、行の高さ × 倍率が実際の 1 行の高さになる。
 * 枠の高さは固定値に詰められて返るため、`measureInWindow` ではこのはみ出しを検出できない。
 *
 * iOS の実測（iPhone 16e シミュレーター・2026-11-13）: 標準の最大 1.353 / アクセシビリティの中 1.786 は
 * 横のまま（行 24 / 32）、大 2.143 / 特大 2.643 / 最大 3.571 で縦（行 39 / 48 / 64）。
 */
export function shouldStackPillToggle(fontScale: number, lineHeight: number): boolean {
  if (!Number.isFinite(fontScale) || fontScale <= 0) return false
  return lineHeight * fontScale > PILL_TOGGLE_ITEM_MIN_HEIGHT
}
