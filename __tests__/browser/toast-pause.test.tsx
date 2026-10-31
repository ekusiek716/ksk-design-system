import { afterEach, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { userEvent } from "vitest/browser"
import { Toaster, useToast } from "@/components/ui/toast"
import "@/index.css"

/**
 * Toast の自動消去の一時停止を実ブラウザで固定する（issue #798）。
 *
 * jsdom の `:focus-visible` は focus 中なら常に真のため、「マウスで action を押すと
 * ブラウザがボタンへフォーカスを移し、フォーカスで止めると別の場所を押すまで消えない」
 * 不具合は jsdom では再現できない。chromium の実マウス・実キーボードで、
 * (a) マウスで action を押してポインタを離せば duration で消える
 * (b) Tab で action にフォーカスしている間は消えない、の 2 点を確かめる。
 */

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
const DURATION = 400

let root: Root | undefined
let container: HTMLDivElement | undefined
let outside: HTMLButtonElement | undefined
let show: ReturnType<typeof useToast>["toast"] | undefined

function Capture() {
  show = useToast().toast
  return null
}

afterEach(() => {
  for (const el of document.querySelectorAll<HTMLButtonElement>('[data-slot="toast"] [data-slot="button"]')) {
    act(() => el.click())
  }
  if (root) act(() => root!.unmount())
  root = undefined
  container?.remove()
  outside?.remove()
})

function mount() {
  outside = document.createElement("button")
  outside.textContent = "外のボタン"
  outside.style.cssText = "position:absolute;left:20px;top:20px;width:120px;height:40px"
  document.body.appendChild(outside)
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root!.render(<Toaster><Capture /></Toaster>))
  const onClick = vi.fn()
  act(() => show!({ title: "削除しました", duration: DURATION, action: { label: "元に戻す", onClick } }))
  const action = document.querySelector<HTMLButtonElement>('[data-slot="toast-action"]')!
  return { action, onClick }
}

const toasts = () => document.querySelectorAll('[data-slot="toast"]')
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

it("マウスで action を押し、ポインタをトーストの外へ出せば duration で消える", async () => {
  const { action, onClick } = mount()
  await userEvent.click(action)
  expect(onClick).toHaveBeenCalledTimes(1)
  // 押した後もボタンにフォーカスは残る（:focus-visible ではない）
  expect(document.activeElement).toBe(action)
  expect(action.matches(":focus-visible")).toBe(false)
  await userEvent.hover(outside!)
  await wait(DURATION + 300)
  expect(toasts()).toHaveLength(0)
})

it("Tab で action にフォーカスしている間は消えない", async () => {
  const { action } = mount()
  await userEvent.hover(outside!)
  outside!.focus()
  await userEvent.keyboard("{Tab}")
  expect(document.activeElement).toBe(action)
  expect(action.matches(":focus-visible")).toBe(true)
  await wait(DURATION + 300)
  expect(toasts()).toHaveLength(1)
})
