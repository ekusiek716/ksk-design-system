/** @vitest-environment jsdom */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { describe, expect, it, vi } from "vitest"

import { Card, CardTitle } from "../src/components/ui/card"
import { StatCard } from "../src/components/patterns/stat-card"

const parse = (ui: React.ReactElement, slot: string) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!
}
const classes = (el: HTMLElement) => el.className.split(" ")

describe("Card / StatCard の elevation（#689）", () => {
  it("未指定は従来どおり shadow-md", () => {
    expect(classes(parse(<Card>x</Card>, "card"))).toContain("shadow-[var(--shadow-md)]")
    expect(classes(parse(<StatCard label="a" value={1} />, "stat-card"))).toContain("shadow-[var(--shadow-md)]")
  })
  it("none は影クラスを出さない", () => {
    expect(parse(<Card elevation="none">x</Card>, "card").className).not.toContain("shadow-")
    expect(parse(<StatCard elevation="none" label="a" value={1} />, "stat-card").className).not.toContain("shadow-")
  })
  it.each(["sm", "lg"] as const)("Card elevation=%s は対応する影トークン", (e) => {
    expect(classes(parse(<Card elevation={e}>x</Card>, "card"))).toContain(`shadow-[var(--shadow-${e})]`)
  })
})

describe("Card の selected（#677）", () => {
  it("押せる Card は押せる面に aria-pressed を出し、選択面と太い枠になる", () => {
    const html = (selected: boolean) => {
      const host = document.createElement("div")
      host.innerHTML = renderToStaticMarkup(
        <Card selected={selected} onClick={() => {}}><CardTitle>卓 A</CardTitle></Card>,
      )
      return host
    }
    const on = html(true)
    expect(on.querySelector('[data-slot="card-overlay"]')!.getAttribute("aria-pressed")).toBe("true")
    const card = on.querySelector<HTMLElement>('[data-slot="card"]')!
    expect(card.dataset.selected).toBe("true")
    expect(classes(card)).toEqual(expect.arrayContaining(["bg-[var(--Surface-Accent-Primary-Light)]", "ring-1"]))
    // 選択中は hover で Surface-Secondary に戻さない
    expect(card.className).not.toContain("hover]:bg-[var(--Surface-Secondary)]")
    expect(html(false).querySelector('[data-slot="card-overlay"]')!.getAttribute("aria-pressed")).toBe("false")
  })
  it("selected 未指定なら aria-pressed を出さない（後方互換）", () => {
    const host = document.createElement("div")
    host.innerHTML = renderToStaticMarkup(<Card onClick={() => {}}><CardTitle>t</CardTitle></Card>)
    expect(host.querySelector('[data-slot="card-overlay"]')!.hasAttribute("aria-pressed")).toBe(false)
  })
  it("href のリンクは aria-pressed ではなく aria-current=true で伝える", () => {
    const host = document.createElement("div")
    host.innerHTML = renderToStaticMarkup(<Card href="/a" selected><CardTitle>t</CardTitle></Card>)
    const overlay = host.querySelector('[data-slot="card-overlay"]')!
    expect(overlay.hasAttribute("aria-pressed")).toBe(false)
    expect(overlay.getAttribute("aria-current")).toBe("true")
    host.innerHTML = renderToStaticMarkup(<Card href="/a"><CardTitle>t</CardTitle></Card>)
    expect(host.querySelector('[data-slot="card-overlay"]')!.hasAttribute("aria-current")).toBe(false)
  })
  it("押せない Card に selected を渡すと開発ビルドで 1 回 warn する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const host = document.createElement("div")
    const root = createRoot(host)
    act(() => root.render(<><Card selected>a</Card><Card selected>b</Card></>))
    const calls = warn.mock.calls.filter((c) => String(c[0]).includes("Card: selected"))
    expect(calls.length).toBe(1)
    act(() => root.unmount())
    warn.mockRestore()
  })
  it("native Card も selected と elevation=none を持つ", () => {
    const src = readFileSync(join(__dirname, "..", "src/native/components/Card.tsx"), "utf8")
    expect(src).toContain('elevation?: "none" | "sm" | "md" | "lg"')
    expect(src).toContain("selected?: boolean")
    expect(src).toContain("selected !== undefined ? { selected } : {}")
  })
})
