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

  // レビューで見つかった漏れ: 未指定のグリッドが Provider を置かないと、外側の
  // single 文脈をそのまま引き継いで「ただの起動ボタン」が radio 化していた。
  describe("入れ子のグリッド（#318 レビュー指摘）", () => {
    function Nested() {
      return (
        <QuickActionGrid selectionMode="single">
          <ActionTile label="外1" selected />
          <ActionTile label="外2" />
          <QuickActionGrid>
            <ActionTile label="内1" />
            <ActionTile label="内2" />
          </QuickActionGrid>
        </QuickActionGrid>
      )
    }

    it("内側の未指定グリッドのタイルは radio にならない（文脈を引き継がない）", () => {
      mount(<Nested />)
      const all = tiles()
      expect(all.map((t) => t.getAttribute("role"))).toEqual([
        "radio",
        "radio",
        null,
        null,
      ])
    })

    it("外側の roving tabindex に内側のタイルを巻き込まない", () => {
      mount(<Nested />)
      const all = tiles()
      // 外側は選択中の1枚だけ 0 / もう1枚が -1。内側は触られない（tabIndex 既定 0）
      expect(all[0].tabIndex).toBe(0)
      expect(all[1].tabIndex).toBe(-1)
      expect(all[2].getAttribute("tabindex")).toBeNull()
      expect(all[3].getAttribute("tabindex")).toBeNull()
    })
  })

  // レビューで見つかった漏れ: process が無い環境（バンドラが NODE_ENV を
  // 静的置換しない素のブラウザ配布）で dev 判定がフェイルオープンし、本番でも
  // 警告が出続けていた。
  describe("開発時の多重選択 warn（#318 レビュー指摘）", () => {
    function TwoSelected() {
      return (
        <QuickActionGrid selectionMode="single">
          <ActionTile label="A" selected />
          <ActionTile label="B" selected />
        </QuickActionGrid>
      )
    }

    it("process が無い環境では warn しない（フェイルクローズ）", () => {
      const original = Object.getOwnPropertyDescriptor(globalThis, "process")
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
      try {
        // @ts-expect-error テストのために一時的に process を消す
        delete globalThis.process
        mount(<TwoSelected />)
        expect(warn).not.toHaveBeenCalled()
      } finally {
        if (original) Object.defineProperty(globalThis, "process", original)
        warn.mockRestore()
      }
    })

    it("NODE_ENV=production では warn しない", () => {
      const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
      const prev = proc?.env?.NODE_ENV
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
      try {
        if (proc?.env) proc.env.NODE_ENV = "production"
        mount(<TwoSelected />)
        expect(warn).not.toHaveBeenCalled()
      } finally {
        if (proc?.env) proc.env.NODE_ENV = prev
        warn.mockRestore()
      }
    })
  })
})
