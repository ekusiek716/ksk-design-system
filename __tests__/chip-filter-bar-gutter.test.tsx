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
  return { bar, row: bar.firstElementChild as HTMLElement, count: bar.querySelector("p") }
}

describe("ChipFilterBar の内側余白（#667）", () => {
  it("gutter は行と件数の両方に付き、外側には付かない", () => {
    const { bar, row, count } = render(<ChipFilterBar sticky gutter="tight" resultCount={3}>x</ChipFilterBar>)
    expect(row.className).toContain("px-4")
    expect(row.className).toContain("bg-[var(--Surface-Primary)]")
    expect(count!.className).toContain("px-4")
    expect(bar.className).not.toContain("px-")
  })

  it("gutter=default は px-6", () => {
    const { row } = render(<ChipFilterBar gutter="default">x</ChipFilterBar>)
    expect(row.className).toContain("px-6")
  })

  it("contentClassName は行と件数の両方に付く", () => {
    const { bar, row, count } = render(
      <ChipFilterBar contentClassName="px-[var(--page-px)]" className="outer" resultCount={1}>x</ChipFilterBar>,
    )
    expect(row.className).toContain("px-[var(--page-px)]")
    expect(count!.className).toContain("px-[var(--page-px)]")
    expect(bar.className).toBe("outer")
  })

  it("未指定なら従来どおり内側に余白を付けない（後方互換）", () => {
    const { row, count } = render(<ChipFilterBar resultCount={1}>x</ChipFilterBar>)
    expect(row.className).not.toMatch(/\bpx-/)
    expect(count!.className).not.toMatch(/\bpx-/)
  })
})
