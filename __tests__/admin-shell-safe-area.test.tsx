/**
 * @vitest-environment jsdom
 *
 * AdminShell safeAreaTop（issue #724）。上端の safe-area をヘッダー・サイドバー（無ければ本文の列）に足す。
 * 指定しないときのクラス・DOM は従来どおり。
 */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { AdminShell } from "../src/components/patterns/shells/admin-shell"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const PT = "pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]"
const host = (ui: React.ReactElement) => {
  const el = document.createElement("div")
  el.innerHTML = renderToStaticMarkup(ui)
  return el
}

describe("AdminShell safeAreaTop", () => {
  it("既定は safe-area を足さない（従来のクラス）", () => {
    const el = host(<AdminShell sidebar={<nav />} header={<div />} />)
    expect(el.innerHTML).not.toContain("Safe-Area-Inset-Top")
    expect(el.querySelector<HTMLElement>('[data-slot="admin-header"]')!.className).toBe(
      "h-16 shrink-0 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]"
    )
  })

  it("header ありはヘッダー（box-content）とサイドバーに足し、本文の列には足さない", () => {
    const el = host(<AdminShell safeAreaTop sidebar={<nav />} header={<div />} />)
    const header = el.querySelector<HTMLElement>('[data-slot="admin-header"]')!
    // 高さは下線込み 64px + 安全領域（box-content にしない）
    expect(header.className).toContain("h-[calc(4rem_+_var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px)))]")
    expect(header.className).not.toContain("box-content")
    expect(header.className).not.toMatch(/(^| )h-16( |$)/)
    expect(header.className).toContain(PT)
    expect(el.querySelector<HTMLElement>('[data-slot="admin-sidebar"]')!.className).toContain(PT)
    expect(header.parentElement!.className).not.toContain("Safe-Area")
  })

  it("header 無しは本文の列に、mobileDrawer だけのときは lg 以上だけ本文の列に足す", () => {
    const none = host(<AdminShell safeAreaTop sidebar={<nav />} />)
    expect(none.querySelector<HTMLElement>('[data-slot="admin-main"]')!.parentElement!.className).toContain(` ${PT}`)
    const drawer = host(<AdminShell safeAreaTop mobileDrawer sidebar={<nav />} />)
    const col = drawer.querySelector<HTMLElement>('[data-slot="admin-main"]')!.parentElement!
    expect(col.className).toContain(`lg:${PT}`)
    expect(drawer.querySelector<HTMLElement>('[data-slot="admin-header"]')!.className).toContain(PT)
  })

  it("!header && mobileDrawer: ヘッダーは lg 未満だけ出て安全領域を持ち、本文の列は lg 以上だけ足す（二重に足さない）", () => {
    const el = host(<AdminShell safeAreaTop mobileDrawer sidebar={<nav />} />)
    const header = el.querySelector<HTMLElement>('[data-slot="admin-header"]')!
    expect(header.className).toContain("lg:hidden")
    expect(header.className).toContain(PT)
    const col = el.querySelector<HTMLElement>('[data-slot="admin-main"]')!.parentElement!
    expect(col.className).toContain(`lg:${PT}`)
    expect(col.className.split(" ")).not.toContain(PT)
  })

  it("mobileDrawer のドロワーの上端にも安全領域を足す", () => {
    const el = document.createElement("div")
    document.body.appendChild(el)
    const root = createRoot(el)
    act(() => root.render(<AdminShell safeAreaTop mobileDrawer mobileDrawerOpen sidebar={<nav />} />))
    const drawer = document.querySelector<HTMLElement>("[data-admin-mobile-drawer]")!
    expect(drawer.className).toContain(PT)
    act(() => root.unmount())
    el.remove()
  })
})
