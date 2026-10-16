/**
 * @vitest-environment jsdom
 *
 * SelectableTile（issue #703）: 押せる面そのものが 1 つの button で、consumer のハンドラ・aria-* が
 * 同じ要素に付く。selected は aria-pressed、movable の間は矢印キーで onMove と操作説明の
 * aria-describedby。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SelectableTile } from "../src/components/patterns/selectable-tile"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root
beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
})
const renderUi = (ui: React.ReactElement) => act(() => root.render(ui))
const tile = () => container.querySelector<HTMLButtonElement>('[data-slot="selectable-tile"]')!
const press = (key: string, init: KeyboardEventInit = {}) =>
  act(() => {
    tile().dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }))
  })

describe("SelectableTile（#703）", () => {
  it("1 つの button で、consumer のハンドラが同じ要素に付く", () => {
    const onPointerDown = vi.fn()
    renderUi(<SelectableTile onPointerDown={onPointerDown}>卓 A</SelectableTile>)
    expect(tile().tagName).toBe("BUTTON")
    expect(tile().type).toBe("button")
    expect(container.querySelectorAll("button").length).toBe(1)
    act(() => {
      tile().dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
    })
    expect(onPointerDown).toHaveBeenCalledTimes(1)
  })

  it("selected 未指定は aria-pressed を付けず、指定時は状態を出す", () => {
    renderUi(<SelectableTile>卓</SelectableTile>)
    expect(tile().hasAttribute("aria-pressed")).toBe(false)
    renderUi(<SelectableTile selected={false}>卓</SelectableTile>)
    expect(tile().getAttribute("aria-pressed")).toBe("false")
    renderUi(<SelectableTile selected>卓</SelectableTile>)
    expect(tile().getAttribute("aria-pressed")).toBe("true")
    expect(tile().dataset.selected).toBe("true")
    expect(tile().className).toContain("bg-[var(--Surface-Accent-Primary-Light)]")
  })

  it("shape=circle は正円", () => {
    renderUi(<SelectableTile shape="circle" aria-label="座席 1">1</SelectableTile>)
    expect(tile().dataset.shape).toBe("circle")
    expect(tile().className).toContain("rounded-full")
    expect(tile().className).toContain("aspect-square")
  })

  it("movable の間だけ矢印キーで onMove を呼び、preventDefault する", () => {
    const onMove = vi.fn()
    renderUi(<SelectableTile onMove={onMove}>卓</SelectableTile>)
    press("ArrowRight")
    expect(onMove).not.toHaveBeenCalled()

    renderUi(<SelectableTile movable onMove={onMove}>卓</SelectableTile>)
    expect(tile().className).toContain("touch-none")
    let prevented = false
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true })
      tile().dispatchEvent(event)
      prevented = event.defaultPrevented
    })
    expect(onMove).toHaveBeenCalledWith("left", expect.anything())
    expect(prevented).toBe(true)
    for (const [key, dir] of [["ArrowUp", "up"], ["ArrowDown", "down"], ["ArrowRight", "right"]]) {
      press(key)
      expect(onMove).toHaveBeenLastCalledWith(dir, expect.anything())
    }
    // 修飾キー付き・矢印以外は呼ばない
    onMove.mockClear()
    press("ArrowUp", { metaKey: true })
    press("Enter")
    expect(onMove).not.toHaveBeenCalled()
  })

  it("consumer の onKeyDown が preventDefault したら onMove を呼ばない", () => {
    const onMove = vi.fn()
    renderUi(<SelectableTile movable onMove={onMove} onKeyDown={(e) => e.preventDefault()}>卓</SelectableTile>)
    press("ArrowUp")
    expect(onMove).not.toHaveBeenCalled()
  })

  it("moveInstructions を hidden の説明に描画し、consumer の aria-describedby と連結する", () => {
    renderUi(
      <SelectableTile movable aria-describedby="hint" moveInstructions="矢印キーで移動">
        卓
      </SelectableTile>,
    )
    const ids = tile().getAttribute("aria-describedby")!.split(" ")
    expect(ids[0]).toBe("hint")
    const instructions = document.getElementById(ids[1])!
    expect(instructions.textContent).toBe("矢印キーで移動")
    expect(instructions.hidden).toBe(true)
    // 説明は button の中に hidden で置く（兄弟要素を増やさない。hidden は名前に入らない）
    expect(tile().contains(instructions)).toBe(true)
    expect(container.children.length).toBe(1)
  })

  it("選択中は border + outline、フォーカスは外側の ring で両立する（box-shadow を取り合わない）", () => {
    renderUi(<SelectableTile selected>卓</SelectableTile>)
    const cls = tile().className.split(/\s+/)
    expect(cls).toContain("outline-[var(--Border-Accent-Primary)]")
    expect(cls).toContain("focus-visible:ring-[3px]")
    expect(cls).not.toContain("ring-inset")
    expect(cls).not.toContain("ring-1")
    // 選択中は focus でも選択の outline を消さない
    expect(cls).not.toContain("focus-visible:outline-hidden")
    renderUi(<SelectableTile selected={false}>卓</SelectableTile>)
    expect(tile().className.split(/\s+/)).toContain("focus-visible:outline-hidden")
  })

  it("movable でなければ説明を出さず、consumer の aria-describedby だけ残す", () => {
    renderUi(
      <SelectableTile aria-describedby="hint" moveInstructions="矢印キーで移動">
        卓
      </SelectableTile>,
    )
    expect(tile().getAttribute("aria-describedby")).toBe("hint")
    expect(container.querySelector('[data-slot="selectable-tile-instructions"]')).toBeNull()
  })
})
