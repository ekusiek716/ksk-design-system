import { afterEach, describe, expect, it } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import * as React from "react"
import { page } from "vitest/browser"
import { CollapsibleChipField } from "@/components/patterns/collapsible-chip-field"
import "@/index.css"

/** CollapsibleChipField の長い見出しが隣のチップ列に食い込まない（issue #717 レビュー） */
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let root: Root | undefined
let container: HTMLDivElement | undefined
afterEach(() => {
  if (root) act(() => root!.unmount())
  container?.remove()
})

describe("CollapsibleChipField の長い見出し", () => {
  it("6 文字以上の見出しは折り返し、チップ列と重ならない", async () => {
    await page.viewport(390, 800)
    container = document.createElement("div")
    container.style.width = "343px"
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root!.render(
        <CollapsibleChipField<"a" | "b">
          label="招待客との関係性"
          options={["a", "b"]}
          selected=""
          onSelect={() => undefined}
          getLabel={(k) => (k === "a" ? "友人" : "親族")}
        />,
      )
    })
    const label = document.querySelector('[data-slot="collapsible-chip-field-label"]')!.getBoundingClientRect()
    const group = document.querySelector('[role="radiogroup"]')!.getBoundingClientRect()
    expect(label.width).toBe(80)
    expect(label.right).toBeLessThanOrEqual(group.left)
    // 折り返して枠の中に収まる（はみ出さない）
    const el = document.querySelector<HTMLElement>('[data-slot="collapsible-chip-field-label"]')!
    expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth)
    expect(label.height).toBeGreaterThanOrEqual(44)
  })
})
