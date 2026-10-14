/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ErrorBoundary } from "../src/components/ui/error-boundary"
import { NavigationBar } from "../src/components/ui/navigation-bar"
import { NumberInput } from "../src/components/ui/number-input"
import { StatCard } from "../src/components/patterns/stat-card"
import { BulkActions } from "../src/components/patterns/admin/bulk-actions"
import { DataTableBulkActions } from "../src/components/patterns/admin/data-table"
import { Toaster } from "../src/components/ui/toast"
import { PortalContainerProvider } from "../src/components/ui/portal-container"
let root: Root | undefined
let host: HTMLDivElement
function render(ui: React.ReactNode) {
  if (!root) { host = document.createElement("div"); document.body.append(host); root = createRoot(host) }
  act(() => root!.render(ui))
}
afterEach(() => { act(() => root?.unmount()); root = undefined; document.body.replaceChildren(); vi.restoreAllMocks() })
describe("consumer API regression coverage", () => {
  it("resets only an existing error, preserving healthy child state", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const mounts = vi.fn()
    function Child({ fail }: { fail: boolean }) {
      React.useEffect(() => { mounts() }, [])
      if (fail) throw new Error("failed")
      return <span>healthy</span>
    }
    const reset = vi.fn()
    const ui = (key: number, fail = false) => <ErrorBoundary resetKeys={[key]} onReset={reset} reload={false} embedded><Child fail={fail} /></ErrorBoundary>
    render(ui(1)); render(ui(2)); expect(mounts).toHaveBeenCalledTimes(1)
    render(ui(3, true)); expect(host.textContent).toContain("Something went wrong")
    expect(reset).not.toHaveBeenCalled()
    expect(host.querySelector("[data-slot='error-boundary-fallback']")?.className).not.toContain("min-h-screen")
    expect(host.textContent).not.toContain("Reload")
    render(ui(4)); expect(host.textContent).toBe("healthy"); expect(reset).toHaveBeenCalledTimes(1)
  })
  it("forwards header and action refs and attributes while keeping actions", () => {
    const header = React.createRef<HTMLElement>(); const left = React.createRef<HTMLButtonElement>(); const share = React.createRef<HTMLButtonElement>()
    const click = vi.fn()
    render(<NavigationBar ref={header} data-testid="nav" onLeft={click} onShare={click} leftButtonProps={{ ref: left, "aria-label": "Dismiss", "data-testid": "close" }} shareButtonProps={{ ref: share, "aria-label": "Send", "data-testid": "share" }} />)
    expect(header.current?.dataset.testid).toBe("nav"); expect(left.current?.dataset.testid).toBe("close"); expect(share.current?.dataset.testid).toBe("share"); expect(left.current?.getAttribute("aria-label")).toBe("Dismiss"); expect(share.current?.getAttribute("aria-label")).toBe("Send")
    act(() => { left.current?.click(); share.current?.click() }); expect(click).toHaveBeenCalledTimes(2)
  })
  it("forwards numeric input label/name/ref and composes commit and event handlers", () => {
    const ref = React.createRef<HTMLInputElement>(); const blur = vi.fn(); const focus = vi.fn(); const key = vi.fn(); const change = vi.fn()
    render(<NumberInput ref={ref} id="ttl" name="ttl" aria-label="Days" value={3} min={1} max={10} onChange={change} onFocus={focus} onBlur={blur} onKeyDown={key} />)
    expect(ref.current?.id).toBe("ttl"); expect(ref.current?.name).toBe("ttl"); expect(ref.current?.getAttribute("aria-label")).toBe("Days")
    act(() => ref.current?.focus()); expect(focus).toHaveBeenCalledOnce()
    act(() => ref.current?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })))
    expect(change).toHaveBeenLastCalledWith(4); expect(key).toHaveBeenCalledOnce()
    act(() => ref.current?.blur()); expect(blur).toHaveBeenCalledOnce(); expect(change).toHaveBeenLastCalledWith(4)
  })
  it("exposes stat parts without conflating label, number and unit", () => {
    render(<StatCard label="Groups" value={2} unit="items" trend={{ value: 4 }} />)
    for (const [part, text] of [["label", "Groups"], ["value", "2"], ["unit", "items"], ["trend", "+4%"]]) expect(host.querySelector(`[data-slot='stat-card-${part}']`)?.textContent?.trim()).toBe(text)
  })
  it.each([BulkActions, DataTableBulkActions])("uses localized count for display and accessible name", (Bar) => {
    render(<Bar selectedCount={3} countLabel={(n) => `${n} selected`} />)
    expect(host.textContent).toContain("3 selected"); expect(host.querySelector("[role='toolbar']")?.getAttribute("aria-label")).toBe("3 selected")
    render(<Bar selectedCount={1} />); expect(host.textContent).toContain("1件を選択中")
    render(<Bar selectedCount={0} />); expect(host.textContent).toBe("")
  })
  it("places toast viewport inside shadow provider, explicit container wins, null returns to body", () => {
    const shadowHost = document.createElement("div"); document.body.append(shadowHost)
    const shadow = shadowHost.attachShadow({ mode: "open" }); const explicit = document.createElement("div"); document.body.append(explicit)
    render(<PortalContainerProvider container={shadow}><Toaster /></PortalContainerProvider>)
    expect(shadow.querySelector("[data-slot='toast-viewport']")?.getAttribute("aria-live")).toBe("polite")
    render(<PortalContainerProvider container={shadow}><Toaster container={explicit} /></PortalContainerProvider>)
    expect(shadow.querySelector("[data-slot='toast-viewport']")).toBeNull(); expect(explicit.querySelector("[data-slot='toast-viewport']")).not.toBeNull()
    render(<PortalContainerProvider container={shadow}><Toaster container={null} /></PortalContainerProvider>)
    expect(document.body.querySelector(":scope > [data-slot='toast-viewport']")).not.toBeNull()
  })
})
