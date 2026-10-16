import { afterEach, describe, expect, it } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import * as React from "react"
import { page } from "vitest/browser"
import { FormField } from "@/components/patterns/form-field"
import { Input } from "@/components/ui/input"
import "@/index.css"

/** FormField orientation="horizontal" の置き場所の幅による切り替え（issue #712 レビュー） */
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let root: Root | undefined
let container: HTMLDivElement | undefined
afterEach(() => {
  if (root) act(() => root!.unmount())
  container?.remove()
})

async function mount(width: number) {
  await page.viewport(390, 800)
  container = document.createElement("div")
  container.style.width = `${width}px`
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root!.render(
      <FormField orientation="horizontal" label="肩書き" htmlFor="t" endLabel="12/20">
        <Input id="t" variant="inline" targetSize="comfortable" />
      </FormField>,
    )
  })
  const label = document.querySelector("label")!.getBoundingClientRect()
  const input = document.querySelector("input")!.getBoundingClientRect()
  const end = document.querySelector('[data-slot="form-field-end-label"]')!.getBoundingClientRect()
  return { label, input, end }
}

describe("FormField horizontal の幅による切り替え", () => {
  it("置き場所が 15rem 以上なら 2 列（ラベル | 入力欄 + endLabel）", async () => {
    const { label, input, end } = await mount(343)
    expect(input.left).toBeGreaterThanOrEqual(label.left + 80)
    expect(Math.abs(input.top + input.height / 2 - (label.top + label.height / 2))).toBeLessThanOrEqual(1)
    expect(end.left).toBeGreaterThanOrEqual(input.right)
    expect(end.right).toBeLessThanOrEqual(343 + 1)
  })

  it("15rem 未満では縦積み（ラベルの下に入力欄）", async () => {
    const { label, input } = await mount(200)
    expect(input.top).toBeGreaterThanOrEqual(label.bottom)
    expect(Math.round(input.left)).toBe(Math.round(label.left))
  })
})
