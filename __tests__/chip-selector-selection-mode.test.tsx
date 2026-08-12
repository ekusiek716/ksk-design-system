/**
 * @vitest-environment jsdom
 *
 * issue #352: ChipSelector の selectionMode（単一 / 複数 / 未指定）。
 *
 * `multiple`（既定 `true`）は後方互換のため残し、`selectionMode` が指定された
 * ときだけそれを正本にする。**selectionMode 未指定の呼び出しは origin/main と
 * 同じ DOM を出す**ことをここで固定する（非破壊の回帰テスト）。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ChipSelector } from "../src/components/patterns/chip-selector"

const OPTIONS = [
  { label: "仕事", value: "work" },
  { label: "家族", value: "family" },
  { label: "健康", value: "health" },
]

let container: HTMLElement
let root: Root

function mount(ui: React.ReactElement) {
  act(() => {
    root.render(ui)
  })
}

function group(): HTMLElement {
  return container.querySelector<HTMLElement>('[data-slot="chip-selector"]')!
}

/** 押せるチップ本体（removable のときの × は data-slot="chip-remove" なので混ざらない） */
function chips(): HTMLButtonElement[] {
  return Array.from(container.querySelectorAll<HTMLButtonElement>('button[data-slot="chip"]'))
}

function arrow(el: HTMLElement, key: string) {
  act(() => {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }))
  })
}

