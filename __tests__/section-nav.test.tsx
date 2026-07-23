/**
 * @vitest-environment jsdom
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SectionNav } from "../src/components/ui/section-nav"
import * as PublicApi from "../src/index"

const items = [
  { key: "overview", label: "概要", href: "#overview" },
  { key: "details", label: "詳細", href: "#details" },
]

describe("SectionNav semantics", () => {
  it("本物の anchor と現在地 semantics を描画する", () => {
    const output = renderToStaticMarkup(
      <SectionNav items={items} activeKey="details" />,
    )

    expect(output).toContain('<nav data-slot="section-nav"')
    expect(output).toContain('href="#overview"')
    expect(output).toContain('href="#details"')
    expect(output).toContain('aria-current="location"')
    expect(output.match(/aria-current=/g)).toHaveLength(1)
    expect(output).not.toContain('role="tab"')
    expect(output).not.toContain("aria-selected")
  })

  it("vertical / horizontal の意匠を分離し、sticky を内蔵しない", () => {
    const vertical = renderToStaticMarkup(<SectionNav items={items} />)
    const horizontal = renderToStaticMarkup(
      <SectionNav items={items} orientation="horizontal" />,
    )
    expect(vertical).toContain('data-orientation="vertical"')
    expect(vertical).toContain("border-l-2")
    expect(vertical).not.toContain("sticky")
    expect(horizontal).toContain('data-orientation="horizontal"')
    expect(horizontal).toContain("overflow-x-auto")
    expect(horizontal).toContain("border-b-2")
    expect(horizontal).not.toContain("sticky")
  })

  it("package root から公開する", () => {
    expect(PublicApi.SectionNav).toBe(SectionNav)
  })
})

describe("SectionNav native link behavior", () => {
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

  it("Cmd+click を preventDefault せず consumer callback に渡す", () => {
    const onItemClick = vi.fn()
    act(() => root.render(<SectionNav items={items} onItemClick={onItemClick} />))
    const link = container.querySelector('a[href="#details"]')!
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      metaKey: true,
    })

    act(() => link.dispatchEvent(event))

    expect(event.defaultPrevented).toBe(false)
    expect(onItemClick).toHaveBeenCalledTimes(1)
    expect(onItemClick.mock.calls[0][0]).toBe("details")
    expect(onItemClick.mock.calls[0][1].metaKey).toBe(true)
  })
})
