/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { Alert, AlertDescription } from "../src/components/ui/alert"

// issue #695: inline 系 variant でも title / description / icon / action prop を描画する。
const render = (ui: React.ReactElement) => {
  const host = document.createElement("div")
  host.innerHTML = renderToStaticMarkup(ui)
  return host.querySelector<HTMLElement>('[data-slot="alert"]')!
}

describe("Alert inline 系の prop ベース（#695）", () => {
  it.each(["inline-info", "inline-caution", "inline-warning"] as const)("%s は title / description を描画する", (variant) => {
    const el = render(<Alert variant={variant} title="見出し" description="説明" />)
    expect(el.querySelector('[data-slot="alert-title"]')?.textContent).toBe("見出し")
    expect(el.querySelector('[data-slot="alert-description"]')?.textContent).toBe("説明")
  })
  it("description だけでも空の枠にならない。icon / action も描画する", () => {
    const el = render(<Alert variant="inline-caution" icon={<svg />} description="在庫わずか" action={<span>操作</span>} />)
    expect(el.textContent).toContain("在庫わずか")
    expect(el.textContent).toContain("操作")
    expect(el.querySelector('[data-slot="alert-icon"]')?.getAttribute("aria-hidden")).toBe("true")
    expect(el.querySelector('[data-slot="alert-description"]')?.className).toContain("text-[var(--Text-Caution)]")
  })
  it("children を渡したときの描画は従来どおり（children だけ）", () => {
    const el = render(
      <Alert variant="inline-info">
        <AlertDescription>子</AlertDescription>
      </Alert>,
    )
    expect(el.children.length).toBe(1)
    expect(el.textContent).toBe("子")
  })
  it("children と prop を併用すると開発ビルドで警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const host = document.createElement("div")
    const root = createRoot(host)
    act(() => root.render(<Alert variant="inline-info" title="無視される"><AlertDescription>子</AlertDescription></Alert>))
    expect(host.textContent).toBe("子")
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Alert: children を渡したため"))
    act(() => root.unmount())
    warn.mockRestore()
  })
})
