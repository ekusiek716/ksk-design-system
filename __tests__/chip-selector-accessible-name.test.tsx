/**
 * @vitest-environment jsdom
 *
 * issue #666: ChipSelector のグループにアクセシブルネームを付けられること。
 * `role="radiogroup"` は名前が必須（WAI-ARIA）なので、単一選択で名前が無いと開発ビルドで警告する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ChipSelector } from "../src/components/patterns/chip-selector"

const OPTIONS = [
  { label: "メモ", value: "memo" },
  { label: "打ち合わせ", value: "meeting" },
]

let container: HTMLElement
let root: Root
beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
})
const mount = (ui: React.ReactElement) => act(() => root.render(ui))
const group = () => container.querySelector<HTMLElement>('[data-slot="chip-selector"]')!

describe("ChipSelector のアクセシブルネーム（#666）", () => {
  it("aria-labelledby / aria-describedby / id がルートに出る", () => {
    mount(
      <>
        <p id="kind">種別</p>
        <ChipSelector
          id="kind-group"
          aria-labelledby="kind"
          aria-describedby="kind-help"
          selectionMode="single"
          options={OPTIONS}
          value="memo"
          onChange={() => {}}
        />
      </>,
    )
    expect(group().getAttribute("role")).toBe("radiogroup")
    expect(group().getAttribute("aria-labelledby")).toBe("kind")
    expect(group().getAttribute("aria-describedby")).toBe("kind-help")
    expect(group().id).toBe("kind-group")
  })

  it("aria-label がルートに出る（複数選択の group でも渡せる）", () => {
    mount(<ChipSelector aria-label="タグ" selectionMode="multiple" options={OPTIONS} value={[]} onChange={() => {}} />)
    expect(group().getAttribute("role")).toBe("group")
    expect(group().getAttribute("aria-label")).toBe("タグ")
  })

  it("未指定の単一選択は開発ビルドで警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<ChipSelector selectionMode="single" options={OPTIONS} value="memo" onChange={() => {}} />)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("アクセシブルネーム"))
    expect(group().hasAttribute("aria-label")).toBe(false)
  })

  it("名前があれば警告しない。再レンダーでも警告は増えない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<ChipSelector aria-label="種別" selectionMode="single" options={OPTIONS} value="memo" onChange={() => {}} />)
    mount(<ChipSelector aria-label="種別" selectionMode="single" options={OPTIONS} value="meeting" onChange={() => {}} />)
    expect(warn).not.toHaveBeenCalled()
  })

  it("複数選択（group）は名前が無くても警告しない（後方互換）", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    mount(<ChipSelector options={OPTIONS} value={[]} onChange={() => {}} />)
    expect(warn).not.toHaveBeenCalled()
  })
})
