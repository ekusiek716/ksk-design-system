/**
 * @vitest-environment jsdom
 *
 * CoachMarkOverlay のフォーカストラップ（issue #504）
 *
 * `role="dialog"` / `aria-modal="true"` を名乗る面なのに Tab で背面へ抜けられて
 * いた（宣言と実挙動の食い違い）。ここでは
 *   - 開いたら面の中の操作子へフォーカスが移る
 *   - Tab / Shift+Tab が面の中で循環し、背面のボタンへ出ない
 *   - Escape で離脱できる
 *   - 閉じたら開く前の位置へフォーカスが戻る
 * を検査する。操作子（スキップ / 次へ）は CoachMark が Portal で overlay の
 * 外へ描画するため、トラップが複数コンテナをまとめて扱えているかの検査でもある。
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"

import { CoachMarkOverlay } from "../src/components/patterns/coach-mark-overlay"
import { Dialog, DialogContent, DialogTitle } from "../src/components/ui/dialog"
import { Sheet, SheetContent, SheetTitle } from "../src/components/ui/sheet"

// jsdom には ResizeObserver / DOMRect の実体が無い（Radix Tooltip が使う）。
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}

let container: HTMLElement | null = null
let root: Root | null = null

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(ui)
  })
  // 初期フォーカスは requestAnimationFrame 越しに当たる
  act(() => {
    vi.advanceTimersByTime(50)
  })
}

function rerender(ui: React.ReactElement) {
  act(() => {
    root!.render(ui)
  })
  act(() => {
    vi.advanceTimersByTime(50)
  })
}

function pressTab(shiftKey = false) {
  act(() => {
    document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", shiftKey, bubbles: true, cancelable: true })
    )
  })
}

function pressEscape() {
  act(() => {
    document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })
    )
  })
}

function coachButtons(): HTMLButtonElement[] {
  const balloon = document.querySelector('[data-slot="coach-mark"]')
  expect(balloon, "コーチマークのバルーンが見つからない").not.toBeNull()
  return Array.from(balloon!.querySelectorAll("button"))
}

function coachOverlayRoot(): HTMLElement {
  const el = document.querySelector<HTMLElement>('[data-slot="coach-mark-overlay"]')
  expect(el, "coach-mark-overlay が見つからない").not.toBeNull()
  return el!
}

beforeEach(() => {
  vi.useFakeTimers()
  // jsdom は scrollIntoView を実装していない（overlay は step 切替で呼ぶ）
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {}
  }
  // jsdom は rAF を持つが fake timers 下でも動くよう setTimeout 実装に寄せる
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) =>
    setTimeout(() => cb(0), 16) as unknown as number
  )
  vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id))
})

afterEach(() => {
  if (root) {
    act(() => {
      root!.unmount()
    })
    root = null
  }
  if (container) {
    container.remove()
    container = null
  }
  document.body.innerHTML = ""
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function Scene({
  open,
  onSkip,
  onComplete,
  closeOnEsc,
  autoFocus,
}: {
  open: boolean
  onSkip?: () => void
  onComplete?: () => void
  closeOnEsc?: boolean
  autoFocus?: boolean
}) {
  return (
    <>
      <button type="button" id="behind-1">
        背面のボタン 1
      </button>
      <button type="button" id="behind-2">
        背面のボタン 2
      </button>
      <div id="target">対象</div>
      <CoachMarkOverlay
        open={open}
        closeOnEsc={closeOnEsc}
        autoFocus={autoFocus}
        steps={[
          { selector: "#target", title: "ここ", desc: "説明" },
          { selector: "#target", title: "つぎ", desc: "説明" },
        ]}
        onComplete={onComplete ?? (() => {})}
        onSkip={onSkip}
      />
    </>
  )
}

describe("CoachMarkOverlay のフォーカストラップ（#504）", () => {
  it("開くと面の中の操作子へフォーカスが移る", () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus")
    mount(<Scene open onSkip={() => {}} />)
    const buttons = coachButtons()
    expect(buttons.length).toBeGreaterThan(0)
    expect(document.activeElement).toBe(buttons[0])
    const initialFocusCalls = focus.mock.calls.filter((_, index) => focus.mock.contexts[index] === buttons[0])
    expect(initialFocusCalls.length).toBeGreaterThan(0)
    for (const args of initialFocusCalls) expect(args).toEqual([{ preventScroll: true }])
  })

  it("端での Tab / Shift+Tab が面の中で折り返し、背面のボタンへ抜けない", () => {
    mount(<Scene open onSkip={() => {}} />)
    const buttons = coachButtons()
    // スキップ + 次への 2 つ
    expect(buttons).toHaveLength(2)
    // 途中の Tab 移動はブラウザの既定動作（jsdom は動かさない）。トラップが
    // 介入するのは「端」と「面の外」だけなので、ここではその 2 つを見る。

    // 末尾からの Tab は先頭へ戻る（背面へ出ない）
    act(() => {
      buttons[1].focus()
    })
    pressTab()
    expect(document.activeElement).toBe(buttons[0])
    // 先頭からの Shift+Tab は末尾へ回る
    pressTab(true)
    expect(document.activeElement).toBe(buttons[1])
  })

  it("面の外の要素へフォーカスしても面の中へ引き戻される", () => {
    mount(<Scene open onSkip={() => {}} />)
    const behind = document.getElementById("behind-1") as HTMLButtonElement
    act(() => {
      behind.focus()
    })
    expect(coachOverlayRoot().contains(document.activeElement)).toBe(true)
  })

  it("Escape で onSkip を呼ぶ（closeOnEsc=false なら呼ばない）", () => {
    const onSkip = vi.fn()
    mount(<Scene open onSkip={onSkip} />)
    pressEscape()
    expect(onSkip).toHaveBeenCalledTimes(1)

    act(() => {
      root!.unmount()
    })
    root = null
    document.body.innerHTML = ""

    const onSkip2 = vi.fn()
    mount(<Scene open closeOnEsc={false} onSkip={onSkip2} />)
    pressEscape()
    expect(onSkip2).not.toHaveBeenCalled()
  })

  it("閉じると開く前のフォーカス位置へ戻す", () => {
    mount(<Scene open={false} onSkip={() => {}} />)
    const trigger = document.getElementById("behind-2") as HTMLButtonElement
    act(() => {
      trigger.focus()
    })
    rerender(<Scene open onSkip={() => {}} />)
    expect(document.activeElement).not.toBe(trigger)

    rerender(<Scene open={false} onSkip={() => {}} />)
    expect(document.activeElement).toBe(trigger)
  })

  it("autoFocus={false} は操作子を自動で選ばない（面自体にフォーカスを置く）", () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus")
    mount(<Scene open={false} onSkip={() => {}} />)
    const trigger = document.getElementById("behind-2") as HTMLButtonElement
    act(() => {
      trigger.focus()
    })
    rerender(<Scene open autoFocus={false} onSkip={() => {}} />)
    // スキップ / 次へは選ばない。ただし面の外に置いたままにもしない
    // （外に置くとトラップが成立しない。下のテスト参照）
    expect(coachButtons()).not.toContain(document.activeElement)
    expect(coachOverlayRoot().contains(document.activeElement)).toBe(true)
    const scopeFocus = focus.mock.contexts.findIndex((node) => node === document.activeElement)
    expect(scopeFocus).toBeGreaterThanOrEqual(0)
    expect(focus.mock.calls[scopeFocus]).toEqual([{ preventScroll: true }])
  })

  it("autoFocus={false} でもトラップは効く（面の外へ動かすと引き戻される）", () => {
    mount(<Scene open={false} onSkip={() => {}} />)
    const trigger = document.getElementById("behind-2") as HTMLButtonElement
    act(() => {
      trigger.focus()
    })
    rerender(<Scene open autoFocus={false} onSkip={() => {}} />)
    expect(coachOverlayRoot().contains(document.activeElement)).toBe(true)

    // 背面の別要素へフォーカスが動いた時点で面の中へ引き戻す
    act(() => {
      ;(document.getElementById("behind-1") as HTMLButtonElement).focus()
    })
    expect(coachOverlayRoot().contains(document.activeElement)).toBe(true)
  })

  it("開いている Dialog の上に重ねてもフォーカスを奪われない（#504 の入れ子）", () => {
    // 「先に開いている Dialog」→「あとからツアーを開く」という実際の順序で見る。
    // Radix のフォーカススコープは後から載った側が下を pause するので、
    // ツアーが下のダイアログへ引き戻されない。
    function Nested({ tourOpen }: { tourOpen: boolean }) {
      return (
        <>
          <Dialog open>
            <DialogContent description="下地のダイアログ">
              <DialogTitle>下地</DialogTitle>
              <button type="button" id="in-dialog">
                ダイアログ内のボタン
              </button>
            </DialogContent>
          </Dialog>
          <div id="target">対象</div>
          <CoachMarkOverlay
            open={tourOpen}
            steps={[{ selector: "#target", title: "ここ", desc: "説明" }]}
            onComplete={() => {}}
            onSkip={() => {}}
          />
        </>
      )
    }
    mount(<Nested tourOpen={false} />)
    expect(document.getElementById("in-dialog")).not.toBeNull()

    rerender(<Nested tourOpen />)
    const buttons = coachButtons()
    expect(buttons.length).toBeGreaterThan(0)
    // 下の Dialog の FocusScope に引き戻されず、コーチマークの操作子に居る
    expect(coachOverlayRoot().contains(document.activeElement)).toBe(true)

    // 端での Tab もコーチマークの中で折り返す（ダイアログへ出ない）
    act(() => {
      buttons[buttons.length - 1].focus()
    })
    pressTab()
    expect(coachOverlayRoot().contains(document.activeElement)).toBe(true)
  })
})

/**
 * Dialog / Sheet の上に重ねたツアーの「次へ」「スキップ」で下のモーダルが閉じない（issue #829）。
 *
 * ツアーは Dialog / Sheet の React ツリーの外（兄弟）に置かれるため、Radix の
 * DismissableLayer から見るとバルーンの押下は「外側クリック」になり、下の
 * モーダルの onOpenChange(false) が呼ばれていた。左クリック / タップの経路
 * （pointerdown → mousedown → pointerup → mouseup → click）を送り、
 * 下が開いたまま残ることを固定する。ツアーが無いときの外側クリックで
 * 閉じる（従来どおり）ことも合わせて見る。
 */
