/**
 * @vitest-environment jsdom
 *
 * bottom シートのキーボード表示中の高さ上限から上端 safe-area を引く（issue #706）。
 *
 * 可視領域（visualViewport.height）はステータスバー / ダイナミックアイランドの裏まで含むため、
 * そのまま上限にすると背の高いシートの見出しが時計の裏に潜る。float 系（#337）は以前から
 * 引いていたが、bottom（swipeToClose 版を含む）が漏れていた。safeArea={false} で従来の値。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { Sheet, SheetContent, SheetTitle, resolveBottomSheetKeyboardStyle } from "../src/components/ui/sheet"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const SAFE_TOP = "var(--Safe-Area-Inset-Top, env(safe-area-inset-top, 0px))"

describe("resolveBottomSheetKeyboardStyle の safeArea（#706）", () => {
  it("safeArea=true は可視高さから上端 safe-area を引き、0 で下限を切る", () => {
    expect(resolveBottomSheetKeyboardStyle(300, 500, false, true)).toEqual({
      bottom: 300,
      maxHeight: `max(0px, calc(500px - ${SAFE_TOP}))`,
    })
  })
  it("safeArea 未指定 / false は従来どおり可視高さ（後方互換）", () => {
    expect(resolveBottomSheetKeyboardStyle(300, 500, false)).toEqual({ bottom: 300, maxHeight: 500 })
    expect(resolveBottomSheetKeyboardStyle(300, 500, false, false)).toEqual({ bottom: 300, maxHeight: 500 })
  })
  it("snap とキーボード非表示は safeArea に関わらず従来どおり", () => {
    expect(resolveBottomSheetKeyboardStyle(300, 500, true, true)).toEqual({ bottom: 300 })
    expect(resolveBottomSheetKeyboardStyle(0, 500, false, true)).toBeUndefined()
    expect(resolveBottomSheetKeyboardStyle(300, null, false, true)).toEqual({ bottom: 300, maxHeight: undefined })
  })
})

describe("sheet-keyboard.css の CSS フォールバック（#706）", () => {
  const css = readFileSync(join(__dirname, "..", "src/styles/sheet-keyboard.css"), "utf8")
  it("safeArea={false} 以外の bottom シートは --kb-h と上端 safe-area の両方を引く", () => {
    expect(css).toContain(
      '[data-slot="sheet-content"]:is([data-side="bottom"], [data-side="bottom-glass"]):not([data-snap-active]):not([data-safe-area="false"])',
    )
    expect(css).toContain(
      `max-height: max(0px, calc(100dvh - var(--kb-h, 0px) - ${SAFE_TOP}));`,
    )
  })
  it("lift と従来の max-height も JS と同じく bottom / bottom-glass の両方に当てる", () => {
    expect(css).toContain('html[data-kb-open] [data-slot="sheet-content"]:is([data-side="bottom"], [data-side="bottom-glass"]) {')
    expect(css).toContain('[data-slot="sheet-content"]:is([data-side="bottom"], [data-side="bottom-glass"]):not([data-snap-active]) {')
  })
  it("safeArea={false} 用の従来の値（safe-area を引かない）も残す", () => {
    expect(css).toMatch(/max-height:\s*calc\(100dvh - var\(--kb-h, 0px\)\);/)
  })
})

describe("swipeToClose 版も data-safe-area を出す（#706）", () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null
  afterEach(() => {
    act(() => root?.unmount())
    container?.remove()
    document.body.innerHTML = ""
  })
  const mount = (ui: React.ReactElement) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
    act(() => root!.render(ui))
    return document.querySelector<HTMLElement>('[data-slot="sheet-content"]')!
  }

  it.each([
    [undefined, "true"],
    [false, "false"],
  ] as const)("safeArea=%s → data-safe-area=%s", (safeArea, expected) => {
    const content = mount(
      <Sheet open>
        <SheetContent side="bottom" swipeToClose safeArea={safeArea}>
          <SheetTitle>t</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    expect(content.dataset.side).toBe("bottom")
    expect(content.dataset.safeArea).toBe(expected)
  })
})

describe("キーボード表示中の inline の高さ上限（#706）", () => {
  const originalVV = Object.getOwnPropertyDescriptor(window, "visualViewport")
  const originalInner = window.innerHeight
  let container: HTMLDivElement | null = null
  let root: Root | null = null
  beforeEach(() => {
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 })
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: { height: 500, offsetTop: 0, addEventListener: () => {}, removeEventListener: () => {} },
    })
  })
  afterEach(() => {
    act(() => root?.unmount())
    container?.remove()
    document.body.innerHTML = ""
    Object.defineProperty(window, "innerHeight", { configurable: true, value: originalInner })
    if (originalVV) Object.defineProperty(window, "visualViewport", originalVV)
    else delete (window as { visualViewport?: unknown }).visualViewport
  })
  const contentStyle = (ui: React.ReactElement) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
    act(() => root!.render(ui))
    return document.querySelector<HTMLElement>('[data-slot="sheet-content"]')!.getAttribute("style") ?? ""
  }

  it.each(["bottom", "bottom-glass"] as const)("%s / safeArea={false} は従来どおり可視高さ（500px）", (side) => {
    for (const swipeToClose of [false, true]) {
      const style = contentStyle(
        <Sheet open>
          <SheetContent side={side} swipeToClose={swipeToClose} safeArea={false}>
            <SheetTitle>t</SheetTitle>
          </SheetContent>
        </Sheet>,
      )
      expect(style).toContain("bottom: 300px")
      expect(style).toContain("max-height: 500px")
      act(() => root!.unmount())
      root = null
    }
  })

  it.each(["bottom", "bottom-glass"] as const)("%s / 既定（safeArea）は上端 safe-area を引く（500px のままにしない）", (side) => {
    for (const swipeToClose of [false, true]) {
      const style = contentStyle(
        <Sheet open>
          <SheetContent side={side} swipeToClose={swipeToClose}>
            <SheetTitle>t</SheetTitle>
          </SheetContent>
        </Sheet>,
      )
      expect(style).toContain("bottom: 300px")
      expect(style).not.toContain("max-height: 500px")
      expect(style).toContain("calc(500px - var(--Safe-Area-Inset-Top")
      act(() => root!.unmount())
      root = null
    }
  })
})
