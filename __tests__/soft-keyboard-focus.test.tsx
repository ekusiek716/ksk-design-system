/**
 * @vitest-environment jsdom
 *
 * keyboardBehavior="hide" が入力欄のフォーカスでも隠す（issue #700）。
 *
 * visualViewport が縮む前（iOS Safari のフォーカス直後）や、縮まない端末（Android の一部）では
 * キーボード検知が発火しない。タッチ主体の端末（`(pointer: coarse)`）でソフトキーボードを出す
 * 入力欄にフォーカスがある間は、検知に依存せず隠す。マウス主体の PC では隠さない。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Home2, User } from "iconsax-reactjs"

import { MobileTabBar } from "../src/components/patterns/commerce/mobile-tab-bar"
import { MobileFloatingActionButton } from "../src/components/patterns/mobile-floating-action-button"
import { SOFT_KEYBOARD_DEVICE_QUERY, isSoftKeyboardTarget } from "../src/lib/use-soft-keyboard-focus"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const TABS = [
  { key: "home", label: "ホーム", Icon: Home2 },
  { key: "me", label: "マイ", Icon: User },
]

let coarse = true
let hoverNone = true
const originalMatchMedia = window.matchMedia
let container: HTMLDivElement
let root: Root

beforeEach(() => {
  coarse = true
  hoverNone = true
  window.matchMedia = ((query: string) => ({
    matches: query === SOFT_KEYBOARD_DEVICE_QUERY ? coarse && hoverNone : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  window.matchMedia = originalMatchMedia
})

function renderUi(ui: React.ReactElement) {
  act(() => root.render(ui))
}

function Page({ behavior = "hide" as "hide" | "lift" | "stay", inputType = "text", hideOnInputFocus = true }) {
  return (
    <>
      <input aria-label="名前" type={inputType} data-testid="field" />
      <button type="button" data-testid="plain">ボタン</button>
      <MobileTabBar tabs={TABS} activeTab="home" onSelect={() => {}} keyboardBehavior={behavior} hideOnInputFocus={hideOnInputFocus} />
      <MobileFloatingActionButton label="追加" keyboardBehavior={behavior} hideOnInputFocus={hideOnInputFocus} />
    </>
  )
}

const nav = () => container.querySelector<HTMLElement>('[data-slot="bottom-nav-pill"]')!
const fab = () => container.querySelector<HTMLElement>('[data-slot="mobile-floating-action-button"]')!
const isHidden = (el: HTMLElement) => el.className.split(/\s+/).includes("invisible")

describe("keyboardBehavior=\"hide\" の入力フォーカス判定（#700）", () => {
  it("focus fallback を無効にしても viewport の keyboard 検知では隠す", async () => {
    renderUi(<Page hideOnInputFocus={false} />)
    act(() => container.querySelector<HTMLInputElement>('[data-testid="field"]')!.focus())
    expect(isHidden(nav())).toBe(false)
    expect(isHidden(fab())).toBe(false)
    await act(async () => { document.documentElement.setAttribute("data-kb-open", "") })
    expect(isHidden(nav())).toBe(true)
    expect(isHidden(fab())).toBe(true)
    await act(async () => { document.documentElement.removeAttribute("data-kb-open") })
    expect(isHidden(nav())).toBe(false)
    expect(isHidden(fab())).toBe(false)
  })

  it("タッチ端末でテキスト入力欄にフォーカスすると隠れ、外すと戻る", () => {
    renderUi(<Page />)
    expect(isHidden(nav())).toBe(false)
    expect(isHidden(fab())).toBe(false)

    act(() => container.querySelector<HTMLInputElement>('[data-testid="field"]')!.focus())
    expect(isHidden(nav())).toBe(true)
    expect(isHidden(fab())).toBe(true)

    act(() => container.querySelector<HTMLButtonElement>('[data-testid="plain"]')!.focus())
    expect(isHidden(nav())).toBe(false)
    expect(isHidden(fab())).toBe(false)
  })

  it("フォーカスがどこにも無くなったら、次のフレームで実際のフォーカス先を見て戻す（blur）", async () => {
    renderUi(<Page />)
    const field = container.querySelector<HTMLInputElement>('[data-testid="field"]')!
    act(() => field.focus())
    expect(isHidden(nav())).toBe(true)
    act(() => field.blur())
    // relatedTarget が null の時点では即断しない
    expect(isHidden(nav())).toBe(true)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })
    expect(isHidden(nav())).toBe(false)
  })

  it("relatedTarget が null でも、次のフレームでまだ入力欄にフォーカスがあれば隠したまま", async () => {
    renderUi(<Page />)
    const field = container.querySelector<HTMLInputElement>('[data-testid="field"]')!
    act(() => field.focus())
    act(() => {
      field.dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: null }))
    })
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50))
    })
    expect(document.activeElement).toBe(field)
    expect(isHidden(nav())).toBe(true)
  })

  it("coarse でも hover できるポインターではフォーカスだけでは隠さない", () => {
    hoverNone = false
    renderUi(<Page />)
    act(() => container.querySelector<HTMLInputElement>('[data-testid="field"]')!.focus())
    expect(isHidden(nav())).toBe(false)
    expect(isHidden(fab())).toBe(false)
  })

  it("隠れても transition-all のままなので invisible でフェードが切れない", () => {
    renderUi(<Page />)
    act(() => container.querySelector<HTMLInputElement>('[data-testid="field"]')!.focus())
    for (const el of [nav(), fab()]) {
      const classes = el.className.split(/\s+/)
      expect(classes).toContain("invisible")
      expect(classes).toContain("opacity-0")
      expect(classes).toContain("transition-all")
    }
  })

  it("SSR（renderToString）で描画でき、隠さない状態で出る", () => {
    const html = renderToString(<Page />)
    expect(html).toContain('data-slot="bottom-nav-pill"')
    expect(html).not.toMatch(/class="[^"]*\binvisible\b/)
  })

  it("アンマウントでリスナーを外す / keyboardBehavior が hide 以外なら付けない", () => {
    const add = vi.spyOn(document, "addEventListener")
    const remove = vi.spyOn(document, "removeEventListener")
    renderUi(<Page behavior="stay" />)
    expect(add.mock.calls.filter(([type]) => type === "focusin").length).toBe(0)
    renderUi(<Page />)
    const added = add.mock.calls.filter(([type]) => type === "focusin" || type === "focusout").length
    expect(added).toBe(4) // タブバー + FAB × focusin / focusout
    act(() => root.render(<></>))
    const removed = remove.mock.calls.filter(([type]) => type === "focusin" || type === "focusout").length
    expect(removed).toBe(added)
    add.mockRestore()
    remove.mockRestore()
  })

  it("マウス主体の端末（pointer: fine）ではフォーカスだけでは隠さない", () => {
    coarse = false
    renderUi(<Page />)
    act(() => container.querySelector<HTMLInputElement>('[data-testid="field"]')!.focus())
    expect(isHidden(nav())).toBe(false)
    expect(isHidden(fab())).toBe(false)
  })

  it("lift / stay はフォーカスで隠さない（従来どおり）", () => {
    renderUi(<Page behavior="stay" />)
    act(() => container.querySelector<HTMLInputElement>('[data-testid="field"]')!.focus())
    expect(isHidden(nav())).toBe(false)
    expect(isHidden(fab())).toBe(false)
  })

  it("キーボードを出さない input（checkbox 等）へのフォーカスでは隠さない", () => {
    renderUi(<Page inputType="checkbox" />)
    act(() => container.querySelector<HTMLInputElement>('[data-testid="field"]')!.focus())
    expect(isHidden(nav())).toBe(false)
  })
})

describe("isSoftKeyboardTarget（#700）", () => {
  const make = (html: string) => {
    const host = document.createElement("div")
    host.innerHTML = html
    return host.firstElementChild
  }
  it("テキスト系 input / textarea / contenteditable は true", () => {
    for (const html of [
      "<input>",
      '<input type="search">',
      '<input type="email">',
      '<input type="tel">',
      '<input type="number">',
      '<input type="password">',
      "<textarea></textarea>",
      '<div contenteditable="true"></div>',
      "<div contenteditable></div>",
    ]) {
      expect(isSoftKeyboardTarget(make(html)), html).toBe(true)
    }
  })
  it("contenteditable=false の境界を飛び越えず、内側の明示的な再有効化は尊重する", () => {
    const host = make('<div contenteditable="true"><div contenteditable="false"><button>操作</button><span contenteditable="true">編集</span></div></div>')!
    expect(isSoftKeyboardTarget(host.querySelector("button"))).toBe(false)
    expect(isSoftKeyboardTarget(host.querySelector("span"))).toBe(true)
    expect(isSoftKeyboardTarget(host)).toBe(true)
  })
  it("ブラウザが isContentEditable=false と判定した要素を属性で再び有効にしない", () => {
    const host = make('<div contenteditable="true"><button contenteditable="false">操作</button></div>')!
    const target = host.querySelector("button")!
    Object.defineProperty(target, "isContentEditable", { value: false })
    expect(isSoftKeyboardTarget(target)).toBe(false)
  })
  it("キーボードを出さない要素は false", () => {
    for (const html of [
      '<input type="checkbox">',
      '<input type="radio">',
      '<input type="range">',
      '<input type="date">',
      '<input type="file">',
      "<input readonly>",
      "<input disabled>",
      '<input inputmode="none">',
      "<textarea readonly></textarea>",
      '<div contenteditable="false"></div>',
      "<button></button>",
    ]) {
      expect(isSoftKeyboardTarget(make(html)), html).toBe(false)
    }
    expect(isSoftKeyboardTarget(null)).toBe(false)
  })
})
