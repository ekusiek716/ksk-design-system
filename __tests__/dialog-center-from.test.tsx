/** @vitest-environment jsdom */
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../src/components/ui/dialog"
import { resetDevWarnings } from "../src/lib/dev-warn"

// issue #713: centerFrom / height / size="2xl" / DialogHeader variant="bar"
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
let cleanup: (() => void) | undefined
afterEach(() => cleanup?.())

function open(props: Partial<React.ComponentProps<typeof DialogContent>>) {
  const host = document.createElement("div")
  document.body.appendChild(host)
  const root = createRoot(host)
  act(() => {
    root.render(
      <Dialog open>
        <DialogContent {...props}>
          <DialogTitle>t</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
  })
  cleanup = () => {
    act(() => root.unmount())
    host.remove()
  }
  return document.querySelector<HTMLElement>('[data-slot="dialog-content"]')!
}

describe("Dialog centerFrom（#713）", () => {
  it("既定（全画面・中央）は新しい属性・クラスを出さない", () => {
    const fs = open({ position: "fullscreen" })
    expect(fs.hasAttribute("data-center-from")).toBe(false)
    expect(fs.hasAttribute("data-height")).toBe(false)
    expect(fs.className).not.toMatch(/\bmd:/)
    cleanup?.()
    const center = open({})
    expect(center.className).not.toContain("h-[calc(100dvh_-_4rem)]")
  })

  it("fullscreen + centerFrom=md は md: で中央・size の幅・高さ上限を足す", () => {
    const el = open({ position: "fullscreen", centerFrom: "md", size: "xl" })
    expect(el.dataset.centerFrom).toBe("md")
    expect(el.className).toContain("inset-0")
    expect(el.className).toContain("md:inset-auto")
    expect(el.className).toContain("md:max-w-[min(800px,calc(100%_-_3rem))]")
    expect(el.className).toContain("md:max-h-[calc(100dvh_-_4rem)]")
    expect(el.className).toContain("md:pl-6")
    // 全画面側（境界未満）の safe-area 込みの padding は残る
    expect(el.className).toContain("pl-[max(1.5rem,env(safe-area-inset-left,0px))]")
  })

  it("centerFrom は fullscreen 以外では無視する", () => {
    const el = open({ position: "center", centerFrom: "md" })
    expect(el.hasAttribute("data-center-from")).toBe(false)
    expect(el.className).not.toContain("md:inset-auto")
  })

  it('height="fill" は center と centerFrom の中央表示で高さを固定する', () => {
    const center = open({ height: "fill" })
    expect(center.dataset.height).toBe("fill")
    expect(center.className).toContain("h-[calc(100dvh_-_4rem)]")
    cleanup?.()
    const fs = open({ position: "fullscreen", centerFrom: "lg", height: "fill" })
    expect(fs.className).toContain("lg:h-[calc(100dvh_-_4rem)]")
  })

  it('size="2xl" は 1024px', () => {
    expect(open({ size: "2xl" }).className).toContain("sm:max-w-[1024px]")
  })
})

describe('DialogHeader variant="bar"（#713）', () => {
  it("下線付きの帯で、children を左・trailing を右に置く", () => {
    const markup = renderToStaticMarkup(
      <DialogHeader variant="bar" trailing={<button type="button">閉じる</button>}>
        <span>見出し</span>
      </DialogHeader>,
    )
    expect(markup).toContain('data-variant="bar"')
    expect(markup).toContain("border-b border-[var(--Border-Low-Emphasis)]")
    expect(markup).toMatch(/dialog-header-text.*見出し.*dialog-header-trailing.*閉じる/)
  })

  it("既定（stack）は従来どおり", () => {
    expect(renderToStaticMarkup(<DialogHeader trailing="x">a</DialogHeader>)).toBe(
      '<div data-slot="dialog-header" class="flex flex-col gap-2">a</div>',
    )
  })
})

describe("Dialog レビュー指摘（#713）", () => {
  it("centerFrom の中央表示にも center と同じ ksk-squircle を付ける（既定の全画面には付けない）", () => {
    expect(open({ position: "fullscreen", centerFrom: "md" }).className).toContain("ksk-squircle")
    cleanup?.()
    expect(open({ position: "fullscreen" }).className).not.toContain("ksk-squircle")
  })

  it("safeArea={false} + centerFrom は全画面側も中央側も p-6 で、safe-area の padding を出さない", () => {
    const el = open({ position: "fullscreen", centerFrom: "md", safeArea: false })
    expect(el.className).toContain("p-6")
    expect(el.className).not.toContain("safe-area-inset")
    expect(el.className).not.toContain("md:pl-6")
    expect(el.className).toContain("md:inset-auto")
  })

  it('height="fill" が効かない組み合わせ（top / centerFrom の無い fullscreen）は開発ビルドで 1 回警告する', () => {
    resetDevWarnings()
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    open({ position: "top", height: "fill" })
    cleanup?.()
    open({ position: "fullscreen", height: "fill" })
    cleanup?.()
    open({ position: "fullscreen", centerFrom: "md", height: "fill" })
    cleanup?.()
    open({ position: "center", height: "fill" })
    expect(warn).toHaveBeenCalledTimes(2)
    expect(String(warn.mock.calls[0][0])).toContain('position="top"')
    expect(String(warn.mock.calls[1][0])).toContain("centerFrom")
    warn.mockRestore()
  })

  it('DialogHeader variant="bar" で trailing が無いと開発ビルドで警告する', () => {
    resetDevWarnings()
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const host = document.createElement("div")
    const root = createRoot(host)
    act(() => root.render(<DialogHeader variant="bar">見出し</DialogHeader>))
    act(() => root.render(<DialogHeader variant="bar" trailing={<span>x</span>}>見出し</DialogHeader>))
    act(() => root.unmount())
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain("trailing")
    warn.mockRestore()
  })
})