function SingleDemo({
  initial = ["family"],
  mode,
  multiple,
}: {
  initial?: string[]
  mode?: "single" | "multiple"
  multiple?: boolean
}) {
  const [value, setValue] = React.useState<string[]>(initial)
  return (
    <ChipSelector
      options={OPTIONS}
      value={value}
      onChange={setValue}
      selectionMode={mode}
      multiple={multiple}
    />
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

describe("selectionMode 未指定（既定）は origin/main と同じ出力（非破壊）", () => {
  it("グループは role=group、チップは aria-pressed のみ（role/aria-checked は出さない）", () => {
    mount(<ChipSelector options={OPTIONS} value={[]} onChange={() => {}} />)
    expect(group().getAttribute("role")).toBe("group")
    for (const chip of chips()) {
      expect(chip.getAttribute("aria-pressed")).toBe("false")
      expect(chip.hasAttribute("role")).toBe(false)
      expect(chip.hasAttribute("aria-checked")).toBe(false)
      // roving tabindex は single 専用。既定では tabindex を触らない
      expect(chip.hasAttribute("tabindex")).toBe(false)
    }
  })

  it("選択済みチップは removable（× 付き）のまま", () => {
    mount(<ChipSelector options={OPTIONS} value={["work"]} onChange={() => {}} />)
    expect(container.querySelectorAll('[data-slot="chip-remove"]').length).toBe(1)
    const selected = container.querySelector<HTMLElement>('span[data-slot="chip"]')!
    expect(selected.querySelector("button")!.getAttribute("aria-pressed")).toBe("true")
  })

  it("複数選択として振る舞う（押すたびに追加される）", () => {
    mount(<SingleDemo initial={[]} />)
    act(() => {
      chips()[0].click()
    })
    act(() => {
      chips()[chips().length - 1].click()
    })
    // work が removable になり本体 button から外れるので、残りから健康が選ばれている
    expect(container.querySelectorAll('[data-slot="chip-remove"]').length).toBe(2)
  })

  it("矢印キーでは何も起きない", () => {
    mount(<SingleDemo initial={[]} />)
    arrow(chips()[0], "ArrowRight")
    expect(chips().every((c) => !c.hasAttribute("tabindex"))).toBe(true)
    expect(container.querySelectorAll('[data-slot="chip-remove"]').length).toBe(0)
  })

  it("selectionMode 未指定 + multiple={false} は従来どおり単一選択のロジック（挙動は不変）", () => {
    mount(<SingleDemo initial={[]} multiple={false} />)
    act(() => {
      chips()[0].click()
    })
    act(() => {
      chips()[1].click()
    })
    // 置き換えなので選択は常に 1 つ。× は出ない（removable は複数選択時のみ）
    expect(container.querySelectorAll('[data-slot="chip-remove"]').length).toBe(0)
    expect(chips().filter((c) => c.getAttribute("aria-checked") === "true").length).toBe(1)
  })
})

describe('selectionMode="multiple" はトグルボタン意味論', () => {
  it("グループは group のまま、チップは aria-pressed", () => {
    mount(<ChipSelector options={OPTIONS} value={[]} onChange={() => {}} selectionMode="multiple" />)
    expect(group().getAttribute("role")).toBe("group")
    for (const chip of chips()) {
      expect(chip.getAttribute("aria-pressed")).toBe("false")
      expect(chip.hasAttribute("role")).toBe(false)
    }
  })

  it("multiple={false} より selectionMode が優先される", () => {
    mount(
      <ChipSelector
        options={OPTIONS}
        value={[]}
        onChange={() => {}}
        multiple={false}
        selectionMode="multiple"
      />,
    )
    expect(group().getAttribute("role")).toBe("group")
  })
})

describe('selectionMode="single" は radiogroup / radio', () => {
  it("グループが radiogroup、チップが radio + aria-checked になる", () => {
    mount(<SingleDemo mode="single" />)
    expect(group().getAttribute("role")).toBe("radiogroup")
    const [a, b] = chips()
    expect(a.getAttribute("role")).toBe("radio")
    // 未選択にも aria-checked="false" を出す（radio は状態を必ず持つ）
    expect(a.getAttribute("aria-checked")).toBe("false")
    expect(b.getAttribute("aria-checked")).toBe("true")
    // radio に aria-pressed を併記しない（意味論の二重化を避ける）
    expect(chips().every((c) => !c.hasAttribute("aria-pressed"))).toBe(true)
  })

  it("multiple={false} でも radiogroup になる（a11y の穴を塞ぐ）", () => {
    mount(<SingleDemo multiple={false} />)
    expect(group().getAttribute("role")).toBe("radiogroup")
    expect(chips()[0].getAttribute("role")).toBe("radio")
  })

  it("single では選択済みでも × を出さない（排他選択に削除ボタンは要らない）", () => {
    mount(<SingleDemo mode="single" />)
    expect(container.querySelectorAll('[data-slot="chip-remove"]').length).toBe(0)
  })

  it("roving tabindex: 選択中だけ tabIndex=0、他は -1", () => {
    mount(<SingleDemo mode="single" />)
    expect(chips().map((c) => c.tabIndex)).toEqual([-1, 0, -1])
  })

  it("未選択のときは先頭チップが tabIndex=0", () => {
    mount(<SingleDemo mode="single" initial={[]} />)
    expect(chips().map((c) => c.tabIndex)).toEqual([0, -1, -1])
  })

  it("矢印キーで移動し、移動先が選択される（上下左右すべて受ける）", () => {
    mount(<SingleDemo mode="single" />)
    arrow(chips()[1], "ArrowRight")
    expect(chips()[2].getAttribute("aria-checked")).toBe("true")
    expect(document.activeElement).toBe(chips()[2])
    expect(chips().map((c) => c.tabIndex)).toEqual([-1, -1, 0])

    arrow(chips()[2], "ArrowUp")
    expect(chips()[1].getAttribute("aria-checked")).toBe("true")

    arrow(chips()[1], "ArrowDown")
    expect(chips()[2].getAttribute("aria-checked")).toBe("true")
  })

  it("端では折り返す", () => {
    mount(<SingleDemo mode="single" />)
    arrow(chips()[1], "ArrowLeft")
    expect(chips()[0].getAttribute("aria-checked")).toBe("true")
    arrow(chips()[0], "ArrowLeft")
    expect(chips()[2].getAttribute("aria-checked")).toBe("true")
  })

  it("選択済みチップへ矢印で戻っても選択が解除されない", () => {
    // ChipSelector の単一選択は「選択済みを再タップすると解除」なので、
    // 移動先が既に選択済みのときは click せず移動だけにする
    mount(<SingleDemo mode="single" initial={["work"]} />)
    arrow(chips()[0], "ArrowLeft") // 末尾へ移動して選択
    expect(chips()[2].getAttribute("aria-checked")).toBe("true")
    arrow(chips()[2], "ArrowRight") // 先頭へ折り返し
    expect(chips()[0].getAttribute("aria-checked")).toBe("true")
    // どの時点でも必ず 1 つ選ばれている
    expect(chips().filter((c) => c.getAttribute("aria-checked") === "true").length).toBe(1)
  })

  it("選択中の値が 2 つ以上あると開発ビルドで警告する（#39 の footgun 検出）", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<ChipSelector options={OPTIONS} value={["work", "family"]} onChange={() => {}} selectionMode="single" />)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('selectionMode="single"'))
  })

  it("選択が 1 つなら警告しない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<SingleDemo mode="single" />)
    expect(warn).not.toHaveBeenCalled()
  })

  it("multiple のときは複数選択でも警告しない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<ChipSelector options={OPTIONS} value={["work", "family"]} onChange={() => {}} />)
    expect(warn).not.toHaveBeenCalled()
  })

  it("process が無い環境では warn しない（フェイルクローズ）", () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, "process")
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    try {
      // @ts-expect-error テストのために一時的に process を消す
      delete globalThis.process
      mount(
        <ChipSelector options={OPTIONS} value={["work", "family"]} onChange={() => {}} selectionMode="single" />,
      )
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
      mount(
        <ChipSelector options={OPTIONS} value={["work", "family"]} onChange={() => {}} selectionMode="single" />,
      )
      expect(warn).not.toHaveBeenCalled()
    } finally {
      if (proc?.env) proc.env.NODE_ENV = prev
      warn.mockRestore()
    }
  })
})

describe("同一ページに複数の ChipSelector", () => {
  it("外側の roving tabindex に内側のチップを巻き込まない", () => {
    mount(
      <div>
        <ChipSelector options={OPTIONS} value={["work"]} onChange={() => {}} selectionMode="single" />
        <ChipSelector options={OPTIONS} value={[]} onChange={() => {}} />
      </div>,
    )
    const all = chips()
    // 先頭 3 つが single 側（roving tabindex あり）、残りは既定側で触られない
    expect(all.slice(0, 3).map((c) => c.tabIndex)).toEqual([0, -1, -1])
    expect(all.slice(3).every((c) => !c.hasAttribute("tabindex"))).toBe(true)
  })
})
