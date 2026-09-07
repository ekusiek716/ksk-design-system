/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CoachMarkOverlay, type CoachStep } from "../src/components/patterns/coach-mark-overlay"

// Inspect the geometry/placement handed to CoachMark. jsdom has no layout engine;
// the real Radix focus/portal integration is covered by the focus-trap suite.
vi.mock("../src/components/ui/coach-mark", () => ({
  CoachMark: ({ children, placement, onNext }: {
    children: React.ReactNode
    placement: string
    onNext: () => void
  }) => <div data-testid="coach" data-placement={placement}>
    {children}
    <button onClick={onNext}>Next</button>
  </div>,
}))

let root: Root
let container: HTMLDivElement
let rect: DOMRect
let target: HTMLDivElement

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => setTimeout(() => cb(0), 16))
  vi.stubGlobal("cancelAnimationFrame", clearTimeout)
  vi.stubGlobal("innerHeight", 1000)
  container = document.createElement("div")
  target = document.createElement("div")
  target.id = "anchor-target"
  target.scrollIntoView = vi.fn()
  rect = new DOMRect(120, 240, 180, 80)
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(() => rect)
  document.body.append(container, target)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  act(() => vi.runOnlyPendingTimers())
  container.remove()
  target.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function render(steps: CoachStep[]) {
  act(() => root.render(<CoachMarkOverlay open steps={steps} onComplete={() => {}} />))
  act(() => vi.advanceTimersByTime(50))
}

function anchor() {
  return document.querySelector<HTMLElement>('[data-testid="coach"] > span')!
}

function expectTargetEdges() {
  const { top, left, width, height } = anchor().style
  expect(Number.parseFloat(top)).toBe(rect.top)
  expect(Number.parseFloat(left)).toBe(rect.left)
  expect(Number.parseFloat(left) + Number.parseFloat(width)).toBe(rect.right)
  expect(Number.parseFloat(top) + Number.parseFloat(height)).toBe(rect.bottom)
  expect(anchor().classList.contains("pointer-events-none")).toBe(true)
  expect(anchor().getAttribute("aria-hidden")).toBe("true")
}

describe("CoachMarkOverlay anchor geometry", () => {
  it.each(["top", "bottom", "left", "right"] as const)("%s uses the target's four outer edges", (placement) => {
    render([{ selector: "#anchor-target", title: "Target", desc: "Description", placement, padding: 24 }])
    expectTargetEdges()
    expect(document.querySelector('[data-testid="coach"]')?.getAttribute("data-placement")).toBe(placement)
  })

  it.each([undefined, "auto"] as const)("%s placement uses the bottom edge and switches above when space runs out", (placement) => {
    render([{ selector: "#anchor-target", title: "Target", desc: "Description", placement }])
    expectTargetEdges()
    expect(document.querySelector('[data-testid="coach"]')?.getAttribute("data-placement")).toBe("bottom")
    rect = new DOMRect(120, 850, 180, 80)
    act(() => window.dispatchEvent(new Event("resize")))
    expectTargetEdges()
    expect(document.querySelector('[data-testid="coach"]')?.getAttribute("data-placement")).toBe("top")
  })

  it("tracks scroll and resize, including partially offscreen targets", () => {
    render([{ selector: "#anchor-target", title: "Target", desc: "Description" }])
    rect = new DOMRect(-10, -20, 250, 90)
    act(() => target.dispatchEvent(new Event("scroll")))
    expectTargetEdges()
    rect = new DOMRect(30, 60, 320, 160)
    act(() => window.dispatchEvent(new Event("resize")))
    expectTargetEdges()
  })

  it("remeasures the next step and retains the missing-target fallback", () => {
    render([
      { selector: "#anchor-target", title: "First", desc: "Description" },
      { selector: "#anchor-target", title: "Second", desc: "Description", placement: "right" },
      { selector: "#missing", title: "Missing", desc: "Description" },
    ])
    rect = new DOMRect(420, 360, 40, 140)
    act(() => document.querySelector<HTMLButtonElement>('[data-testid="coach"] button')!.click())
    expectTargetEdges()
    expect(target.scrollIntoView).toHaveBeenCalledTimes(2)
    act(() => document.querySelector<HTMLButtonElement>('[data-testid="coach"] button')!.click())
    expect(anchor().style.top).toBe("50%")
    expect(anchor().style.left).toBe("50%")
    expect(anchor().style.width).toBe("")
    expect(anchor().style.height).toBe("")
  })
})
