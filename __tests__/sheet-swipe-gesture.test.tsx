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
 * 後半は jsdom で実際にシートを描き、タッチ / マウスの経路を通しで確かめる
 * （#822 の ref 合成、#787 の除外対象）。
 *
 * 実行: npm run test
 *
 * @vitest-environment jsdom
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, it, expect, vi } from "vitest"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  decideSwipeGesture,
  computeFlickVelocity,
  decideSwipeDismiss,
  projectCloseAxisDelta,
  closeAxisTranslate,
  isSwipeExcludedTarget,
} from "../src/components/ui/sheet"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

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

// ---------------------------------------------------------------------------
// ここから jsdom で描画して確かめる
// ---------------------------------------------------------------------------

let container: HTMLDivElement | null = null
let root: Root | null = null

afterEach(() => {
  if (root) act(() => root!.unmount())
  root = null
  container?.remove()
  container = null
  document.body.innerHTML = ""
  vi.restoreAllMocks()
})

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root!.render(ui))
  return document.querySelector<HTMLElement>('[data-slot="sheet-content"]')!
}

/** jsdom には Touch のコンストラクタが無いので、touches を後付けした Event を投げる。 */
function touch(target: Element, type: string, x: number, y: number) {
  const ev = new Event(type, { bubbles: true, cancelable: true })
  const point = { clientX: x, clientY: y, target }
  Object.defineProperty(ev, "touches", {
    value: type === "touchend" || type === "touchcancel" ? [] : [point],
  })
  act(() => {
    target.dispatchEvent(ev)
  })
  return ev
}

/** マウスの pointer イベント（jsdom には PointerEvent が無いので MouseEvent で代用）。 */
function mouse(target: Element, type: string, x: number, y: number, buttons = 1) {
  const ev = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    button: 0,
    buttons,
  })
  Object.defineProperty(ev, "pointerType", { value: "mouse" })
  Object.defineProperty(ev, "pointerId", { value: 1 })
  act(() => {
    target.dispatchEvent(ev)
  })
  return ev
}

function mouseSwipe(target: Element, from: [number, number], to: [number, number]) {
  mouse(target, "pointerdown", from[0], from[1])
  const steps = 5
  for (let i = 1; i <= steps; i++) {
    mouse(
      target,
      "pointermove",
      from[0] + ((to[0] - from[0]) * i) / steps,
      from[1] + ((to[1] - from[1]) * i) / steps
    )
  }
  mouse(target, "pointerup", to[0], to[1], 0)
}

function touchSwipe(target: Element, from: [number, number], to: [number, number]) {
  touch(target, "touchstart", from[0], from[1])
  const steps = 5
  for (let i = 1; i <= steps; i++) {
    touch(
      target,
      "touchmove",
      from[0] + ((to[0] - from[0]) * i) / steps,
      from[1] + ((to[1] - from[1]) * i) / steps
    )
  }
  touch(target, "touchend", to[0], to[1])
}

