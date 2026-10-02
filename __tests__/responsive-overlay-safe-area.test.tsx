/**
 * @vitest-environment jsdom
 *
 * issue #599: ResponsiveOverlayFrame のモバイル分岐が
 *   ① 下余白に home indicator の safe-area（env(safe-area-inset-bottom)）を含める
 *   ② side="float" / "float-glass" が既定の最大高さ（85dvh / lg: min(85dvh,46rem)）を持つ
 * ことを固定する。consumer（belle-todo）が className で書き足していた `pb-8` や
 * `max-h-[85dvh]` は twMerge で既定を置き換え、二重にならないことも確認する。
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ResponsiveDialog } from "../src/components/ui/responsive-dialog"
import { ResponsiveOverlayFrame } from "../src/components/patterns/responsive-overlay-frame"

const PLAIN_PB = "pb-[calc(1.5rem_+_env(safe-area-inset-bottom,0px))]"
const FLOAT_PB = "pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]"
const FLOAT_MAX_H = "max-h-[min(85dvh,calc(100dvh_-_1.5rem_-_env(safe-area-inset-top,0px)))]"
const FLOAT_MAX_H_LG = "lg:max-h-[min(85dvh,46rem)]"
/** Sheet の float バリアントが safeArea で付ける既定キャップ（frame の既定で置き換わる側）。 */
const SHEET_FLOAT_SAFE_MAX_H = "max-h-[max(0px,calc(100dvh_-_1.5rem_-_env(safe-area-inset-top,0px)))]"

