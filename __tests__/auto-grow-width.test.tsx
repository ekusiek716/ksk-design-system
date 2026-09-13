/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { expect, it, vi } from "vitest"
import { AutoGrowTextarea } from "../src/components/ui/auto-grow-textarea"

it("remeasures on element width changes and disconnects on unmount", () => {
  let notify: (() => void) | undefined
  const disconnect = vi.fn(), observe = vi.fn()
  vi.stubGlobal("ResizeObserver", class {
    constructor(callback: () => void) { notify = callback }
    observe = observe
    disconnect = disconnect
  })
  const frames = new Map<number, FrameRequestCallback>()
  let frameId = 0
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback)
    return frameId
  })
  const cancelFrame = vi.fn((id: number) => frames.delete(id))
  vi.stubGlobal("cancelAnimationFrame", cancelFrame)
  const flushFrames = () => {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((callback) => callback(0))
  }
  let width = 500, scrollHeight = 100
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ width }) as DOMRect)
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(() => scrollHeight)
  const container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)
  try {
    act(() => root.render(<AutoGrowTextarea value="long text" onChange={() => {}} />))
    const textarea = container.querySelector("textarea")!
    const initial = parseFloat(textarea.style.height)
    width = 200; scrollHeight = 300
    act(() => notify?.())
    expect(parseFloat(textarea.style.height)).toBe(initial)
    act(flushFrames)
    expect(parseFloat(textarea.style.height)).toBeGreaterThan(initial)
    scrollHeight = 400
    act(() => notify?.())
    act(flushFrames)
    expect(parseFloat(textarea.style.height)).toBeLessThan(400)
    expect(observe).toHaveBeenCalledWith(textarea)
    width = 250
    act(() => notify?.())
    expect(frames.size).toBe(1)
  } finally {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  }
  expect(disconnect).toHaveBeenCalledTimes(1)
  expect(cancelFrame).toHaveBeenCalled()
  expect(frames.size).toBe(0)
})
