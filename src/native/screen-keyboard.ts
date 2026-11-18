/**
 * native Screen（scroll）が、入力中の欄をソフトキーボードの上へ送るための計算。
 *
 * 座標はすべて window 座標（measureInWindow と Keyboard イベントの endCoordinates.screenY）。
 * - iOS: キーボードの枠（screenY）は入力欄の上に出る帯（inputAccessoryView。数字キーボードの
 *   「完了」「次へ」）を含む。帯の分まで含めた上端より上へ欄を出せば、ボタンは欄に重ならない。
 * - Android: edge-to-edge（RN 0.81+ / targetSdk 35+ で既定）では、キーボードが出ても画面が縮まない。
 *   縮む環境（adjustResize が効く）では ScrollView の下端がキーボードより上にあるため、重なりは 0 になる。
 *   edge-to-edge でない場合の measureInWindow はステータスバーぶん小さく出るが、その場合は画面が縮むので
 *   重なりは負 → 0 に丸まり、余白を足しすぎることはない。
 */

export interface WindowSpan {
  /** window 座標の上端 */
  y: number
  height: number
}

/** ScrollView（本文）の下端がキーボードの上端より下に潜っている高さ。潜っていなければ 0 */
export function resolveKeyboardOverlap(scroll: WindowSpan, keyboardTop: number): number {
  return Math.max(0, scroll.y + scroll.height - keyboardTop)
}

export interface FocusedInputScrollInput {
  /** 本文の ScrollView の枠（window 座標） */
  scroll: WindowSpan
  /** 入力中の欄（window 座標。いまのスクロール位置での見えている位置） */
  input: WindowSpan
  /** キーボード（上の帯を含む）の上端（window 座標） */
  keyboardTop: number
  /** 欄とキーボードの上端・本文の上端とのあいだに空ける余白 */
  gap: number
  /**
   * 欄が見える範囲（本文の上端〜キーボードの上端）に収まらないほど高いとき（複数行の長文など）の扱い。
   * - "leave": 送らない。iOS は RN の automaticallyAdjustKeyboardInsets がカーソル位置まで送るので任せる
   * - "align-top": 欄の上端を見える範囲の上端へ合わせる（Android。カーソル追従の仕組みが無いため）
   */
  tallInput: "leave" | "align-top"
}

/**
 * 入力中の欄を「キーボードの上端から gap 上」まで送るためのスクロール量（正 = 下の中身を上へ送る）。
 * すでに見えていれば 0。本文の上端より上に隠れている欄は、上端から gap 下まで戻す（負）。
 */
export function resolveFocusedInputScrollDelta({
  scroll,
  input,
  keyboardTop,
  gap,
  tallInput,
}: FocusedInputScrollInput): number {
  const visibleTop = scroll.y
  const visibleBottom = Math.min(scroll.y + scroll.height, keyboardTop)
  const visibleHeight = visibleBottom - visibleTop
  if (!(visibleHeight > 0)) return 0
  if (input.height + gap * 2 > visibleHeight) {
    return tallInput === "align-top" ? input.y - gap - visibleTop : 0
  }
  const bottomOverflow = input.y + input.height + gap - visibleBottom
  if (bottomOverflow > 0) return bottomOverflow
  const topOverflow = input.y - gap - visibleTop
  if (topOverflow < 0) return topOverflow
  return 0
}
