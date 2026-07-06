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
import {
  decideSwipeGesture,
  computeFlickVelocity,
  decideSwipeDismiss,
  projectCloseAxisDelta,
  closeAxisTranslate,
} from "../src/components/ui/sheet"

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

describe("computeFlickVelocity — リリース速度（px/ms, 下方向が正）", () => {
  it("サンプルが 2 未満なら 0", () => {
    expect(computeFlickVelocity([], 100)).toBe(0)
    expect(computeFlickVelocity([{ y: 0, t: 0 }], 100)).toBe(0)
  })

  it("等速の下方向ドラッグは dy/dt を返す", () => {
    // 100ms ウィンドウ内、50px / 50ms = 1.0px/ms
    const samples = [
      { y: 0, t: 0 },
      { y: 25, t: 25 },
      { y: 50, t: 50 },
    ]
    expect(computeFlickVelocity(samples, 50)).toBeCloseTo(1.0)
  })

  it("上方向のフリックは負の速度", () => {
    const samples = [
      { y: 50, t: 0 },
      { y: 0, t: 50 },
    ]
    expect(computeFlickVelocity(samples, 50)).toBeCloseTo(-1.0)
  })

  it("ウィンドウ外（古い）サンプルは無視する", () => {
    // releaseT=300。直近 100ms (t>=200) には 1 点しか残らず → 0
    const samples = [
      { y: 0, t: 0 },
      { y: 80, t: 80 },
      { y: 100, t: 250 },
    ]
    expect(computeFlickVelocity(samples, 300)).toBe(0)
  })

  it("フリック後に静止してリリースすると速度は 0（誤発火しない）", () => {
    // 0〜50ms で速く動き、その後 500ms 静止して releaseT=550 でリリース
    const samples = [
      { y: 0, t: 0 },
      { y: 40, t: 25 },
      { y: 80, t: 50 },
    ]
    expect(computeFlickVelocity(samples, 550)).toBe(0)
  })

  it("dt が 0/負なら 0（同時刻サンプル）", () => {
    const samples = [
      { y: 0, t: 10 },
      { y: 50, t: 10 },
    ]
    expect(computeFlickVelocity(samples, 10)).toBe(0)
  })
})

describe("decideSwipeDismiss — リリース時の閉じ判定（距離 OR 速度）", () => {
  const H = 400 // sheetHeight → 距離閾値 120px

  it("距離が 30% 超なら速度に関係なく閉じる", () => {
    expect(decideSwipeDismiss(121, H, 0)).toBe(true)
  })

  it("距離が閾値未満でも、速い下方向フリックで閉じる", () => {
    // 距離 60px (<120) だが 0.8px/ms (>0.5) → 閉じる
    expect(decideSwipeDismiss(60, H, 0.8)).toBe(true)
  })

  it("距離も速度も閾値未満なら閉じない（スプリングバック）", () => {
    expect(decideSwipeDismiss(60, H, 0.3)).toBe(false)
  })

  it("速くても下方向ドラッグが無ければ閉じない（上フリック）", () => {
    expect(decideSwipeDismiss(0, H, 2.0)).toBe(false)
  })

  it("高さ不明（0）のときは 200px フォールバック閾値", () => {
    expect(decideSwipeDismiss(201, 0, 0)).toBe(true)
    expect(decideSwipeDismiss(150, 0, 0)).toBe(false)
  })

  it("閾値ちょうど（0.5px/ms）は閉じない（超過のみ）", () => {
    expect(decideSwipeDismiss(60, H, 0.5)).toBe(false)
  })
})

describe("projectCloseAxisDelta — side ドロワーの close 軸射影", () => {
  it("right ドロワー: 右移動(+dx)が close 正、縦は cross", () => {
    expect(projectCloseAxisDelta(40, 10, "right")).toEqual({ primary: 40, cross: 10 })
    // 左移動は close 負 → decideSwipeGesture が scroll に落とす
    expect(projectCloseAxisDelta(-40, 0, "right")).toEqual({ primary: -40, cross: 0 })
  })

  it("left ドロワー: 左移動(−dx)が close 正、縦は cross", () => {
    expect(projectCloseAxisDelta(-40, 10, "left")).toEqual({ primary: 40, cross: 10 })
    expect(projectCloseAxisDelta(40, 0, "left")).toEqual({ primary: -40, cross: 0 })
  })

  it("射影後は decideSwipeGesture でそのまま判定できる（atStart=true）", () => {
    // right ドロワーを右へ横優勢ドラッグ → drag
    const r = projectCloseAxisDelta(40, 8, "right")
    expect(decideSwipeGesture(r.primary, r.cross, true)).toBe("drag")
    // 縦優勢は本文スクロールへ
    const v = projectCloseAxisDelta(8, 40, "right")
    expect(decideSwipeGesture(v.primary, v.cross, true)).toBe("scroll")
    // 逆方向（右ドロワーを左へ）は close 負 → scroll
    const back = projectCloseAxisDelta(-40, 0, "right")
    expect(decideSwipeGesture(back.primary, back.cross, true)).toBe("scroll")
  })
})

describe("closeAxisTranslate — close 軸ドラッグ量の符号付き translateX", () => {
  it("right は正方向、left は負方向へ寄せる", () => {
    expect(closeAxisTranslate(30, "right")).toBe(30)
    expect(closeAxisTranslate(30, "left")).toBe(-30)
    expect(closeAxisTranslate(0, "right")).toBe(0)
  })
})
