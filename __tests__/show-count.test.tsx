/**
 * @vitest-environment jsdom
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { AutoGrowTextarea } from "../src/components/ui/auto-grow-textarea"
import { CommitInput } from "../src/components/ui/commit-input"
import { CommitTextarea } from "../src/components/ui/commit-textarea"
import { Input } from "../src/components/ui/input"
import { Textarea } from "../src/components/ui/textarea"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

function render(ui: React.ReactElement) {
  act(() => root.render(ui))
}

function setDomValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const prototype =
    element.tagName === "TEXTAREA"
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set
  if (!setter) throw new Error("value setter is unavailable")
  setter.call(element, value)
}

function typeInto(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  act(() => {
    setDomValue(element, value)
    element.dispatchEvent(new Event("input", { bubbles: true }))
  })
}

function countText(slot: "input-count" | "textarea-count") {
  return container.querySelector(`[data-slot="${slot}"]`)?.textContent ?? null
}

describe("Input showCount", () => {
  it("controlled / defaultValue / 入力操作の文字数へ追従する", () => {
    render(<Input showCount maxLength={10} defaultValue="あいう" />)
    expect(countText("input-count")).toBe("3/10")

    render(<Input showCount maxLength={10} value="キャプション" onChange={() => {}} />)
    expect(countText("input-count")).toBe("6/10")

    render(<Input showCount maxLength={10} />)
    typeInto(container.querySelector("input")!, "hello")
    expect(countText("input-count")).toBe("5/10")
  })

  it("ref 経由で入った uncontrolled の実 DOM 値を初期表示から数える", () => {
    render(
      <Input
        showCount
        maxLength={40}
        ref={(node) => {
          if (node) node.value = "選ばれるアイテム1"
        }}
      />,
    )
    expect(countText("input-count")).toBe("9/40")
  })

  it("IME composition 中は表示を固定し、確定時に更新する", () => {
    render(<Input showCount maxLength={10} defaultValue="" />)
    const input = container.querySelector("input")!

    act(() => {
      input.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }))
      setDomValue(input, "変換中")
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
    expect(countText("input-count")).toBe("0/10")

    act(() => {
      input.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true }))
    })
    expect(countText("input-count")).toBe("3/10")
  })

  it("上限到達で caution 色になる", () => {
    render(<Input showCount maxLength={3} defaultValue="abc" />)
    expect(container.querySelector('[data-slot="input-count"]')?.className).toContain(
      "--Text-Caution",
    )
  })
})

describe("Textarea / AutoGrowTextarea showCount", () => {
  it("Textarea は uncontrolled 入力へ追従する", () => {
    render(<Textarea showCount maxLength={20} defaultValue="メモ" />)
    expect(countText("textarea-count")).toBe("2/20")
    typeInto(container.querySelector("textarea")!, "更新後のメモ")
    expect(countText("textarea-count")).toBe("6/20")
  })

  it("AutoGrowTextarea は従来の自動表示を維持し、明示 false で隠せる", () => {
    const legacy = renderToStaticMarkup(
      <AutoGrowTextarea value="本文" onChange={() => {}} maxLength={100} />,
    )
    expect(legacy).toContain('data-slot="auto-grow-textarea-counter"')

    const hidden = renderToStaticMarkup(
      <AutoGrowTextarea
        value="本文"
        onChange={() => {}}
        maxLength={100}
        showCount={false}
      />,
    )
    expect(hidden).not.toContain('data-slot="auto-grow-textarea-counter"')
  })
})

describe("後方互換 / Commit variants", () => {
  it("showCount 未指定時は wrapper / counter DOM を追加しない", () => {
    const input = renderToStaticMarkup(<Input defaultValue="既存" />)
    const textarea = renderToStaticMarkup(<Textarea defaultValue="既存" />)
    expect(input).not.toContain("input-with-count")
    expect(input).not.toContain("input-count")
    expect(textarea).not.toContain("textarea-with-count")
    expect(textarea).not.toContain("textarea-count")
  })

  it("CommitInput / CommitTextarea へ showCount が透過される", () => {
    const input = renderToStaticMarkup(
      <CommitInput value="確定前" onCommit={() => {}} showCount maxLength={20} />,
    )
    const textarea = renderToStaticMarkup(
      <CommitTextarea value="確定前" onCommit={() => {}} showCount maxLength={20} />,
    )
    expect(input).toContain('data-slot="input-count"')
    expect(textarea).toContain('data-slot="textarea-count"')
  })
})
