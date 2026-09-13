/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { ShareButtons } from "../src/components/patterns/share-buttons"

let container: HTMLDivElement
let root: Root | undefined
let writeText: ReturnType<typeof vi.fn>
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard")
function deferred() {
  let resolve!: () => void
  let reject!: (error: Error) => void
  const promise = new Promise<void>((ok, fail) => { resolve = ok; reject = fail })
  return { promise, resolve, reject }
}
beforeEach(() => {
  vi.useFakeTimers()
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  writeText = vi.fn()
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
})
afterEach(() => {
  act(() => root?.unmount())
  container.remove()
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard)
  else Reflect.deleteProperty(navigator, "clipboard")
  vi.useRealTimers()
})
it("an older failure cannot replace the latest copy success", async () => {
  const first = deferred(), second = deferred(), onCopy = vi.fn()
  writeText.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
  act(() => root!.render(<ShareButtons url="https://example.com" providers={["copy"]} onCopy={onCopy} />))
  act(() => container.querySelector("button")!.click())
  act(() => container.querySelector("button")!.click())
  await act(async () => { second.resolve(); await second.promise })
  await act(async () => { first.reject(new Error("denied")); await first.promise.catch(() => {}) })
  expect(onCopy.mock.calls).toEqual([["success"], ["error"]])
  expect(container.textContent).not.toContain("コピーできませんでした")
})
it("pending copy completion after unmount reports the result without scheduling feedback", async () => {
  const pending = deferred(), onCopy = vi.fn()
  writeText.mockReturnValue(pending.promise)
  act(() => root!.render(<ShareButtons url="https://example.com" providers={["copy"]} onCopy={onCopy} />))
  act(() => container.querySelector("button")!.click())
  act(() => root!.unmount()); root = undefined
  const timers = vi.getTimerCount()
  await act(async () => { pending.resolve(); await pending.promise })
  expect(onCopy.mock.calls).toEqual([["success"]])
  expect(vi.getTimerCount()).toBe(timers)
})