describe("CoachMarkOverlay を Dialog / Sheet に重ねたときの外側クリック（#829）", () => {
  const PointerEventCtor: typeof MouseEvent =
    (globalThis as { PointerEvent?: typeof MouseEvent }).PointerEvent ?? MouseEvent

  function leftClick(el: Element) {
    act(() => {
      el.dispatchEvent(new PointerEventCtor("pointerdown", { bubbles: true, cancelable: true, button: 0 }))
      el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 0 }))
      el.dispatchEvent(new PointerEventCtor("pointerup", { bubbles: true, cancelable: true, button: 0 }))
      el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, button: 0 }))
      el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }))
    })
    act(() => {
      vi.advanceTimersByTime(50)
    })
  }

  function coachButton(text: string): HTMLButtonElement {
    const btn = coachButtons().find((b) => b.textContent?.includes(text))
    expect(btn, `コーチマークの「${text}」が見つからない`).toBeDefined()
    return btn!
  }

  const steps = [
    { selector: "#in-modal", title: "1 つ目", desc: "説明 1" },
    { selector: "#in-modal", title: "2 つ目", desc: "説明 2" },
  ]

  type Kind = "dialog" | "sheet"

  function Underlay({ kind, onOpenChange }: { kind: Kind; onOpenChange: (open: boolean) => void }) {
    const [open, setOpen] = React.useState(true)
    const handle = (next: boolean) => {
      onOpenChange(next)
      setOpen(next)
    }
    const body = (
      <button type="button" id="in-modal">
        モーダル内のボタン
      </button>
    )
    return kind === "dialog" ? (
      <Dialog open={open} onOpenChange={handle}>
        <DialogContent description="下地のダイアログ" data-testid="underlay">
          <DialogTitle>下地</DialogTitle>
          {body}
        </DialogContent>
      </Dialog>
    ) : (
      <Sheet open={open} onOpenChange={handle}>
        <SheetContent side="bottom" description="下地のシート" data-testid="underlay">
          <SheetTitle>下地</SheetTitle>
          {body}
        </SheetContent>
      </Sheet>
    )
  }

  function Scene({
    kind,
    tourOpen,
    onOpenChange,
    onComplete = () => {},
    onSkip = () => {},
  }: {
    kind: Kind
    tourOpen: boolean
    onOpenChange: (open: boolean) => void
    onComplete?: () => void
    onSkip?: () => void
  }) {
    return (
      <>
        <button type="button" id="outside">
          外側のボタン
        </button>
        <Underlay kind={kind} onOpenChange={onOpenChange} />
        <CoachMarkOverlay open={tourOpen} steps={steps} onComplete={onComplete} onSkip={onSkip} />
      </>
    )
  }

  function underlay() {
    return document.querySelector('[data-testid="underlay"]')
  }

  for (const kind of ["dialog", "sheet"] as const) {
    it(`${kind}: 「次へ」で下が閉じず、ツアーだけが進む`, () => {
      const onOpenChange = vi.fn()
      mount(<Scene kind={kind} tourOpen={false} onOpenChange={onOpenChange} />)
      rerender(<Scene kind={kind} tourOpen onOpenChange={onOpenChange} />)
      expect(coachOverlayRoot().getAttribute("data-step")).toBe("1")

      leftClick(coachButton("次へ"))

      expect(onOpenChange).not.toHaveBeenCalled()
      expect(underlay()).not.toBeNull()
      expect(coachOverlayRoot().getAttribute("data-step")).toBe("2")
    })

    it(`${kind}: 「スキップ」で下が閉じず、ツアーだけが終わる`, () => {
      const onOpenChange = vi.fn()
      const onSkip = vi.fn()
      mount(<Scene kind={kind} tourOpen={false} onOpenChange={onOpenChange} onSkip={onSkip} />)
      rerender(<Scene kind={kind} tourOpen onOpenChange={onOpenChange} onSkip={onSkip} />)

      leftClick(coachButton("スキップ"))

      expect(onSkip).toHaveBeenCalledTimes(1)
      expect(onOpenChange).not.toHaveBeenCalled()
      expect(underlay()).not.toBeNull()
    })

    it(`${kind}: ツアーが無いときの外側クリックは従来どおり閉じる`, () => {
      const onOpenChange = vi.fn()
      mount(<Scene kind={kind} tourOpen={false} onOpenChange={onOpenChange} />)
      expect(underlay()).not.toBeNull()

      leftClick(document.getElementById("outside")!)

      expect(onOpenChange.mock.calls).toEqual([[false]])
      expect(underlay()).toBeNull()
    })
  }
})
