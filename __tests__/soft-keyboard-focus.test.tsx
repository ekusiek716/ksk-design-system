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
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { Home2, User } from "iconsax-reactjs"

import { MobileTabBar } from "../src/components/patterns/commerce/mobile-tab-bar"
import { MobileFloatingActionButton } from "../src/components/patterns/mobile-floating-action-button"
import { isSoftKeyboardTarget } from "../src/lib/use-soft-keyboard-focus"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const TABS = [
  { key: "home", label: "ホーム", Icon: Home2 },
  { key: "me", label: "マイ", Icon: User },
]

let coarse = true
const originalMatchMedia = window.matchMedia
let container: HTMLDivElement
let root: Root

beforeEach(() => {
  coarse = true
  window.matchMedia = ((query: string) => ({
    matches: query === "(pointer: coarse)" ? coarse : false,
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

function Page({ behavior = "hide" as "hide" | "lift" | "stay", inputType = "text" }) {
  return (
    <>
      <input aria-label="名前" type={inputType} data-testid="field" />
      <button type="button" data-testid="plain">ボタン</button>
      <MobileTabBar tabs={TABS} activeTab="home" onSelect={() => {}} keyboardBehavior={behavior} />
      <MobileFloatingActionButton label="追加" keyboardBehavior={behavior} />
    </>
  )
}

const nav = () => container.querySelector<HTMLElement>('[data-slot="bottom-nav-pill"]')!
const fab = () => container.querySelector<HTMLElement>('[data-slot="mobile-floating-action-button"]')!
const isHidden = (el: HTMLElement) => el.className.split(/\s+/).includes("invisible")

describe("keyboardBehavior=\"hide\" の入力フォーカス判定（#700）", () => {
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

  it("フォーカスがどこにも無くなっても戻る（blur）", () => {
    renderUi(<Page />)
    const field = container.querySelector<HTMLInputElement>('[data-testid="field"]')!
    act(() => field.focus())
    expect(isHidden(nav())).toBe(true)
    act(() => field.blur())
    expect(isHidden(nav())).toBe(false)
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
