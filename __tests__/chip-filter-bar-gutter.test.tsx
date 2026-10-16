/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { ChipFilterBar } from "../src/components/patterns/chip-filter-bar"

// issue #667: 内側（チップ列 div と件数 p）の余白 API。外側（sticky の背景）は狭めない。
const render = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  const bar = host.querySelector<HTMLElement>('[data-slot="chip-filter-bar"]')!
  const row = bar.firstElementChild as HTMLElement
  return { bar, row, content: row.querySelector<HTMLElement>('[data-slot="chip-filter-bar-content"]'), count: bar.querySelector("p") }
}

describe("ChipFilterBar の内側余白（#667）", () => {
  it("gutter は行の内側ラッパーと件数に付き、背景を持つ行・外側には付かない", () => {
    const { bar, row, content, count } = render(<ChipFilterBar sticky gutter="tight" resultCount={3}>x</ChipFilterBar>)
    // スクロール末尾でも右余白が効くよう、スクロールコンテナではなく中身ぶんの幅のラッパーに付く
    expect(content!.className).toContain("px-4")
    expect(content!.className).toContain("w-max")
    expect(content!.className).toContain("min-w-full")
    expect(row.className).not.toMatch(/\bpx-/)
    expect(row.className).toContain("bg-[var(--Surface-Primary)]")
    expect(count!.className).toContain("px-4")
    expect(bar.className).not.toContain("px-")
  })

  it("gutter=default は px-6", () => {
    const { content } = render(<ChipFilterBar gutter="default">x</ChipFilterBar>)
    expect(content!.className).toContain("px-6")
  })

  it("contentClassName は行と件数の両方に付く", () => {
    const { bar, content, count } = render(
      <ChipFilterBar contentClassName="px-[var(--page-px)]" className="outer" resultCount={1}>x</ChipFilterBar>,
    )
    expect(content!.className).toContain("px-[var(--page-px)]")
    expect(count!.className).toContain("px-[var(--page-px)]")
    expect(bar.className).toBe("outer")
  })

  it("未指定なら従来どおり内側に余白を付けない（後方互換）", () => {
    const { row, content, count } = render(<ChipFilterBar resultCount={1}>x</ChipFilterBar>)
    expect(content).toBeNull()
    expect(row.className).not.toMatch(/\bpx-/)
    expect(count!.className).not.toMatch(/\bpx-/)
  })
})
