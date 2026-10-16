/** @vitest-environment jsdom */
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { Home2, User } from "iconsax-reactjs"

import { MobileTabBar } from "../src/components/patterns/commerce/mobile-tab-bar"
import { BottomTabBar } from "../src/components/patterns/commerce/bottom-tab-bar"
import { MobileAppShell } from "../src/components/patterns/mobile-app-shell"

// issue #681: MobileTabBar の keyboardBehavior 素通し、bottomOffsetExtra、MobileAppShell の bottomPaddingExtra。
const render = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host
}
const TABS = [
  { key: "home", label: "ホーム", Icon: Home2 },
  { key: "me", label: "マイ", Icon: User },
]

describe("MobileTabBar（#681）", () => {
  it("未指定は keyboardBehavior=hide・従来の bottom クラス（後方互換）", () => {
    const nav = render(<MobileTabBar tabs={TABS} activeTab="home" onSelect={() => {}} />).querySelector<HTMLElement>("nav")!
    expect(nav.dataset.keyboardBehavior).toBe("hide")
    expect(nav.className).toContain("bottom-[calc(env(safe-area-inset-bottom)_+_12px)]")
    expect(nav.getAttribute("style") ?? "").not.toContain("--ksk-bottom-tab-bar-offset-extra")
  })
  it("keyboardBehavior を BottomTabBar へ渡す", () => {
    const nav = render(<MobileTabBar tabs={TABS} activeTab="home" onSelect={() => {}} keyboardBehavior="lift" />).querySelector<HTMLElement>("nav")!
    expect(nav.dataset.keyboardBehavior).toBe("lift")
  })
  it("bottomOffsetExtra は下端に加算され、DOM 属性には漏れない", () => {
    const nav = render(<MobileTabBar tabs={TABS} activeTab="home" onSelect={() => {}} bottomOffsetExtra="50px" />).querySelector<HTMLElement>("nav")!
    expect(nav.className).toContain("bottom-[calc(env(safe-area-inset-bottom)_+_12px_+_var(--ksk-bottom-tab-bar-offset-extra))]")
    expect(nav.getAttribute("style")).toContain("--ksk-bottom-tab-bar-offset-extra:50px")
    expect(nav.hasAttribute("bottomoffsetextra")).toBe(false)
  })
  it("BottomTabBar default variant でも加算される", () => {
    const nav = render(<BottomTabBar items={[{ label: "a", icon: <i /> }]} bottomOffsetExtra="3rem" />).querySelector<HTMLElement>("nav")!
    expect(nav.className).toContain("bottom-[var(--ksk-bottom-tab-bar-offset-extra)]")
    expect(nav.className).not.toMatch(/(^| )bottom-0( |$)/)
  })
})

describe("MobileAppShell bottomPaddingExtra（#681）", () => {
  it("未指定は従来どおり pb-20", () => {
    const main = render(<MobileAppShell bottomNav={<div />}>x</MobileAppShell>).querySelector<HTMLElement>("main")!
    expect(main.className.split(" ")).toContain("pb-20")
  })
  it("指定すると既定余白に加算する", () => {
    const main = render(<MobileAppShell bottomNav={<div />} bottomPaddingExtra="50px">x</MobileAppShell>).querySelector<HTMLElement>("main")!
    expect(main.className).toContain("pb-[calc(5rem_+_var(--ksk-shell-bottom-padding-extra))]")
    expect(main.getAttribute("style")).toContain("--ksk-shell-bottom-padding-extra:50px")
  })
})