describe("swipeToClose に consumer の ref を渡してもタッチで閉じられる（Issue #822）", () => {
  it.each([
    ["bottom", [100, 100], [100, 350]],
    ["right", [100, 100], [350, 100]],
    ["left", [350, 100], [100, 100]],
  ] as const)("%s: ref 付きでもタッチリスナが付き、スワイプで onOpenChange(false)", (side, from, to) => {
    const onOpenChange = vi.fn()
    const ref = React.createRef<HTMLDivElement>()
    const content = mount(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent side={side} swipeToClose ref={ref}>
          <SheetTitle>t</SheetTitle>
          <p data-testid="body">本文</p>
        </SheetContent>
      </Sheet>
    )
    expect(ref.current).toBe(content)
    // jsdom は offsetHeight / offsetWidth が 0 なので、距離の閾値は 200px の既定。
    touchSwipe(content.querySelector('[data-testid="body"]')!, from, to)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

// ---------------------------------------------------------------------------
// #787: 子要素が自分で操作を持つ場所から始めたジェスチャは閉じドラッグにしない
// ---------------------------------------------------------------------------

describe("isSwipeExcludedTarget — 子要素が操作を持つ場所の判定（Issue #787）", () => {
  function build(html: string) {
    const root = document.createElement("div")
    root.innerHTML = html
    document.body.appendChild(root)
    return root
  }

  it("input / textarea / select / contenteditable / role=slider / data-no-swipe の中は除外", () => {
    const root = build(`
      <input id="i" /><textarea id="t"></textarea><select id="s"></select>
      <div contenteditable="true"><span id="ce">x</span></div>
      <div role="slider"><span id="thumb"></span></div>
      <span data-slot="slider"><span id="track"></span></span>
      <div data-no-swipe><p id="ns">x</p></div>
    `)
    for (const id of ["i", "t", "s", "ce", "thumb", "track", "ns"]) {
      expect(isSwipeExcludedTarget(root.querySelector(`#${id}`), root)).toBe(true)
    }
  })

  it("ふつうの本文・contenteditable=false・boundary の外の祖先は除外しない", () => {
    const outer = build(`<div data-no-swipe><div id="boundary"><p id="p">x</p></div></div>`)
    const boundary = outer.querySelector<HTMLElement>("#boundary")!
    expect(isSwipeExcludedTarget(outer.querySelector("#p"), boundary)).toBe(false)
    const root = build(`<div contenteditable="false"><span id="ro">x</span></div><p id="body">x</p>`)
    expect(isSwipeExcludedTarget(root.querySelector("#ro"), root)).toBe(false)
    expect(isSwipeExcludedTarget(root.querySelector("#body"), root)).toBe(false)
    expect(isSwipeExcludedTarget(null, root)).toBe(false)
  })

  it("ドラッグハンドル（data-sheet-drag-handle）の中は常に掴める", () => {
    const root = build(`<div data-no-swipe><div data-sheet-drag-handle><span id="h"></span></div></div>`)
    expect(isSwipeExcludedTarget(root.querySelector("#h"), root)).toBe(false)
  })
})

describe("swipeToClose（bottom）: 入力欄・文字選択・Slider から始めたドラッグでは閉じない（Issue #787）", () => {
  function mountBottom(onOpenChange: (open: boolean) => void) {
    return mount(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent side="bottom" swipeToClose>
          <SheetTitle>メモ</SheetTitle>
          <textarea data-testid="textarea" defaultValue="会議メモ" />
          <div role="slider" aria-valuenow={10} data-testid="slider" />
          <div data-no-swipe data-testid="no-swipe">独自ジェスチャ</div>
          <p data-testid="body">本文</p>
        </SheetContent>
      </Sheet>
    )
  }

  it.each(["textarea", "slider", "no-swipe"])("%s の上からマウスで真下へ 250px ドラッグしても閉じず、動かない", (id) => {
    const onOpenChange = vi.fn()
    const content = mountBottom(onOpenChange)
    mouseSwipe(content.querySelector(`[data-testid="${id}"]`)!, [100, 100], [100, 350])
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(content.style.transform).toBe("translate3d(0, 0px, 0)")
  })

  it("タッチでも textarea の上から始めたドラッグでは閉じない", () => {
    const onOpenChange = vi.fn()
    const content = mountBottom(onOpenChange)
    touchSwipe(content.querySelector('[data-testid="textarea"]')!, [100, 100], [100, 350])
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("マウスで本文の文字を選択しながらのドラッグでは閉じない", () => {
    const onOpenChange = vi.fn()
    const content = mountBottom(onOpenChange)
    vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => "本文" } as Selection)
    mouseSwipe(content.querySelector('[data-testid="body"]')!, [100, 100], [100, 350])
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("除外対象に当たらない本文からの従来のスワイプ閉じは変わらない（マウス・タッチ）", () => {
    const onMouse = vi.fn()
    const content = mountBottom(onMouse)
    mouseSwipe(content.querySelector('[data-testid="body"]')!, [100, 100], [100, 350])
    expect(onMouse).toHaveBeenCalledWith(false)

    act(() => root!.unmount())
    root = null
    document.body.innerHTML = ""
    const onTouch = vi.fn()
    const content2 = mountBottom(onTouch)
    touchSwipe(content2.querySelector('[data-testid="body"]')!, [100, 100], [100, 350])
    expect(onTouch).toHaveBeenCalledWith(false)
  })

  it("ドラッグハンドルからは、文字が選択されていても常に閉じられる", () => {
    const onOpenChange = vi.fn()
    const content = mountBottom(onOpenChange)
    vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => "本文" } as Selection)
    mouseSwipe(content.querySelector("[data-sheet-drag-handle]")!, [100, 100], [100, 350])
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

describe("swipeToClose（side ドロワー）: Slider・横スクロール領域から始めたドラッグでは閉じない（Issue #787）", () => {
  function mountDrawer(side: "left" | "right", onOpenChange: (open: boolean) => void, scrollLeft = 0) {
    const content = mount(
      <Sheet open onOpenChange={onOpenChange}>
        <SheetContent side={side} swipeToClose>
          <SheetTitle>絞り込み</SheetTitle>
          <div role="slider" aria-valuenow={10} data-testid="slider" />
          <div data-testid="scroller" style={{ overflowX: "auto" }}>
            <span data-testid="chip">チップ</span>
          </div>
          <p data-testid="body">本文</p>
        </SheetContent>
      </Sheet>
    )
    // jsdom はレイアウトしないので、横にはみ出した状態を手で作る。
    const scroller = content.querySelector<HTMLElement>('[data-testid="scroller"]')!
    Object.defineProperty(scroller, "scrollWidth", { configurable: true, value: 600 })
    Object.defineProperty(scroller, "clientWidth", { configurable: true, value: 200 })
    Object.defineProperty(scroller, "scrollLeft", { configurable: true, writable: true, value: scrollLeft })
    return content
  }

  it.each([
    ["right", [100, 100], [350, 100]],
    ["left", [350, 100], [100, 100]],
  ] as const)("%s: Slider のつまみを閉じる方向へドラッグしても閉じない（タッチ・マウス）", (side, from, to) => {
    const onOpenChange = vi.fn()
    const content = mountDrawer(side, onOpenChange)
    const slider = content.querySelector('[data-testid="slider"]')!
    touchSwipe(slider, from, to)
    mouseSwipe(slider, from, to)
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(content.style.transform).toBe("translate3d(0px, 0, 0)")
  })

  it("right: 指の方向（右）へまだスクロールできる横スクロール領域の中では閉じない", () => {
    const onOpenChange = vi.fn()
    // scrollLeft > 0 → 右へドラッグすると先頭側へ戻れる
    const content = mountDrawer("right", onOpenChange, 120)
    touchSwipe(content.querySelector('[data-testid="chip"]')!, [100, 100], [350, 100])
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("right: 横スクロールが先頭（scrollLeft 0）なら、閉じる方向のドラッグはドロワーが受ける", () => {
    const onOpenChange = vi.fn()
    const content = mountDrawer("right", onOpenChange, 0)
    touchSwipe(content.querySelector('[data-testid="chip"]')!, [100, 100], [350, 100])
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("left: 指の方向（左）へまだスクロールできる横スクロール領域の中では閉じない", () => {
    const onOpenChange = vi.fn()
    const content = mountDrawer("left", onOpenChange, 0)
    touchSwipe(content.querySelector('[data-testid="chip"]')!, [350, 100], [100, 100])
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("left: 横スクロールが末尾なら、閉じる方向のドラッグはドロワーが受ける", () => {
    const onOpenChange = vi.fn()
    const content = mountDrawer("left", onOpenChange, 400)
    touchSwipe(content.querySelector('[data-testid="chip"]')!, [350, 100], [100, 100])
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("除外対象に当たらない本文からの従来のスワイプ閉じは変わらない", () => {
    const onOpenChange = vi.fn()
    const content = mountDrawer("right", onOpenChange)
    touchSwipe(content.querySelector('[data-testid="body"]')!, [100, 100], [350, 100])
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
