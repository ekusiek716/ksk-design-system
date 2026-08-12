/**
 * @vitest-environment jsdom
 *
 * SheetContent side="top" / "float" / "float-glass" の safe-area 回避（Issue #339）
 *
 * - side="top" はステータスバーに標準で潜っていた（safe-area-inset-top 未考慮）。
 * - side="float" / "float-glass" は高さ制約が無く、背の高いコンテンツで
 *   キーボード非表示時も上端が画面外へ抜けていた（キーボード表示時の上限は
 *   #337 / PR #338 で対応済み）。
 * ここでは safeArea prop（既定 true）による回避と、false でのオプトアウトを
 * クラス文字列の contract として検証する（jsdom は env() を計算しないため）。
 *
 * 実行: npm run test
 */
import { describe, it, expect, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"

import { Sheet, SheetContent } from "../src/components/ui/sheet"

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
  const el = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
  expect(el).not.toBeNull()
  return el!
}

describe('SheetContent side="top" — safe-area（Issue #339）', () => {
  it("既定 (safeArea=true) は env(safe-area-inset-top) を含む padding-top を持つ", () => {
    mount(
      <Sheet open>
        <SheetContent side="top" description="desc">
          content
        </SheetContent>
      </Sheet>
    )
    const el = getContent()
    expect(el.getAttribute("data-safe-area")).toBe("true")
    expect(el.className).toContain("env(safe-area-inset-top,0px)")
    // 左右・下は通常の 1.5rem (p-6 相当) を維持する
    expect(el.className).toContain("px-6")
    expect(el.className).toContain("pb-6")
  })

  it("safeArea=false は従来どおり p-6 のみ（safe-area 無し）", () => {
    mount(
      <Sheet open>
        <SheetContent side="top" safeArea={false} description="desc">
          content
        </SheetContent>
      </Sheet>
    )
    const el = getContent()
    expect(el.getAttribute("data-safe-area")).toBe("false")
    expect(el.className).not.toContain("safe-area-inset")
    expect(el.className).toContain("p-6")
  })

  it("padding=false + safeArea=true は env() のみの padding-top を追加する", () => {
    mount(
      <Sheet open>
        <SheetContent side="top" padding={false} description="desc">
          content
        </SheetContent>
      </Sheet>
    )
    const el = getContent()
    expect(el.className).toContain("pt-[env(safe-area-inset-top,0px)]")
    expect(el.className).not.toContain("px-6")
  })

  it("padding=false + safeArea=false は padding を一切追加しない（従来挙動）", () => {
    mount(
      <Sheet open>
        <SheetContent side="top" padding={false} safeArea={false} description="desc">
          content
        </SheetContent>
      </Sheet>
    )
    const el = getContent()
    expect(el.className).not.toContain("safe-area-inset")
    expect(el.className).not.toContain("p-6")
  })
})

describe('SheetContent side="bottom" — safeArea prop は無効果（非破壊確認）', () => {
  it("side=top/float 以外では safeArea による差分が出ない", () => {
    mount(
      <Sheet open>
        <SheetContent side="bottom" description="desc">
          content
        </SheetContent>
      </Sheet>
    )
    const el = getContent()
    expect(el.className).toContain("p-6")
    expect(el.className).not.toContain("safe-area-inset")
  })
})

describe.each(["float", "float-glass"] as const)(
  'SheetContent side="%s" — 既定の高さキャップ（Issue #339）',
  (side) => {
    it("既定 (safeArea=true) はキーボード非表示時も上端が抜けない max-height を持つ", () => {
      mount(
        <Sheet open>
          <SheetContent side={side} description="desc">
            content
          </SheetContent>
        </Sheet>
      )
      const el = getContent()
      expect(el.getAttribute("data-safe-area")).toBe("true")
      expect(el.className).toContain(
        "max-h-[max(0px,calc(100dvh_-_1.5rem_-_env(safe-area-inset-top,0px)))]"
      )
    })

    it("safeArea=false は高さキャップを付けない（従来挙動）", () => {
      mount(
        <Sheet open>
          <SheetContent side={side} safeArea={false} description="desc">
            content
          </SheetContent>
        </Sheet>
      )
      const el = getContent()
      expect(el.className).not.toContain("max-h-[max(0px,calc(100dvh")
    })
  }
)

/**
 * #339 が「data-slot が上書きされてセレクタ追随漏れが起きた」と報告している点。
 * styles/sheet-keyboard.css のキーボード追従は全て `[data-slot="sheet-content"]`
 * を起点にしているので、consumer が data-slot を渡して上書きできると補正が
 * 丸ごと外れる。SheetContent 側で spread より後ろに置いて構造的に防ぐ。
 */
describe("data-slot は consumer から上書きできない（#339）", () => {
  it("data-slot を渡しても sheet-content のまま", () => {
    mount(
      <Sheet open>
        {/* @ts-expect-error 誤用の再現。型では防げても JS からは渡せる */}
        <SheetContent side="bottom" data-slot="my-sheet" description="desc">
          content
        </SheetContent>
      </Sheet>
    )
    expect(document.querySelector('[data-slot="my-sheet"]')).toBeNull()
    expect(getContent().getAttribute("data-slot")).toBe("sheet-content")
  })

  it("swipeToClose 経路でも同じ", () => {
    mount(
      <Sheet open>
        {/* @ts-expect-error 誤用の再現 */}
        <SheetContent side="bottom" swipeToClose data-slot="my-sheet" description="desc">
          content
        </SheetContent>
      </Sheet>
    )
    expect(document.querySelector('[data-slot="my-sheet"]')).toBeNull()
    expect(getContent().getAttribute("data-slot")).toBe("sheet-content")
  })
})
