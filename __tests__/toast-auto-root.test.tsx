/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"
import { Toaster, toast } from "../src/components/ui/toast"

// issue #771: toast() の auto-root は「Toaster が無く、トーストが 1 件以上ある間」だけ存在する。
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const AUTO = "[data-ksk-toast-auto-root]"
const autoRoot = () => document.querySelector(AUTO)
const flush = async () => {
  for (let i = 0; i < 3; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 30))
    })
  }
}

let roots: Root[] = []
function render(ui: React.ReactNode, host: Element = document.body.appendChild(document.createElement("div"))) {
  const root = createRoot(host)
  roots.push(root)
  act(() => root.render(ui))
  return root
}

async function dismissAll() {
  await flush()
  await act(async () => {
    document.querySelectorAll<HTMLButtonElement>("[data-slot='toast'] button[aria-label]").forEach((b) => b.click())
  })
  await flush()
}

beforeAll(async () => {
  // 動的 import の初回解決を済ませておく
  await import("react-dom/client")
})

afterEach(async () => {
  act(() => roots.forEach((r) => r.unmount()))
  roots = []
  await flush()
  await dismissAll()
  document.body.replaceChildren()
})

describe("toast() の auto-root（#771）", () => {
  it("Toaster がマウントされている間は body に auto-root を作らない", async () => {
    render(<Toaster />)
    act(() => {
      toast("hello", { duration: 0 })
    })
    await flush()
    expect(autoRoot()).toBeNull()
    expect(document.querySelectorAll("[data-slot='toast-viewport']")).toHaveLength(1)
  })

  it("Shadow DOM 内の Toaster でも body に auto-root を作らない", async () => {
    const host = document.body.appendChild(document.createElement("div"))
    const shadow = host.attachShadow({ mode: "open" })
    const inner = shadow.appendChild(document.createElement("div"))
    render(<Toaster container={shadow as unknown as HTMLElement} />, inner)
    act(() => {
      toast("hello", { duration: 0 })
    })
    await flush()
    expect(autoRoot()).toBeNull()
    expect(shadow.querySelector("[data-slot='toast-viewport']")).not.toBeNull()
  })

  it("Toaster が無いときは auto-root に出し、0 件になったら region ごと外す。次の toast() でまた作る", async () => {
    const id = toast("one", { duration: 0 })
    await flush()
    expect(autoRoot()).not.toBeNull()
    expect(document.querySelector("[role='region']")).not.toBeNull()
    act(() => toast.dismiss(id))
    await flush()
    expect(autoRoot()).toBeNull()
    expect(document.querySelector("[role='region']")).toBeNull()

    const id2 = toast("two", { duration: 0 })
    await flush()
    expect(autoRoot()).not.toBeNull()
    expect(document.body.textContent).toContain("two")
    act(() => toast.dismiss(id2))
    await flush()
    expect(autoRoot()).toBeNull()
  })

  it("1 件残っている間は region を残す", async () => {
    const a = toast("a", { duration: 0 })
    const b = toast("b", { duration: 0 })
    await flush()
    act(() => toast.dismiss(a))
    await flush()
    expect(autoRoot()).not.toBeNull()
    expect(document.body.textContent).toContain("b")
    act(() => toast.dismiss(b))
    await flush()
    expect(autoRoot()).toBeNull()
  })

  it("自動消去（duration）でも 0 件で外れる", async () => {
    // flush（約 90ms）より十分長い duration にして、確認前に自動消去されないようにする
    toast("short", { duration: 500 })
    await flush()
    expect(autoRoot()).not.toBeNull()
    await act(async () => {
      await new Promise((r) => setTimeout(r, 600))
    })
    await flush()
    expect(autoRoot()).toBeNull()
  })

  it("Toaster の unmount 後、残っていたトーストと新しい toast() は auto-root にフォールバックする", async () => {
    const root = render(<Toaster />)
    act(() => {
      toast("kept", { duration: 0 })
    })
    await flush()
    expect(autoRoot()).toBeNull()
    act(() => root.unmount())
    roots = roots.filter((r) => r !== root)
    await flush()
    expect(autoRoot()).not.toBeNull()
    expect(document.body.textContent).toContain("kept")
    act(() => {
      toast("after", { duration: 0 })
    })
    await flush()
    expect(document.body.textContent).toContain("after")
    await dismissAll()
    expect(autoRoot()).toBeNull()
  })

  it("auto-root 表示中に Toaster がマウントされたら引き継ぎ、auto-root を外す", async () => {
    toast("handover", { duration: 0 })
    await flush()
    expect(autoRoot()).not.toBeNull()
    render(<Toaster />)
    await flush()
    expect(autoRoot()).toBeNull()
    expect(document.querySelectorAll("[data-slot='toast-viewport']")).toHaveLength(1)
    expect(document.body.textContent).toContain("handover")
  })

  it("StrictMode の二重マウントで Toaster の数が狂わない（unmount 後は auto-root へ戻る）", async () => {
    const root = render(
      <React.StrictMode>
        <Toaster />
      </React.StrictMode>
    )
    act(() => {
      toast("strict", { duration: 0 })
    })
    await flush()
    expect(autoRoot()).toBeNull()
    act(() => root.unmount())
    roots = roots.filter((r) => r !== root)
    await flush()
    expect(autoRoot()).not.toBeNull()
    await dismissAll()
    expect(autoRoot()).toBeNull()
  })

  it("dismiss と同じ tick の toast() でもトーストが失われない", async () => {
    const id = toast("loading", { duration: 0 })
    await flush()
    act(() => {
      toast.dismiss(id)
      toast.success("done", { duration: 0 })
    })
    await flush()
    expect(document.body.textContent).toContain("done")
    expect(autoRoot()).not.toBeNull()
  })

  it("region が先に DOM に入り、その後にトーストの中身が入る", async () => {
    const seen: Array<{ region: boolean; toast: boolean }> = []
    const mo = new MutationObserver(() => {
      seen.push({
        region: !!document.querySelector("[role='region']"),
        toast: !!document.querySelector("[data-slot='toast']"),
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })
    toast("order", { duration: 0 })
    await flush()
    mo.disconnect()
    expect(seen.some((s) => s.region && !s.toast)).toBe(true)
    expect(seen.some((s) => s.toast)).toBe(true)
    expect(seen.every((s) => !s.toast || s.region)).toBe(true)
  })

  it("fake timer を使う自動消去でも壊れない", async () => {
    vi.useFakeTimers()
    try {
      toast("fake", { duration: 100 })
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300)
      })
    } finally {
      vi.useRealTimers()
    }
    await flush()
    expect(autoRoot()).toBeNull()
  })
})
