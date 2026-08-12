/**
 * @vitest-environment jsdom
 *
 * issue #318: QuickActionGrid の selectionMode（単一 / 複数 / 未指定）。
 *
 * ActionTile は「選択肢」と「クイックアクションの起動ボタン」の両方に使われるため、
 * 既定（selectionMode 未指定）では従来の aria-pressed のままにする。single のときだけ
 * radiogroup / radio へ切り替え、roving tabindex と矢印キー移動を持たせる。
 *
 * ここでは属性の契約（非破壊を含む）とキーボード移動を jsdom で固定する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ActionTile, QuickActionGrid } from "../src/components/patterns/quick-action-grid"

let container: HTMLElement
let root: Root

function mount(ui: React.ReactElement) {
  act(() => {
    root.render(ui)
  })
}

function tiles(): HTMLButtonElement[] {
  return Array.from(container.querySelectorAll<HTMLButtonElement>('[data-slot="action-tile"]'))
}

function grid(): HTMLElement {
  return container.querySelector<HTMLElement>('[data-slot="quick-action-grid"]')!
}

function arrow(el: HTMLElement, key: string) {
  act(() => {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }))
  })
}

function SingleDemo({ initial = "b" }: { initial?: string }) {
  const [value, setValue] = React.useState(initial)
  return (
    <QuickActionGrid selectionMode="single" aria-label="選択">
      {["a", "b", "c"].map((v) => (
        <ActionTile key={v} label={v} selected={value === v} onClick={() => setValue(v)} />
      ))}
    </QuickActionGrid>
  )
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
  vi.restoreAllMocks()
})

describe("selectionMode 未指定（既定）は従来の出力のまま（非破壊）", () => {
  it("grid は role を持たず、タイルは aria-pressed のみを出す", () => {
    mount(
      <QuickActionGrid>
        <ActionTile label="記録" selected />
        <ActionTile label="メモ" />
      </QuickActionGrid>,
    )
    expect(grid().hasAttribute("role")).toBe(false)
    expect(grid().hasAttribute("data-selection-mode")).toBe(false)

    const [selected, plain] = tiles()
    expect(selected.getAttribute("aria-pressed")).toBe("true")
    expect(selected.hasAttribute("role")).toBe(false)
    expect(selected.hasAttribute("aria-checked")).toBe(false)
    // 未選択タイルは aria-pressed 自体を出さない（従来どおり）
    expect(plain.hasAttribute("aria-pressed")).toBe(false)
    // roving tabindex は single 専用。既定では tabindex を触らない
    expect(selected.hasAttribute("tabindex")).toBe(false)
    expect(plain.hasAttribute("tabindex")).toBe(false)
  })

  it("矢印キーで選択が動かない（起動ボタンの集まりとして扱う）", () => {
    mount(
      <QuickActionGrid>
        <ActionTile label="記録" />
        <ActionTile label="メモ" />
      </QuickActionGrid>,
    )
    arrow(tiles()[0], "ArrowRight")
    expect(tiles()[1].hasAttribute("aria-pressed")).toBe(false)
    expect(tiles().every((t) => !t.hasAttribute("tabindex"))).toBe(true)
  })
})

describe('selectionMode="multiple" はトグルボタン意味論', () => {
  it("grid に radiogroup は付かず、タイルは aria-pressed のまま", () => {
    mount(
      <QuickActionGrid selectionMode="multiple">
        <ActionTile label="通知" selected />
        <ActionTile label="同期" selected />
      </QuickActionGrid>,
    )
    expect(grid().hasAttribute("role")).toBe(false)
    expect(grid().getAttribute("data-selection-mode")).toBe("multiple")
    for (const tile of tiles()) {
      expect(tile.getAttribute("aria-pressed")).toBe("true")
      expect(tile.hasAttribute("role")).toBe(false)
      expect(tile.hasAttribute("aria-checked")).toBe(false)
    }
  })
})

describe('selectionMode="single" は radiogroup / radio', () => {
  it("grid が radiogroup、タイルが radio + aria-checked になる", () => {
    mount(<SingleDemo />)
    expect(grid().getAttribute("role")).toBe("radiogroup")
    const [a, b] = tiles()
    expect(a.getAttribute("role")).toBe("radio")
    expect(a.getAttribute("aria-checked")).toBe("false")
    expect(b.getAttribute("aria-checked")).toBe("true")
    // radio に aria-pressed を併記しない（意味論の二重化を避ける）
    expect(a.hasAttribute("aria-pressed")).toBe(false)
    expect(b.hasAttribute("aria-pressed")).toBe(false)
  })

  it("roving tabindex: 選択中だけ tabIndex=0、他は -1", () => {
    mount(<SingleDemo />)
    expect(tiles().map((t) => t.tabIndex)).toEqual([-1, 0, -1])
  })

  it("未選択のときは先頭タイルが tabIndex=0", () => {
    mount(
      <QuickActionGrid selectionMode="single">
        <ActionTile label="a" />
        <ActionTile label="b" />
      </QuickActionGrid>,
    )
    expect(tiles().map((t) => t.tabIndex)).toEqual([0, -1])
  })

  it("矢印キーで移動し、移動先が選択される（上下左右すべて受ける）", () => {
    mount(<SingleDemo />)
    arrow(tiles()[1], "ArrowRight")
    expect(tiles()[2].getAttribute("aria-checked")).toBe("true")
    expect(document.activeElement).toBe(tiles()[2])
    expect(tiles().map((t) => t.tabIndex)).toEqual([-1, -1, 0])

    arrow(tiles()[2], "ArrowUp")
    expect(tiles()[1].getAttribute("aria-checked")).toBe("true")

    arrow(tiles()[1], "ArrowDown")
    expect(tiles()[2].getAttribute("aria-checked")).toBe("true")
  })

  it("端では折り返す", () => {
    mount(<SingleDemo />)
    arrow(tiles()[1], "ArrowLeft")
    expect(tiles()[0].getAttribute("aria-checked")).toBe("true")
    arrow(tiles()[0], "ArrowLeft")
    expect(tiles()[2].getAttribute("aria-checked")).toBe("true")
  })

  it("disabled のタイルは移動先から除外される", () => {
    mount(
      <QuickActionGrid selectionMode="single">
        <ActionTile label="a" selected />
        <ActionTile label="b" disabled />
        <ActionTile label="c" />
      </QuickActionGrid>,
    )
    arrow(tiles()[0], "ArrowRight")
    expect(document.activeElement).toBe(tiles()[2])
  })

  it("consumer の onKeyDown / role 指定を尊重する", () => {
    const onKeyDown = vi.fn()
    mount(
      <QuickActionGrid selectionMode="single" role="group" onKeyDown={onKeyDown}>
        <ActionTile label="a" selected />
        <ActionTile label="b" />
      </QuickActionGrid>,
    )
    expect(grid().getAttribute("role")).toBe("group")
    arrow(tiles()[0], "ArrowRight")
    expect(onKeyDown).toHaveBeenCalled()
  })

  it("選択済みタイルが 2 つ以上あると開発ビルドで警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(
      <QuickActionGrid selectionMode="single">
        <ActionTile label="a" selected />
        <ActionTile label="b" selected />
      </QuickActionGrid>,
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('selectionMode="single"'))
  })

  it("選択が 1 つなら警告しない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<SingleDemo />)
    expect(warn).not.toHaveBeenCalled()
  })
})

describe("ActionTile 単体・明示 prop", () => {
  it("grid の外では従来どおり aria-pressed のボタン", () => {
    mount(<ActionTile label="単体" selected />)
    const tile = tiles()[0]
    expect(tile.getAttribute("aria-pressed")).toBe("true")
    expect(tile.hasAttribute("role")).toBe(false)
  })

  it("タイルの selectionMode 明示は親 grid より優先される", () => {
    mount(
      <QuickActionGrid selectionMode="single">
        <ActionTile label="a" selected />
        <ActionTile label="b" selectionMode="multiple" selected />
      </QuickActionGrid>,
    )
    const [a, b] = tiles()
    expect(a.getAttribute("role")).toBe("radio")
    expect(b.hasAttribute("role")).toBe(false)
    expect(b.getAttribute("aria-pressed")).toBe("true")
  })

  it("grid 外でも selectionMode=\"single\" を明示すれば radio になる", () => {
    mount(<ActionTile label="単体" selectionMode="single" selected />)
    expect(tiles()[0].getAttribute("role")).toBe("radio")
    expect(tiles()[0].getAttribute("aria-checked")).toBe("true")
  })
})
