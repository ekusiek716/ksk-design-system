/**
 * Sheet — full-surface swipe-to-close gesture decision
 *
 * `<SheetContent side="bottom" swipeToClose>` must be dismissible by swiping
 * down anywhere on the sheet, not only on the top drag handle. On touch
 * devices the scrollable body has an effective `touch-action: pan-y`, so the
 * browser claims a vertical drag as a scroll/overscroll and cancels the
 * pointer gesture before the drag commits — the sheet only "twitched" and
 * sprang back, and only the handle (which has `touch-action: none`) worked.
 *
 * The fix drives the gesture from a non-passive `touchmove` listener and
 * classifies intent via the pure `decideSwipeGesture` helper. Here we verify
 * that classification (DOM-independent, runs under the SSR test setup).
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { decideSwipeGesture } from "../src/components/ui/sheet"

describe("decideSwipeGesture — 全面スワイプ閉じ判定", () => {
  it("6px のスロップ未満は未確定（null）", () => {
    expect(decideSwipeGesture(0, 0, true)).toBeNull()
    expect(decideSwipeGesture(5, 5, true)).toBeNull()
    expect(decideSwipeGesture(-5, 3, true)).toBeNull()
  })

  it("先頭での下方向・縦優勢ジェスチャは drag（本文上でも閉じられる）", () => {
    expect(decideSwipeGesture(40, 0, true)).toBe("drag")
    expect(decideSwipeGesture(40, 10, true)).toBe("drag")
  })

  it("先頭でなければ下方向でも scroll（本文スクロールを奪わない）", () => {
    expect(decideSwipeGesture(40, 0, false)).toBe("scroll")
  })

  it("上方向は scroll（閉じドラッグは下方向のみ）", () => {
    expect(decideSwipeGesture(-40, 0, true)).toBe("scroll")
  })

  it("横方向優勢は scroll（水平ジェスチャは本文に渡す）", () => {
    expect(decideSwipeGesture(20, 40, true)).toBe("scroll")
  })

  it("スロップ超過の横移動は、先頭でも scroll", () => {
    expect(decideSwipeGesture(0, 40, true)).toBe("scroll")
  })
})
