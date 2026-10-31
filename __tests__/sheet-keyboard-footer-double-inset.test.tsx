/**
 * @vitest-environment jsdom
 *
 * KeyboardAwareSheetFooter の二重補正（Issue #788）。
 *
 * ボトムシートはキーボード表示中に自分の `bottom` をキーボード高さ分持ち上げる。
 * その中に置いた KeyboardAwareSheetFooter（既定 behavior="fixed"）も同じ高さを
 * `sticky` の `bottom`（--ksk-keyboard-inset）に入れていたため、補正が二重に
 * かかり、フッターがシート下端から最大キーボード高さ分だけ上へずれて本文や
 * 見出しに被っていた。
 *
 * 固定する契約:
 *  - 持ち上がったシート（BottomSheetFrame / swipeToClose / snap / float）の中では
 *    フッターの --ksk-keyboard-inset は 0px（シート側の持ち上げだけが効く）
 *  - シートの Content は持ち上げ中だけ data-keyboard-lifted を出す
 *  - シートの外では従来どおりキーボード高さを使う
 *  - キーボードが無いときは従来どおり 0px
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { Sheet, SheetContent, SheetTitle } from "../src/components/ui/sheet"
import { BottomSheetFrame } from "../src/components/patterns/bottom-sheet-frame"
import { DetailSheetScaffold, DetailSheetHeader } from "../src/components/patterns/detail-sheet-scaffold"
import { KeyboardAwareSheetFooter } from "../src/components/patterns/keyboard-aware-sheet-footer"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const originalVV = Object.getOwnPropertyDescriptor(window, "visualViewport")
const originalInner = window.innerHeight
const vv = {
  height: 500,
  offsetTop: 0,
  addEventListener: () => {},
  removeEventListener: () => {},
}
let container: HTMLDivElement | null = null
let root: Root | null = null

beforeEach(() => {
  vv.height = 500 // innerHeight 800 → キーボード 300px
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 })
  Object.defineProperty(window, "visualViewport", { configurable: true, value: vv })
})

afterEach(() => {
  if (root) act(() => root!.unmount())
  root = null
  container?.remove()
  container = null
  document.body.innerHTML = ""
  Object.defineProperty(window, "innerHeight", { configurable: true, value: originalInner })
  if (originalVV) Object.defineProperty(window, "visualViewport", originalVV)
  else delete (window as { visualViewport?: unknown }).visualViewport
})

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root!.render(ui))
}

const footer = () =>
  document.querySelector<HTMLElement>('[data-slot="keyboard-aware-sheet-footer"]')!
const content = () => document.querySelector<HTMLElement>('[data-slot="sheet-content"]')!
const footerInset = () => footer().style.getPropertyValue("--ksk-keyboard-inset")

function Footer() {
  return (
    <KeyboardAwareSheetFooter>
      <button type="button">保存</button>
    </KeyboardAwareSheetFooter>
  )
}

describe("KeyboardAwareSheetFooter の二重補正（Issue #788）", () => {
  it("BottomSheetFrame + DetailSheetScaffold の中では、キーボード表示中もフッターの inset は 0px", () => {
    mount(
      <Sheet open>
        <BottomSheetFrame preset="mobile-form">
          <DetailSheetScaffold header={<DetailSheetHeader title="編集" />} footer={<Footer />}>
            <input />
          </DetailSheetScaffold>
        </BottomSheetFrame>
      </Sheet>
    )
    // シート側は持ち上がっている
    expect(content().style.bottom).toBe("300px")
    expect(content().hasAttribute("data-keyboard-lifted")).toBe(true)
    // フッターは持ち上げを重ねない（hide 判定用の data-keyboard-open は従来どおり）
    expect(footerInset()).toBe("0px")
    expect(footer().hasAttribute("data-keyboard-open")).toBe(true)
  })

  it.each([
    ["swipeToClose の bottom", { side: "bottom", swipeToClose: true }, {}],
    ["bottom-glass", { side: "bottom-glass" }, {}],
    ["float", { side: "float" }, {}],
    ["snap", { side: "bottom" }, { snapPoints: [0.5, 0.9] }],
  ] as const)("%s シートの中でも inset は 0px", (_name, contentProps, sheetProps) => {
    mount(
      <Sheet open {...sheetProps}>
        <SheetContent {...contentProps}>
          <SheetTitle>t</SheetTitle>
          <input />
          <Footer />
        </SheetContent>
      </Sheet>
    )
    expect(content().style.bottom).not.toBe("")
    expect(content().hasAttribute("data-keyboard-lifted")).toBe(true)
    expect(footerInset()).toBe("0px")
  })

  it("持ち上げない side（right ドロワー）の中では従来どおりキーボード高さを使う", () => {
    mount(
      <Sheet open>
        <SheetContent side="right">
          <SheetTitle>t</SheetTitle>
          <Footer />
        </SheetContent>
      </Sheet>
    )
    expect(content().hasAttribute("data-keyboard-lifted")).toBe(false)
    expect(footerInset()).toBe("300px")
  })

  it("シートの外（全画面ページの下端固定など）では従来どおりキーボード高さを使う", () => {
    mount(<Footer />)
    expect(footerInset()).toBe("300px")
  })

  it("キーボードが無いときは、シートの中でも data-keyboard-lifted を出さず inset は 0px", () => {
    vv.height = 800
    mount(
      <Sheet open>
        <BottomSheetFrame preset="mobile-form">
          <DetailSheetScaffold header={<DetailSheetHeader title="編集" />} footer={<Footer />}>
            <input />
          </DetailSheetScaffold>
        </BottomSheetFrame>
      </Sheet>
    )
    expect(content().hasAttribute("data-keyboard-lifted")).toBe(false)
    expect(footerInset()).toBe("0px")
  })
})
