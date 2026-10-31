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
    // 背景は sticky の根（bar）が持つ（issue #807）。全幅のまま、余白は内側だけ
    expect(bar.className).toContain("bg-[var(--Surface-Primary)]")
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

// issue #807: sticky を子のチップ行に付けると、貼り付く範囲が外側 div（件数行ぶんの高さしか無い）に
// 限られ、少しスクロールすると一緒に流れていた。sticky・top・背景・z-index は根（bar）に付ける。
describe("ChipFilterBar の sticky は根の要素に付く（#807）", () => {
  it("sticky のクラスと top は bar に付き、横スクロールの行には付かない", () => {
    const { bar, row } = render(
      <ChipFilterBar sticky stickyOffset={56} resultCount={3}>x</ChipFilterBar>,
    )
    expect(bar.className).toMatch(/(^|\s)sticky(\s|$)/)
    expect(bar.className).toContain("z-[var(--Z-Sticky)]")
    expect(bar.className).toContain("bg-[var(--Surface-Primary)]")
    expect(bar.style.top).toBe("56px")
    expect(row.className).not.toMatch(/(^|\s)sticky(\s|$)/)
    expect(row.className).not.toContain("bg-[var(--Surface-Primary)]")
    expect(row.style.top).toBe("")
    // 44px の当たり判定を守る行のクラスは行に残す
    expect(row.className).toContain("min-h-11")
    expect(row.className).toContain("items-center")
    expect(row.className).toContain("overflow-x-auto")
  })

  it("resultCount 無しでも bar が sticky になる（top の既定は 0）", () => {
    const { bar, row } = render(<ChipFilterBar sticky>x</ChipFilterBar>)
    expect(bar.className).toMatch(/(^|\s)sticky(\s|$)/)
    expect(bar.style.top).toBe("0px")
    expect(row.className).not.toMatch(/(^|\s)sticky(\s|$)/)
  })

  it("件数行も背景の内側に入る（bar の子）", () => {
    const { bar, count } = render(<ChipFilterBar sticky resultCount={3}>x</ChipFilterBar>)
    expect(count!.parentElement).toBe(bar)
  })

  it("sticky でないときは bar にクラスも top も付けない（従来どおり）", () => {
    const { bar } = render(<ChipFilterBar className="outer">x</ChipFilterBar>)
    expect(bar.className).toBe("outer")
    expect(bar.getAttribute("style")).toBeNull()
  })
})
