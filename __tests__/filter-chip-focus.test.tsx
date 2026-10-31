/**
 * @vitest-environment jsdom
 *
 * issue #784: FilterChip が isActive の切り替えごとに Chip（<button>）を作り直し、
 * キーボード操作中のフォーカスが body へ落ちていた。
 *
 * 原因は `key={isActive ? "on" : "off"}`。Chip は selected を props から毎回描く
 * だけで「キャッシュ」を持たないため、作り直す理由が無い。押した button が
 * 同じ DOM 要素のまま残り、aria-pressed の変化だけが起きることをここで固定する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { FilterChip } from "../src/components/patterns/filter-chip"

let container: HTMLElement
let root: Root

function Demo({ value }: { value?: string }) {
  const [active, setActive] = React.useState(false)
  return (
    <FilterChip label="ロック" value={value} isActive={active} onClick={() => setActive((v) => !v)} />
  )
}

function chip(): HTMLButtonElement {
  return container.querySelector<HTMLButtonElement>('button[data-slot="chip"]')!
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

describe("FilterChip: isActive を切り替えても button を作り直さない (#784)", () => {
  it("押した button が同じ要素のまま残り、フォーカスも残る", () => {
    act(() => {
      root.render(<Demo />)
    })
    const before = chip()
    before.focus()
    expect(document.activeElement).toBe(before)
    expect(before.getAttribute("aria-pressed")).toBe("false")

    act(() => {
      before.click()
    })
    expect(chip()).toBe(before)
    expect(before.isConnected).toBe(true)
    expect(document.activeElement).toBe(before)
    expect(before.getAttribute("aria-pressed")).toBe("true")

    act(() => {
      before.click()
    })
    expect(chip()).toBe(before)
    expect(document.activeElement).toBe(before)
    expect(before.getAttribute("aria-pressed")).toBe("false")
  })

  it("value 付きでも on で「ラベル: 値」、off でラベルだけに戻る（同じ要素のまま）", () => {
    act(() => {
      root.render(<Demo value="渋谷" />)
    })
    const el = chip()
    expect(el.textContent).toBe("ロック")
    act(() => {
      el.click()
    })
    expect(chip()).toBe(el)
    expect(el.textContent).toBe("ロック: 渋谷")
    act(() => {
      el.click()
    })
    expect(el.textContent).toBe("ロック")
  })
})
