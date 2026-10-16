/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { MobileAppShell } from "../src/components/patterns/mobile-app-shell"

// issue #715: 高さ固定の画面・上端/下端の safe-area・ネイティブのタブバー分の下余白
const render = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  const q = (slot: string) => host.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
  return { root: q("mobile-app-shell")!, frame: q("mobile-app-shell-frame")!, header: q("mobile-app-shell-header"), main: q("mobile-app-shell-main")! }
}
const classes = (el: HTMLElement) => el.className.split(/\s+/).filter(Boolean).sort()

describe("MobileAppShell viewport / safe-area（#715）", () => {
  it("既定（flow）は従来どおり", () => {
    const { root, frame, main } = render(<MobileAppShell bottomNav={<nav>n</nav>}>x</MobileAppShell>)
    expect(root.hasAttribute("data-viewport")).toBe(false)
    expect(classes(root)).toEqual(["bg-[var(--Surface-Secondary)]", "min-h-dvh", "text-[var(--Text-High-Emphasis)]"])
    expect(classes(frame)).toEqual(
      ["bg-[var(--Surface-Primary)]", "flex", "flex-1", "flex-col", "min-h-dvh", "min-w-0", "relative"],
    )
    expect(classes(main)).toEqual(["flex-1", "min-h-0", "pb-20"])
    expect(main.getAttribute("style")).toBeNull()
  })

  it('viewport="fixed" はルートを 100svh に固定し、main だけをスクロールさせる', () => {
    const { root, frame, main } = render(<MobileAppShell viewport="fixed" desktopSidebar={<p>s</p>}>x</MobileAppShell>)
    expect(root.dataset.viewport).toBe("fixed")
    expect(root.className).toContain("h-[100svh]")
    expect(root.className).toContain("overflow-hidden")
    expect(root.className).not.toContain("min-h-dvh")
    expect(frame.className).toContain("h-full")
    expect(frame.className).not.toContain("min-h-dvh")
    expect(main.className).toContain("overflow-y-auto")
    expect(root.querySelector('[data-slot="mobile-app-shell-desktop-sidebar"]')!.className).toContain("overflow-y-auto")
  })

  it("safeAreaTop は header があれば header、無ければ枠の上端に付く", () => {
    const pt = "pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]"
    const withHeader = render(<MobileAppShell safeAreaTop header={<div>h</div>}>x</MobileAppShell>)
    expect(withHeader.header!.className).toContain(pt)
    expect(withHeader.frame.className).not.toContain(pt)
    const noHeader = render(<MobileAppShell safeAreaTop>x</MobileAppShell>)
    expect(noHeader.frame.className).toContain(pt)
  })

  it("safeAreaBottom は下余白に env(safe-area-inset-bottom) と extra を足す", () => {
    const { main } = render(
      <MobileAppShell safeAreaBottom bottomPadding="bottom-nav-fab" bottomPaddingExtra="var(--ad-height, 0px)">x</MobileAppShell>,
    )
    expect(main.className).toContain("pb-[var(--ksk-shell-main-padding-bottom)]")
    expect(main.className).not.toContain("pb-28")
    expect(main.style.getPropertyValue("--ksk-shell-main-padding-bottom")).toBe(
      "calc(7rem + env(safe-area-inset-bottom, 0px) + var(--ad-height, 0px))",
    )
  })

  it('bottomPadding="native-tab-bar" はネイティブのタブバーの高さを読み、safe-area は足さない', () => {
    const { main } = render(<MobileAppShell safeAreaBottom bottomPadding="native-tab-bar">x</MobileAppShell>)
    expect(main.style.getPropertyValue("--ksk-shell-main-padding-bottom")).toBe(
      "calc(1rem + var(--Native-Tab-Bar-Height, 6rem))",
    )
  })

  it("#681 の bottomPaddingExtra だけの指定は従来のクラスのまま", () => {
    const { main } = render(<MobileAppShell bottomPadding="bottom-nav" bottomPaddingExtra="50px">x</MobileAppShell>)
    expect(main.className).toContain("pb-[calc(5rem_+_var(--ksk-shell-bottom-padding-extra))]")
    expect(main.style.getPropertyValue("--ksk-shell-bottom-padding-extra")).toBe("50px")
  })
})
