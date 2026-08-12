/**
 * @vitest-environment jsdom
 *
 * DialogContent position="fullscreen" / "top" の safe-area 回避（Issue #339）
 *
 * 全画面系 Dialog はステータスバー/ノッチに標準で潜っていた。fullscreen は
 * 新規追加、top は従来から safe-area-inset-top を確保していたが opt-out が
 * 無かった。ここでは:
 *   - fullscreen が既定で上下に env(safe-area-inset-top/bottom) を確保する
 *   - safeArea=false で回避を無効化できる（opt-out）
 *   - center は影響を受けない（非破壊）
 * ことを DOM のクラス文字列で検証する。jsdom は env() を計算しないため、
 * クラス文字列の contract テストとして行う（sheet-keyboard-float.test.ts と
 * 同じ方針）。
 *
 * 実行: npm run test
 */
import { describe, it, expect, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"

import { Dialog, DialogContent } from "../src/components/ui/dialog"

let container: HTMLElement | null = null
let root: Root | null = null

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(ui)
  })
}

afterEach(() => {
  if (root) {
    act(() => {
      root!.unmount()
    })
    root = null
  }
  if (container) {
    container.remove()
    container = null
  }
  document.body.innerHTML = ""
})

function getContent(): HTMLElement {
  const el = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')
  expect(el).not.toBeNull()
  return el!
}

describe("DialogContent position=\"fullscreen\"（Issue #339）", () => {
  it("既定で inset-0 になり中央寄せ・幅キャップが外れる", () => {
    mount(
      <Dialog open>
        <DialogContent position="fullscreen" description="desc">
          content
        </DialogContent>
      </Dialog>
    )
    const el = getContent()
    expect(el.getAttribute("data-position")).toBe("fullscreen")
    expect(el.className).toContain("inset-0")
    expect(el.className).toContain("max-w-none")
    expect(el.className).not.toContain("max-w-[calc(100%_-_3rem)]")
    expect(el.className).not.toContain("translate-x-[-50%]")
  })

  it("既定 (safeArea=true) で上下に env(safe-area-inset-*) を確保する", () => {
    mount(
      <Dialog open>
        <DialogContent position="fullscreen" description="desc">
          content
        </DialogContent>
      </Dialog>
    )
    const el = getContent()
    expect(el.getAttribute("data-safe-area")).toBe("true")
    expect(el.className).toContain("env(safe-area-inset-top")
    expect(el.className).toContain("env(safe-area-inset-bottom")
  })

  it("safeArea=false で safe-area 回避を無効化できる（オプトアウト）", () => {
    mount(
      <Dialog open>
        <DialogContent position="fullscreen" safeArea={false} description="desc">
          content
        </DialogContent>
      </Dialog>
    )
    const el = getContent()
    expect(el.getAttribute("data-safe-area")).toBe("false")
    expect(el.className).not.toContain("safe-area-inset")
    // padding=true (既定) はそのまま p-6 にフォールバックする
    expect(el.className).toContain("p-6")
  })

  it("padding=false + fullscreen でも safe-area の余白のみ確保する", () => {
    mount(
      <Dialog open>
        <DialogContent position="fullscreen" padding={false} description="desc">
          content
        </DialogContent>
      </Dialog>
    )
    const el = getContent()
    expect(el.className).toContain("pt-[env(safe-area-inset-top,0px)]")
    expect(el.className).toContain("pb-[env(safe-area-inset-bottom,0px)]")
  })
})

describe("DialogContent position=\"top\" — safeArea opt-out（Issue #339）", () => {
  it("既定 (safeArea=true) は従来どおり max(env(...), 2rem) を使う", () => {
    mount(
      <Dialog open>
        <DialogContent position="top" description="desc">
          content
        </DialogContent>
      </Dialog>
    )
    const el = getContent()
    expect(el.className).toContain("top-[max(env(safe-area-inset-top),2rem)]")
  })

  it("safeArea=false は固定 2rem 相当のオフセットにフォールバックする", () => {
    mount(
      <Dialog open>
        <DialogContent position="top" safeArea={false} description="desc">
          content
        </DialogContent>
      </Dialog>
    )
    const el = getContent()
    expect(el.className).not.toContain("safe-area-inset-top")
    expect(el.className).toContain("top-8")
  })
})

describe("DialogContent position=\"center\"（既定・非破壊確認）", () => {
  it("safeArea prop を渡しても center の見た目は変わらない", () => {
    mount(
      <Dialog open>
        <DialogContent description="desc">content</DialogContent>
      </Dialog>
    )
    const el = getContent()
    expect(el.getAttribute("data-position")).toBe("center")
    expect(el.className).toContain("top-[50%]")
    expect(el.className).toContain("translate-x-[-50%]")
    expect(el.className).toContain("translate-y-[-50%]")
    expect(el.className).not.toContain("safe-area-inset")
  })
})
