/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { SidebarNav } from "../src/components/patterns/sidebar-nav"
import { AdminShell } from "../src/components/patterns/shells/admin-shell"

// issue #680: 暗色（inverse）サイドバー。
const render = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host
}
const items = [
  { label: "ホーム", isActive: true },
  { label: "設定" },
]

describe("SidebarNav tone（#680）", () => {
  it("既定は明るい面の色（後方互換）", () => {
    const [active, rest] = Array.from(render(<SidebarNav items={items} />).querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-item"]'))
    expect(active.className).toContain("bg-[var(--Surface-Accent-Primary-Light)]")
    expect(rest.className).toContain("text-[var(--Text-Medium-Emphasis)]")
  })
  it("inverse は on-Inverse 系の色で、現在地に aria-current=page が付く", () => {
    const host = render(<SidebarNav items={items} tone="inverse" />)
    expect(host.querySelector<HTMLElement>('[data-slot="sidebar-nav"]')!.dataset.tone).toBe("inverse")
    const [active, rest] = Array.from(host.querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-item"]'))
    expect(active.getAttribute("aria-current")).toBe("page")
    expect(active.className).toContain("text-[var(--Text-on-Inverse)]")
    expect(active.className).not.toContain("Surface-Accent-Primary-Light")
    expect(rest.className).toContain("text-[var(--Text-on-Inverse-Secondary)]")
    expect(rest.className).not.toContain("bg-[var(--Surface-Primary)]")
    // 暗い面では 3:1 を満たす Object-on-Inverse のフォーカスリング
    expect(rest.className).toContain("focus-visible:ring-[var(--Object-on-Inverse)]")
    expect(rest.className).not.toContain("focus-visible:ring-[var(--Focus-High-Emphasis)]")
  })
})

describe("AdminShell sidebarTone（#680）", () => {
  it("既定は Surface-Primary、inverse は Surface-Inverse", () => {
    const aside = (tone?: "default" | "inverse") =>
      render(<AdminShell sidebar={<div />} sidebarTone={tone}>x</AdminShell>).querySelector<HTMLElement>('[data-slot="admin-sidebar"]')!
    expect(aside().className).toContain("bg-[var(--Surface-Primary)]")
    expect(aside("inverse").className).toContain("bg-[var(--Surface-Inverse)]")
    expect(aside("inverse").dataset.tone).toBe("inverse")
  })
})
