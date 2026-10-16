/**
 * @vitest-environment jsdom
 *
 * AdminShell のモバイルドロワー（issue #705）。lg 未満でメニューボタンから左の Sheet に
 * sidebar を開き、ナビ項目を押したら閉じる。既定（mobileDrawer 未指定）の DOM は従来どおり。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AdminShell } from "../src/components/patterns/shells/admin-shell"
import { SidebarNav } from "../src/components/patterns/sidebar-nav"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const sidebar = (
  <div>
    <SidebarNav
      items={[
        { label: "ダッシュボード", href: "#dash" },
        { label: "注文", onClick: () => {} },
      ]}
    />
    <button type="button" data-testid="toggle">折りたたむ</button>
  </div>
)

let container: HTMLDivElement
let root: Root
beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  document.body.innerHTML = ""
})

const drawer = () => document.querySelector<HTMLElement>("[data-admin-mobile-drawer]")
const menuButton = () => document.querySelector<HTMLButtonElement>('[data-slot="admin-mobile-menu-button"]')!

describe("AdminShell mobileDrawer（#705）", () => {
  it("既定はメニューボタン・ドロワー・header 無しのヘッダーを出さない（後方互換）", () => {
    const host = document.createElement("div")
    host.innerHTML = renderToStaticMarkup(<AdminShell sidebar={sidebar}>本文</AdminShell>)
    expect(host.querySelector('[data-slot="admin-mobile-menu-button"]')).toBeNull()
    expect(host.querySelector('[data-slot="admin-header"]')).toBeNull()
  })

  it("header が無くても lg 未満だけのヘッダーにメニューボタンを出す", () => {
    const host = document.createElement("div")
    host.innerHTML = renderToStaticMarkup(<AdminShell sidebar={sidebar} mobileDrawer>本文</AdminShell>)
    const header = host.querySelector<HTMLElement>('[data-slot="admin-header"]')!
    expect(header.className).toContain("lg:hidden")
    const button = header.querySelector<HTMLButtonElement>('[data-slot="admin-mobile-menu-button"]')!
    expect(button.getAttribute("aria-label")).toBe("メニューを開く")
    expect(button.getAttribute("aria-expanded")).toBe("false")
    expect(button.className).toContain("lg:hidden")
  })

  it("header があるときはその先頭にメニューボタンを置き、ヘッダーは lg でも出す", () => {
    const host = document.createElement("div")
    host.innerHTML = renderToStaticMarkup(
      <AdminShell sidebar={sidebar} header={<span>パンくず</span>} mobileDrawer>本文</AdminShell>,
    )
    const header = host.querySelector<HTMLElement>('[data-slot="admin-header"]')!
    expect(header.className).not.toContain("lg:hidden")
    expect(header.textContent).toContain("パンくず")
  })

  it("メニューボタンで開き、リンクを押すと閉じる。トグル等のボタンでは閉じない", () => {
    act(() => root.render(<AdminShell sidebar={sidebar} mobileDrawer closeMobileDrawerOnNavigate mobileMenuLabel="ナビを開く">本文</AdminShell>))
    expect(drawer()).toBeNull()
    act(() => menuButton().click())
    expect(drawer()).not.toBeNull()
    expect(menuButton().getAttribute("aria-expanded")).toBe("true")
    expect(drawer()!.getAttribute("role")).toBe("dialog")
    // 読み上げ用の見出し
    expect(drawer()!.querySelector('[data-slot="sheet-title"]')!.textContent).toBe("メニュー")

    act(() => drawer()!.querySelector<HTMLButtonElement>('[data-testid="toggle"]')!.click())
    expect(drawer()).not.toBeNull()

    act(() => drawer()!.querySelector<HTMLAnchorElement>('a[href="#dash"]')!.click())
    expect(drawer()).toBeNull()
  })

  it("opt-in では SidebarNav の button 項目でも閉じる", () => {
    act(() => root.render(<AdminShell sidebar={sidebar} mobileDrawer closeMobileDrawerOnNavigate>本文</AdminShell>))
    act(() => menuButton().click())
    const item = [...drawer()!.querySelectorAll<HTMLElement>('[data-slot="sidebar-nav-item"]')].find((el) => el.tagName === "BUTTON")!
    act(() => item.click())
    expect(drawer()).toBeNull()
  })

  it.each([undefined, false])("closeMobileDrawerOnNavigate=%s はリンクを押しても閉じない（既定を含む）", (closeOnNavigate) => {
    act(() => root.render(<AdminShell sidebar={sidebar} mobileDrawer closeMobileDrawerOnNavigate={closeOnNavigate}>本文</AdminShell>))
    act(() => menuButton().click())
    act(() => drawer()!.querySelector<HTMLAnchorElement>('a[href="#dash"]')!.click())
    expect(drawer()).not.toBeNull()
  })

  it("制御（mobileDrawerOpen / onMobileDrawerOpenChange）", () => {
    const onChange = vi.fn()
    act(() => root.render(<AdminShell sidebar={sidebar} mobileDrawer mobileDrawerOpen={false} onMobileDrawerOpenChange={onChange}>本文</AdminShell>))
    act(() => menuButton().click())
    expect(onChange).toHaveBeenCalledWith(true)
    // 親が開かない限り開かない
    expect(drawer()).toBeNull()
    act(() => root.render(<AdminShell sidebar={sidebar} mobileDrawer mobileDrawerOpen onMobileDrawerOpenChange={onChange}>本文</AdminShell>))
    expect(drawer()).not.toBeNull()
  })

  it("sidebarTone=inverse はドロワーの面にも効く", () => {
    act(() => root.render(<AdminShell sidebar={sidebar} mobileDrawer sidebarTone="inverse" mobileDrawerOpen>本文</AdminShell>))
    expect(drawer()!.dataset.tone).toBe("inverse")
    expect(drawer()!.className).toContain("bg-[var(--Surface-Inverse)]")
  })

  it("子を持つ親項目（aria-expanded を持つ開閉用）を押しても閉じない", () => {
    const withParent = (
      <div>
        <button type="button" data-slot="sidebar-nav-item" aria-expanded="false">設定</button>
        <a href="#child" aria-expanded="true">親リンク</a>
      </div>
    )
    act(() => root.render(<AdminShell sidebar={withParent} mobileDrawer closeMobileDrawerOnNavigate>本文</AdminShell>))
    act(() => menuButton().click())
    act(() => drawer()!.querySelector<HTMLButtonElement>('[data-slot="sidebar-nav-item"]')!.click())
    expect(drawer()).not.toBeNull()
    act(() => drawer()!.querySelector<HTMLAnchorElement>('a[href="#child"]')!.click())
    expect(drawer()).not.toBeNull()
  })

  describe("開いたまま lg 以上になったら閉じる", () => {
    const original = window.matchMedia
    let matches = false
    const listeners = new Set<() => void>()
    beforeEach(() => {
      matches = false
      listeners.clear()
      window.matchMedia = ((query: string) => ({
        get matches() {
          return query === "(min-width: 1024px)" ? matches : false
        },
        media: query,
        onchange: null,
        addEventListener: (_: string, cb: () => void) => listeners.add(cb),
        removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      })) as unknown as typeof window.matchMedia
    })
    afterEach(() => {
      window.matchMedia = original
    })

    it("幅が lg に広がると閉じ、リスナーを外す", () => {
      act(() => root.render(<AdminShell sidebar={sidebar} mobileDrawer>本文</AdminShell>))
      act(() => menuButton().click())
      expect(drawer()).not.toBeNull()
      expect(listeners.size).toBe(1)
      matches = true
      act(() => listeners.forEach((cb) => cb()))
      expect(drawer()).toBeNull()
      // 閉じたら監視も外す
      expect(listeners.size).toBe(0)
    })

    it("制御モードでは onMobileDrawerOpenChange(false) を呼ぶ", () => {
      const onChange = vi.fn()
      matches = true
      act(() => root.render(<AdminShell sidebar={sidebar} mobileDrawer mobileDrawerOpen onMobileDrawerOpenChange={onChange}>本文</AdminShell>))
      expect(onChange).toHaveBeenCalledWith(false)
    })

    it("SSR（renderToString）では matchMedia に触れない", () => {
      matches = true
      const spy = vi.fn(window.matchMedia)
      window.matchMedia = spy as unknown as typeof window.matchMedia
      renderToStaticMarkup(<AdminShell sidebar={sidebar} mobileDrawer mobileDrawerOpen>本文</AdminShell>)
      expect(spy).not.toHaveBeenCalled()
    })
  })
})