/** viewport 幅を px で与え、matchMedia を `(min-width: Npx)` に応答させる。 */
function stubViewport(width: number) {
  vi.stubGlobal("matchMedia", (query: string) => {
    const match = /min-width:\s*(\d+(?:\.\d+)?)px/.exec(query)
    const min = match ? Number(match[1]) : Number.POSITIVE_INFINITY
    return {
      matches: width >= min,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
}

/** ソフトキーボードで可視高さが `keyboard` px 縮んだ visualViewport。 */
function stubKeyboard(layoutHeight: number, keyboard: number) {
  vi.stubGlobal("innerHeight", layoutHeight)
  vi.stubGlobal("visualViewport", {
    height: layoutHeight - keyboard,
    offsetTop: 0,
    scale: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

type FrameProps = React.ComponentProps<typeof ResponsiveOverlayFrame>

function renderFrame(frameProps: Partial<FrameProps>) {
  act(() =>
    root.render(
      <ResponsiveDialog open onOpenChange={() => {}}>
        {/* 判別ユニオンなので呼び出し側でだけ緩める。 */}
        <ResponsiveOverlayFrame description="テスト" {...(frameProps as FrameProps)}>
          <input data-testid="field" />
        </ResponsiveOverlayFrame>
      </ResponsiveDialog>
    )
  )
  // preset 経路のモバイルは BottomSheetFrame がそのまま出る（data-frame が別名）。
  const el = document.querySelector<HTMLElement>(
    '[data-frame="responsive-overlay-frame"], [data-frame="bottom-sheet-frame"]'
  )
  if (!el) throw new Error("frame が描画されていない")
  return el
}

const classesOf = (el: HTMLElement) => el.className.split(/\s+/)

describe("ResponsiveOverlayFrame — モバイルの下余白 safe-area（#599）", () => {
  it('preset="plain" は p-6 を保ったまま下辺に safe-area を足す', () => {
    stubViewport(390)
    const classes = classesOf(renderFrame({ preset: "plain" }))
    expect(classes).toContain("p-6")
    expect(classes).toContain(PLAIN_PB)
  })

  it.each(["float", "float-glass"] as const)(
    'side="%s" は下端から浮いている分を差し引いた max 方式の下余白になる',
    (side) => {
      stubViewport(390)
      const classes = classesOf(renderFrame({ side }))
      expect(classes).toContain("p-6")
      expect(classes).toContain(FLOAT_PB)
      expect(classes).not.toContain(PLAIN_PB)
    }
  )

  it("consumer が className で pb-8 を渡していれば既定は置き換わり二重にならない", () => {
    stubViewport(390)
    for (const props of [
      { preset: "plain", className: "max-w-md mx-auto pb-8" },
      { side: "float", className: "max-h-[85dvh] overflow-y-auto pb-8 lg:max-h-[min(85dvh,46rem)]" },
    ] as Array<Partial<FrameProps>>) {
      act(() => root.unmount())
      root = createRoot(container)
      const classes = classesOf(renderFrame(props))
      expect(classes).toContain("pb-8")
      expect(classes).not.toContain(PLAIN_PB)
      expect(classes).not.toContain(FLOAT_PB)
    }
  })

  it("padding={false} / safeArea={false} では下余白を足さない", () => {
    stubViewport(390)
    for (const props of [
      { preset: "plain", padding: false },
      { side: "float", padding: false },
      { preset: "plain", safeArea: false },
      { side: "float", safeArea: false },
    ] as Array<Partial<FrameProps>>) {
      act(() => root.unmount())
      root = createRoot(container)
      const classes = classesOf(renderFrame(props))
      expect(classes).not.toContain(PLAIN_PB)
      expect(classes).not.toContain(FLOAT_PB)
    }
  })

  it("preset 経路（BottomSheetFrame）とデスクトップ分岐は変えない", () => {
    stubViewport(390)
    const preset = classesOf(renderFrame({ preset: "mobile-form" }))
    expect(preset).not.toContain(PLAIN_PB)
    expect(preset).not.toContain(FLOAT_PB)

    for (const props of [{ preset: "plain" }, { side: "float" }] as Array<Partial<FrameProps>>) {
      act(() => root.unmount())
      root = createRoot(container)
      stubViewport(1200)
      const el = renderFrame(props)
      expect(el.dataset.slot).toBe("dialog-content")
      expect(classesOf(el)).not.toContain(PLAIN_PB)
      expect(classesOf(el)).not.toContain(FLOAT_PB)
    }
  })

  it("キーボード表示中は safe-area を足さず、float のキーボード追従（inline max-height / bottom）は残る", async () => {
    stubViewport(390)
    stubKeyboard(812, 300)
    const el = renderFrame({ side: "float" })
    act(() => el.querySelector<HTMLInputElement>('[data-testid="field"]')?.focus())
    // フォーカス判定は次のタスクへ逃がしてある（#487）ので 1 tick 待つ。
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0))
    })
    const classes = classesOf(el)
    expect(classes).not.toContain(FLOAT_PB)
    expect(classes).toContain("p-6")
    // #337 の補正（SheetContent の inline style）は既定の max-h クラスより強い。
    expect(el.style.bottom).toBe("312px")
    expect(el.style.maxHeight).not.toBe("")
  })
})

describe("ResponsiveOverlayFrame — モバイル float の最大高さ（#599）", () => {
  it.each(["float", "float-glass"] as const)(
    'side="%s" は 85dvh（lg 以上は min(85dvh,46rem)）を既定に持つ',
    (side) => {
      stubViewport(390)
      const classes = classesOf(renderFrame({ side }))
      expect(classes).toContain(FLOAT_MAX_H)
      expect(classes).toContain(FLOAT_MAX_H_LG)
      // Sheet 側の「ほぼ全画面」キャップは twMerge で置き換わる（両方残ると後勝ち任せになる）。
      expect(classes).not.toContain(SHEET_FLOAT_SAFE_MAX_H)
    }
  )

  it('side="float" は面の中でスクロールする（overflow-y-auto は Sheet の float バリアントが持つ）', () => {
    stubViewport(390)
    expect(classesOf(renderFrame({ side: "float" }))).toContain("overflow-y-auto")
  })

  it("safeArea={false} では上部 safe-area の控除を外した 85dvh になる", () => {
    stubViewport(390)
    const classes = classesOf(renderFrame({ side: "float", safeArea: false }))
    expect(classes).toContain("max-h-[85dvh]")
    expect(classes).toContain(FLOAT_MAX_H_LG)
    expect(classes).not.toContain(FLOAT_MAX_H)
  })

  it("className の max-h-* で既定を上書きできる", () => {
    stubViewport(390)
    const classes = classesOf(renderFrame({ side: "float", className: "max-h-[60dvh]" }))
    expect(classes).toContain("max-h-[60dvh]")
    expect(classes).not.toContain(FLOAT_MAX_H)
  })

  it('preset="plain" には float 用の最大高さを付けない（Sheet bottom の 90dvh のまま）', () => {
    stubViewport(390)
    const classes = classesOf(renderFrame({ preset: "plain" }))
    expect(classes).toContain("max-h-[90dvh]")
    expect(classes).not.toContain(FLOAT_MAX_H)
  })
})
