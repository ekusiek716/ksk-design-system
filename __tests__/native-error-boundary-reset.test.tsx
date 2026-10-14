/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { expect, it, vi } from "vitest"
import { ErrorBoundary } from "../src/native/components/ErrorBoundary"
vi.mock("react-native", () => ({ View: "div" }))
vi.mock("../src/native/components/Text", () => ({ Text: "span" }))
vi.mock("../src/native/components/Button", () => ({ Button: "button" }))
it("native resetKeys preserves healthy state and retries existing errors", () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {})
  const host = document.createElement("div"); document.body.append(host)
  const root = createRoot(host); const mounts = vi.fn(); const retry = vi.fn()
  function Child({ fail }: { fail: boolean }) {
    React.useEffect(() => { mounts() }, [])
    if (fail) throw new Error("failed")
    return <span>healthy</span>
  }
  const ui = (key: number, fail = false) => <ErrorBoundary resetKeys={[key]} onRetry={retry} fallback={<span>failed</span>}><Child fail={fail} /></ErrorBoundary>
  try {
    act(() => root.render(ui(1))); act(() => root.render(ui(2)))
    expect(mounts).toHaveBeenCalledTimes(1)
    act(() => root.render(ui(3, true))); expect(host.textContent).toBe("failed"); expect(retry).not.toHaveBeenCalled()
    act(() => root.render(ui(4))); expect(host.textContent).toBe("healthy"); expect(retry).toHaveBeenCalledOnce()
  } finally { act(() => root.unmount()); host.remove(); log.mockRestore() }
})
