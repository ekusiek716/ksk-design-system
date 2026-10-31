/**
 * @vitest-environment jsdom
 *
 * Web Progress が進捗の値を支援技術へ渡すこと（issue #796）。
 * 以前は value を Radix の Root に渡しておらず、`aria-valuenow` が付かず
 * `data-state` も常に "indeterminate" だった（読み上げで何 % か伝わらない）。
 */
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Progress } from "../src/components/ui/progress"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

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
  vi.restoreAllMocks()
})

const bar = () => container.querySelector<HTMLElement>('[role="progressbar"]')!

describe("Web Progress の読み上げ値（#796）", () => {
  it("value を aria-valuenow に渡し、data-state は loading になる", () => {
    act(() => root.render(<Progress value={42} />))
    expect(bar().getAttribute("aria-valuenow")).toBe("42")
    expect(bar().getAttribute("aria-valuemin")).toBe("0")
    expect(bar().getAttribute("aria-valuemax")).toBe("100")
    expect(bar().getAttribute("data-state")).toBe("loading")
  })

  it("100 で data-state は complete", () => {
    act(() => root.render(<Progress value={100} />))
    expect(bar().getAttribute("aria-valuenow")).toBe("100")
    expect(bar().getAttribute("data-state")).toBe("complete")
  })

  it.each([
    [120, "100"],
    [-10, "0"],
  ])("範囲外の value=%s はクランプ後の値になり、console.error を出さない", (value, expected) => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    act(() => root.render(<Progress value={value} autoColor />))
    expect(bar().getAttribute("aria-valuenow")).toBe(expected)
    expect(error).not.toHaveBeenCalled()
  })

  it("autoColor の判定はクランプ前の値で行う（120 は caution）", () => {
    act(() => root.render(<Progress value={120} autoColor />))
    expect(bar().getAttribute("data-variant")).toBe("caution")
  })

  it("masked では実値を aria-valuenow に出さない", () => {
    act(() => root.render(<Progress value={73} masked />))
    expect(bar().hasAttribute("aria-valuenow")).toBe(false)
    expect(bar().hasAttribute("aria-valuetext")).toBe(false)
    expect(bar().outerHTML).not.toContain("73")
  })

  it("value 未指定・null は従来どおり不確定（aria-valuenow なし・data-state=indeterminate）", () => {
    act(() => root.render(<Progress />))
    expect(bar().hasAttribute("aria-valuenow")).toBe(false)
    expect(bar().getAttribute("data-state")).toBe("indeterminate")
    act(() => root.render(<Progress value={null} />))
    expect(bar().hasAttribute("aria-valuenow")).toBe(false)
  })
})
