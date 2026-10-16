/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it } from "vitest"
import { Toaster } from "../src/components/ui/toast"

// issue #691: Toast viewport の左右余白・最大幅（product theme 変数）と中央寄せ（position）。
let root: Root | undefined
function render(ui: React.ReactNode) {
  const host = document.createElement("div")
  document.body.append(host)
  root = createRoot(host)
  act(() => root!.render(ui))
}
afterEach(() => {
  act(() => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})
const viewport = () => document.querySelector<HTMLElement>("[data-slot='toast-viewport']")!
const cls = () => viewport().className.split(" ")

describe("Toast viewport の位置（#691）", () => {
  it("既定 bottom-end: 左右は変数・sm 以上は右寄せで最大幅は変数", () => {
    render(<Toaster />)
    expect(viewport().dataset.position).toBe("bottom-end")
    expect(cls()).toEqual(
      expect.arrayContaining([
        "left-[var(--Toast-Viewport-Offset-X)]",
        "right-[var(--Toast-Viewport-Offset-X)]",
        "sm:left-auto",
        "sm:max-w-[var(--Toast-Viewport-Max-Width)]",
      ]),
    )
    expect(cls()).not.toContain("mx-auto")
  })
  it("bottom-center: 左右の余白の内側で中央寄せ、最大幅は常時", () => {
    render(<Toaster position="bottom-center" />)
    expect(viewport().dataset.position).toBe("bottom-center")
    expect(cls()).toEqual(expect.arrayContaining(["mx-auto", "max-w-[var(--Toast-Viewport-Max-Width)]"]))
    expect(cls()).not.toContain("sm:left-auto")
  })
})
