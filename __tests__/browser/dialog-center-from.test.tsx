import { afterEach, describe, expect, it } from "vitest"
import { createRoot, type Root } from "react-dom/client"
import { act } from "react"
import * as React from "react"
import { page } from "vitest/browser"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import "@/index.css"

/**
 * Dialog position="fullscreen" + centerFrom（issue #713）の寸法を実ブラウザで固定する。
 * 幅 390px は全画面、1280px は中央の 2xl（1024px）・高さ fill（画面 - 4rem）。
 */
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let container: HTMLDivElement | undefined

afterEach(() => {
  if (root) act(() => root!.unmount())
  container?.remove()
  root = undefined
  container = undefined
})

async function mount(node: React.ReactElement, width: number, height = 800) {
  await page.viewport(width, height)
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root!.render(node)
  })
  await new Promise((resolve) => setTimeout(resolve, 400))
}

const content = (props: Partial<React.ComponentProps<typeof DialogContent>> = {}) => (
  <Dialog open>
    <DialogContent position="fullscreen" centerFrom="md" size="2xl" padding={false} {...props}>
      <DialogHeader variant="bar" trailing={<span>x</span>}>
        <DialogTitle>配席表</DialogTitle>
        <DialogDescription>説明</DialogDescription>
      </DialogHeader>
      <div style={{ height: 120 }}>本文</div>
    </DialogContent>
  </Dialog>
)

const dialogRect = () => document.querySelector('[data-slot="dialog-content"]')!.getBoundingClientRect()

describe("Dialog centerFrom（#713）", () => {
  it("境界未満は従来どおりの全画面", async () => {
    await mount(content({ height: "fill" }), 390)
    const r = dialogRect()
    expect(r.left).toBe(0)
    expect(r.top).toBe(0)
    expect(r.width).toBe(390)
    expect(r.height).toBe(800)
    const style = getComputedStyle(document.querySelector('[data-slot="dialog-content"]')!)
    expect(style.borderTopLeftRadius).toBe("0px")
  })

  it("境界以上は中央の 2xl、height=fill で画面 - 4rem", async () => {
    await mount(content({ height: "fill" }), 1280)
    const r = dialogRect()
    expect(r.width).toBe(1024)
    expect(r.height).toBe(800 - 64)
    expect(r.left).toBe((1280 - 1024) / 2)
    expect(r.top).toBe(32)
    const style = getComputedStyle(document.querySelector('[data-slot="dialog-content"]')!)
    expect(style.borderTopLeftRadius).not.toBe("0px")
    expect(style.boxShadow).not.toBe("none")
  })

  it("height=auto は中身なり、狭い md では左右 24px を残す", async () => {
    await mount(content(), 800)
    const r = dialogRect()
    expect(r.width).toBe(800 - 48)
    expect(r.height).toBeLessThan(400)
    expect(Math.round(r.top + r.height / 2)).toBe(400)
  })

  it('padding（既定 true）は中央表示で safe-area を足さない p-6', async () => {
    await mount(content({ padding: true }), 1280)
    const style = getComputedStyle(document.querySelector('[data-slot="dialog-content"]')!)
    expect(style.paddingLeft).toBe("24px")
    expect(style.paddingTop).toBe("24px")
  })

  it("safeArea={false} + centerFrom: 全画面側・中央側とも p-6（padding=false なら 0）", async () => {
    await mount(content({ padding: true, safeArea: false }), 390)
    const el = () => getComputedStyle(document.querySelector('[data-slot="dialog-content"]')!)
    expect(el().paddingLeft).toBe("24px")
    expect(el().paddingTop).toBe("24px")
    act(() => root!.unmount())
    container!.remove()
    await mount(content({ padding: true, safeArea: false }), 1280)
    expect(el().paddingLeft).toBe("24px")
    expect(dialogRect().width).toBe(1024)
    act(() => root!.unmount())
    container!.remove()
    await mount(content({ padding: false, safeArea: false }), 1280)
    expect(el().paddingLeft).toBe("0px")
  })

  it('DialogHeader variant="bar" は下線付きで横並び', async () => {
    await mount(content(), 1280)
    const header = document.querySelector<HTMLElement>('[data-slot="dialog-header"]')!
    const style = getComputedStyle(header)
    expect(style.flexDirection).toBe("row")
    expect(style.borderBottomWidth).toBe("1px")
    expect(style.paddingLeft).toBe("24px")
    const text = header.querySelector('[data-slot="dialog-header-text"]')!.getBoundingClientRect()
    const trailing = header.querySelector('[data-slot="dialog-header-trailing"]')!.getBoundingClientRect()
    expect(trailing.left).toBeGreaterThanOrEqual(text.right)
  })
})
