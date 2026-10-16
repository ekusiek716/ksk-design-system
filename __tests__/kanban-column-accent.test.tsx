/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { KanbanColumn } from "../src/components/patterns/kanban-column"

// issue #702: 見出しのドットを分類の識別色で塗る accentColor
const render = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host
}

describe("KanbanColumn accentColor（#702）", () => {
  it("未指定は従来どおり（tone のドット・data-accent 無し）", () => {
    const host = render(<KanbanColumn title="未着手" tone="info" />)
    const dot = host.querySelector<HTMLElement>('[data-slot="kanban-column-dot"]')!
    expect(dot.className).toContain("bg-[var(--Object-Info)]")
    expect(dot.hasAttribute("style")).toBe(false)
    expect(host.querySelector("section")!.hasAttribute("data-accent")).toBe(false)
  })
  it("tone も accentColor も無ければドットを出さない", () => {
    expect(render(<KanbanColumn title="未着手" />).querySelector('[data-slot="kanban-column-dot"]')).toBeNull()
  })
  it("accentColor の色でドットを塗り、tone より優先する", () => {
    const host = render(<KanbanColumn title="会場" tone="info" accentColor="var(--Categorical-3)" />)
    const dots = host.querySelectorAll<HTMLElement>('[data-slot="kanban-column-dot"]')
    expect(dots.length).toBe(1)
    expect(dots[0].className).toContain("bg-[var(--ksk-kanban-accent)]")
    expect(dots[0].className).not.toContain("Object-Info")
    expect(dots[0].getAttribute("style")).toContain("--ksk-kanban-accent:var(--Categorical-3)")
    expect(dots[0].getAttribute("aria-hidden")).toBe("true")
    expect(host.querySelector("section")!.dataset.accent).toBe("true")
  })
})
