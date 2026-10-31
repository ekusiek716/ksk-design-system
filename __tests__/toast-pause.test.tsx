/**
 * @vitest-environment jsdom
 *
 * Toast の自動消去タイマーは、ポインタが乗っている間・トースト内にフォーカスがある間は止まり、
 * 離れると残り時間から再開する（issue #798。WCAG 2.2.1 時間調整）。
 * 以前は表示時に setTimeout を 1 本張るだけで、「元に戻す」を押そうとした直前に消えていた。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Toaster, toast, useToast } from "../src/components/ui/toast"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let show: ReturnType<typeof useToast>["toast"] | undefined

function Capture() {
  show = useToast().toast
  return null
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] })
  const host = document.createElement("div")
  document.body.append(host)
  root = createRoot(host)
  act(() => root!.render(<Toaster><Capture /></Toaster>))
})

afterEach(() => {
  // 残ったトーストを片付ける（store はモジュール共有）
  for (const el of document.querySelectorAll<HTMLButtonElement>('[data-slot="toast"] [data-slot="button"]')) {
    act(() => el.click())
  }
  act(() => root?.unmount())
  root = undefined
  document.body.replaceChildren()
  vi.useRealTimers()
})

const toasts = () => document.querySelectorAll<HTMLElement>('[data-slot="toast"]')
const firstToast = () => toasts()[0]
const advance = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })
const hover = (el: Element) => act(() => {
  el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, relatedTarget: document.body }))
})
const unhover = (el: Element) => act(() => {
  el.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body }))
})

function showUndoToast(duration = 4000) {
  const onClick = vi.fn()
  act(() => show!({ title: "削除しました", duration, action: { label: "元に戻す", onClick } }))
  return onClick
}

describe("Toast の自動消去の一時停止（#798）", () => {
  it("一時停止しなければ従来どおり duration で消える", () => {
    showUndoToast(4000)
    advance(3999)
    expect(toasts()).toHaveLength(1)
    advance(1)
    expect(toasts()).toHaveLength(0)
  })

  it("ポインタが乗っている間は消えず、離れると残り時間から再開する", () => {
    showUndoToast(4000)
    advance(1000)
    hover(firstToast())
    advance(10_000)
    expect(toasts()).toHaveLength(1)
    unhover(firstToast())
    advance(2999)
    expect(toasts()).toHaveLength(1)
    advance(1)
    expect(toasts()).toHaveLength(0)
  })

  it("action にフォーカスがある間は消えず、トーストの外へ出ると残り時間から再開する", () => {
    const onClick = showUndoToast(4000)
    advance(500)
    const action = firstToast().querySelector<HTMLButtonElement>('[data-slot="toast-action"]')!
    act(() => action.focus())
    advance(10_000)
    expect(toasts()).toHaveLength(1)
    expect(document.activeElement).toBe(action)
    // トースト内の移動（action → 閉じるボタン）では再開しない
    const close = firstToast().querySelector<HTMLButtonElement>('[data-slot="button"]')!
    act(() => close.focus())
    advance(10_000)
    expect(toasts()).toHaveLength(1)
    // フォーカス中なら action を押せる
    act(() => action.click())
    expect(onClick).toHaveBeenCalledTimes(1)
    // 外へ出たら残り 3500ms で再開
    const outside = document.createElement("button")
    document.body.append(outside)
    act(() => outside.focus())
    advance(3499)
    expect(toasts()).toHaveLength(1)
    advance(1)
    expect(toasts()).toHaveLength(0)
  })

  it("ポインタとフォーカスの両方が外れるまで再開しない", () => {
    showUndoToast(4000)
    const action = firstToast().querySelector<HTMLButtonElement>('[data-slot="toast-action"]')!
    hover(firstToast())
    act(() => action.focus())
    unhover(firstToast())
    advance(10_000)
    expect(toasts()).toHaveLength(1)
    act(() => action.blur())
    advance(4000)
    expect(toasts()).toHaveLength(0)
  })

  it("duration: 0 は従来どおり自動で消えない（hover の出入りでもタイマーを張らない）", () => {
    showUndoToast(0)
    hover(firstToast())
    unhover(firstToast())
    advance(60_000)
    expect(toasts()).toHaveLength(1)
  })

  it("dismiss したトーストのタイマーは残らない", () => {
    showUndoToast(4000)
    expect(vi.getTimerCount()).toBe(1)
    act(() => firstToast().querySelector<HTMLButtonElement>('[data-slot="button"]')!.click())
    expect(toasts()).toHaveLength(0)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("fire-and-forget の toast() でも同じ viewport で止まる", () => {
    let id = ""
    act(() => {
      id = toast("保存しました", { duration: 4000 })
    })
    expect(id).not.toBe("")
    hover(firstToast())
    advance(10_000)
    expect(toasts()).toHaveLength(1)
    unhover(firstToast())
    advance(4000)
    expect(toasts()).toHaveLength(0)
  })
})
