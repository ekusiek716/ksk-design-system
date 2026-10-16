import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, it } from "vitest"
import { page } from "vitest/browser"
import { Screen } from "@/components/patterns/screen"
import "@/index.css"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let root: Root | undefined
let host: HTMLDivElement | undefined
afterEach(() => {
  if (root) act(() => root!.unmount())
  host?.remove()
  root = undefined
  host = undefined
})
function mount(ui: React.ReactNode) {
  host = document.createElement("div")
  document.body.append(host)
  root = createRoot(host)
  act(() => root!.render(ui))
  return host
}

it("card は768pxで切り替わる（#701）", async () => {
  await page.viewport(767, 900)
  const host = mount(<Screen desktopLayout="card">本文</Screen>)
  const screen = host.querySelector<HTMLElement>('[data-slot="screen"]')!
  expect(getComputedStyle(screen).borderTopWidth).toBe("0px")
  await page.viewport(768, 900)
  expect(getComputedStyle(screen).borderTopWidth).toBe("1px")
  expect(parseFloat(getComputedStyle(screen).borderRadius)).toBeGreaterThan(0)
})

it.each([40, 300, 900])("fill card は親の高さ%dpxを超えず最大高も守る", async height => {
  await page.viewport(1280, 900)
  const host = mount(<div style={{ height }}><Screen height="fill" desktopLayout="card" cardMaxHeight="400px">本文</Screen></div>)
  const backdrop = host.querySelector<HTMLElement>('[data-slot="screen-backdrop"]')!
  const screen = host.querySelector<HTMLElement>('[data-slot="screen"]')!
  expect(backdrop.getBoundingClientRect().height).toBe(height)
  expect(screen.getBoundingClientRect().height).toBe(Math.min(height, 400))
})
