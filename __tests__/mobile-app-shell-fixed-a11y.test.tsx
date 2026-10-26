/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { MobileAppShell } from "../src/components/patterns/mobile-app-shell"
import { resetDevWarnings } from "../src/lib/dev-warn"

// issue #715 レビュー: fixed の main のキーボード操作・キーボード表示中の高さ・同時指定の警告
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe("MobileAppShell viewport=fixed（#715 レビュー）", () => {
  it("fixed の main は Tab で止まるスクロール領域（focus リング付き）、flow では従来どおり", () => {
    const fixed = renderToStaticMarkup(<MobileAppShell viewport="fixed">x</MobileAppShell>)
    expect(fixed).toMatch(/<main[^>]*tabindex="0"/)
    expect(fixed).toContain("focus-visible:ring-[var(--Focus-High-Emphasis)]")
    const flow = renderToStaticMarkup(<MobileAppShell>x</MobileAppShell>)
    expect(flow).not.toContain("tabindex")
  })

  it("visualViewport がキーボードぶん縮んだら、ルートを見えている高さにする", () => {
    const listeners: Record<string, () => void> = {}
    const vv = {
      height: 800,
      offsetTop: 0,
      addEventListener: (t: string, fn: () => void) => { listeners[t] = fn },
      removeEventListener: () => {},
    }
    Object.defineProperty(window, "visualViewport", { configurable: true, value: vv })
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 })
    const host = document.createElement("div")
    document.body.appendChild(host)
    const root = createRoot(host)
    act(() => root.render(<MobileAppShell viewport="fixed">x</MobileAppShell>))
    const shell = () => host.querySelector<HTMLElement>('[data-slot="mobile-app-shell"]')!
    expect(shell().style.height).toBe("")
    vv.height = 500
    act(() => listeners.resize())
    expect(shell().style.height).toBe("500px")
    vv.height = 800
    act(() => listeners.resize())
    expect(shell().style.height).toBe("")
    act(() => root.unmount())
    host.remove()
    Reflect.deleteProperty(window, "visualViewport")
  })

  it("検知できない環境向けに html[data-kb-open] + --kb-h の CSS フォールバックがある", () => {
    const css = readFileSync(join(__dirname, "../src/styles/sheet-keyboard.css"), "utf8")
    expect(css).toContain('html[data-kb-open] [data-slot="mobile-app-shell"][data-viewport="fixed"]')
    expect(css).toContain("calc(100svh - var(--kb-h, 0px))")
  })

  it('safeAreaBottom と bottomPadding="native-tab-bar" の同時指定は開発ビルドで警告する', () => {
    resetDevWarnings()
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const host = document.createElement("div")
    const root = createRoot(host)
    act(() => root.render(<MobileAppShell safeAreaBottom bottomPadding="native-tab-bar">x</MobileAppShell>))
    act(() => root.render(<MobileAppShell safeAreaBottom bottomPadding="bottom-nav">x</MobileAppShell>))
    act(() => root.unmount())
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain("native-tab-bar")
    warn.mockRestore()
  })
})
