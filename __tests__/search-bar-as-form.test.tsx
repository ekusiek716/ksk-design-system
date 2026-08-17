/**
 * @vitest-environment jsdom
 *
 * issue #362: SearchBar に asForm / enterKeyHint を追加する。
 *
 * - asForm=false（既定）: 現行と DOM が変わらないこと（enterKeyHint 追加以外の差分なし）
 * - asForm=true: ルートが <form role="search">、Enter は submit に一本化され
 *   keydown 側と二重発火しないこと
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SearchBar } from "../src/components/patterns/search-bar"

let container: HTMLElement
let root: Root

function mount(ui: React.ReactElement) {
  act(() => {
    root.render(ui)
  })
}

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
  container.remove()
})

function pressEnter(input: HTMLInputElement) {
  act(() => {
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true })
    )
  })
}

describe("SearchBar asForm", () => {
  it("asForm=false（既定）ではルートが div のままで role=search を持たない", () => {
    mount(<SearchBar placeholder="検索" />)
    const root = container.querySelector('[data-slot="search-bar"]')
    expect(root?.tagName).toBe("DIV")
    expect(root?.getAttribute("role")).toBeNull()
  })

  it("asForm=false では input に enterKeyHint=search が付く以外は現行と同じ属性", () => {
    mount(<SearchBar placeholder="検索" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.getAttribute("enterkeyhint")).toBe("search")
    expect(input.getAttribute("type")).toBe("search")
    expect(input.getAttribute("data-slot")).toBe("input")
  })

  it("asForm=false では Enter で onSearch が1回だけ呼ばれる（従来挙動）", () => {
    const onSearch = vi.fn()
    mount(<SearchBar placeholder="検索" onSearch={onSearch} defaultValue="foo" />)
    const input = container.querySelector("input") as HTMLInputElement
    pressEnter(input)
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith("foo")
  })

  it("asForm=true ではルートが form[role=search] になる", () => {
    mount(<SearchBar placeholder="検索" asForm />)
    const formEl = container.querySelector('[data-slot="search-bar"]')
    expect(formEl?.tagName).toBe("FORM")
    expect(formEl?.getAttribute("role")).toBe("search")
  })

  it("asForm=true では Enter による submit で onSearch が1回だけ呼ばれる（keydown と二重発火しない）", () => {
    const onSearch = vi.fn()
    mount(<SearchBar placeholder="検索" asForm onSearch={onSearch} defaultValue="bar" />)
    const formEl = container.querySelector("form") as HTMLFormElement
    act(() => {
      formEl.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
    })
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith("bar")
  })
})
