/**
 * @vitest-environment jsdom
 *
 * issue #487: 幅 1024px 以上のタッチ端末（iPad 横向き = 1024 / 1194 / 1366px）で
 * ResponsiveOverlayFrame が中央モーダルとして描画されたまま、ソフトキーボードに
 * 入力欄が隠れる問題の回帰テスト。
 *
 * 固定する契約は 3 つ:
 *  1. 補正は max-height だけ（`bottom` lift は絶対に当てない）。
 *     DialogContent は top:50% + translate-y:-50% で位置決めしているため、
 *     bottom を当てると両拘束になり高さが縦一杯へ引き伸ばされる。
 *  2. 中央寄せのキャップは `100dvh - 2*kb`（`- kb` では下端が潜り込む）。
 *  3. side="bottom"（preset / plain）/ float / float-glass の 3 経路すべてで
 *     デスクトップ分岐が対象属性（data-frame / data-side / data-position）を出す。
 *
 * CSS 側の踏み潰しは className を見るテストでは落とせないため、CSS 契約
 * （__tests__/sheet-keyboard-float.test.ts が前例）も併せて検証する。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ResponsiveDialog } from "../src/components/ui/responsive-dialog"
import {
  ResponsiveOverlayFrame,
  resolveDesktopOverlayKeyboardStyle,
} from "../src/components/patterns/responsive-overlay-frame"

describe("resolveDesktopOverlayKeyboardStyle — 中央モーダルのキーボード補正", () => {
  it("キーボード非表示ではスタイルを返さない", () => {
    expect(resolveDesktopOverlayKeyboardStyle(0, "center")).toBeUndefined()
  })

  it("中央寄せはキーボード高さの 2 倍を引く（両側に均等に食われるため）", () => {
    expect(resolveDesktopOverlayKeyboardStyle(300, "center")).toEqual({
      maxHeight: "max(0px, calc(100dvh - 600px))",
    })
  })

  it("lift（bottom）は絶対に返さない — top/bottom 両拘束で高さが飛ぶため", () => {
    for (const position of ["center", "top", "fullscreen"] as const) {
      const style = resolveDesktopOverlayKeyboardStyle(300, position)
      expect(style == null || !("bottom" in style)).toBe(true)
    }
  })

  it("position=\"top\" は上端固定なので 1 回分 + 上下オフセットを引く", () => {
    expect(resolveDesktopOverlayKeyboardStyle(300, "top")).toEqual({
      maxHeight:
        "max(0px, calc(100dvh - 300px - max(env(safe-area-inset-top, 0px), 2rem) - 2rem))",
    })
  })

  it("position=\"fullscreen\" は補正しない（面をビューポートに合わせる指定のため）", () => {
    expect(resolveDesktopOverlayKeyboardStyle(300, "fullscreen")).toBeUndefined()
  })

  it("キャップは 0 で下限を切る（max(0px, …) を必ず含む）", () => {
    expect(resolveDesktopOverlayKeyboardStyle(9999, "center")?.maxHeight).toMatch(
      /^max\(0px,/
    )
  })
})

describe("sheet-keyboard.css — dialog-content フォールバック契約", () => {
  const css = readFileSync(
    join(__dirname, "..", "src/styles/sheet-keyboard.css"),
    "utf8"
  )

  /** `html[data-kb-open]` 配下の dialog-content ルールだけを取り出す。 */
  const dialogRules = [
    ...css.matchAll(
      /html\[data-kb-open\]\s*\n?\s*\[data-slot="dialog-content"\][^{]*\{([^}]*)\}/g
    ),
  ]

  it("dialog-content 向けのキーボードルールが存在する", () => {
    expect(dialogRules.length).toBeGreaterThan(0)
  })

  it("ResponsiveOverlayFrame の面だけをスコープする", () => {
    expect(css).toMatch(
      /\[data-slot="dialog-content"\]\[data-frame="responsive-overlay-frame"\]/
    )
  })

  it("宣言は max-height だけ（bottom / top / inset は書かない）", () => {
    for (const [, body] of dialogRules) {
      expect(body).toMatch(/max-height:/)
      expect(body).not.toMatch(/(^|[\s;])(bottom|top|inset[a-z-]*)\s*:/)
    }
  })

  it("中央寄せは 2 * var(--kb-h) を引く", () => {
    expect(css).toMatch(
      /\[data-position="center"\]\s*\{\s*max-height:\s*max\(0px,\s*calc\(100dvh\s*-\s*2\s*\*\s*var\(--kb-h,\s*0px\)\)\)/
    )
  })

  it("position=\"top\" のルールもある", () => {
    expect(css).toMatch(/\[data-position="top"\]/)
  })
})

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

/** iPad 横向き相当（1024px 幅・タッチ）でソフトキーボードが出た状態を作る。 */
function stubKeyboard(layoutHeight: number, keyboardHeight: number) {
  vi.stubGlobal("innerHeight", layoutHeight)
  vi.stubGlobal("visualViewport", {
    height: layoutHeight - keyboardHeight,
    offsetTop: 0,
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
      <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
        {/* 判別ユニオンなので呼び出し側でだけ緩める。 */}
        <ResponsiveOverlayFrame
          description="テスト"
          {...(frameProps as FrameProps)}
        >
          <div>本文</div>
        </ResponsiveOverlayFrame>
      </ResponsiveDialog>
    )
  )
  const el = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')
  if (!el) throw new Error("中央モーダル（dialog-content）が描画されていない")
  return el
}

describe("ResponsiveOverlayFrame — iPad 横向き（1024px + キーボード）", () => {
  // preset / plain / float / float-glass の 4 経路（issue の受け入れ条件は
  // bottom(preset) / float / plain の 3 経路 + float-glass も同じ扱い）。
  const routes: Array<[string, Partial<FrameProps>]> = [
    ["preset（side=\"bottom\"）", { preset: "mobile-form" }],
    ["plain", { preset: "plain" }],
    ["float", { side: "float" }],
    ["float-glass", { side: "float-glass" }],
  ]

  for (const [name, props] of routes) {
    it(`${name}: 1024px でキーボードが出ると max-height だけが縮む`, () => {
      stubViewport(1024)
      stubKeyboard(768, 300)
      const el = renderFrame(props)

      expect(el.style.maxHeight).toBe("max(0px, calc(100dvh - 600px))")
      // lift は当てない（当てると top/bottom 両拘束で高さが飛ぶ）。
      expect(el.style.bottom).toBe("")
      expect(el.style.top).toBe("")
    })

    it(`${name}: 補正の対象を絞る属性が揃っている`, () => {
      stubViewport(1024)
      const el = renderFrame(props)

      expect(el.getAttribute("data-frame")).toBe("responsive-overlay-frame")
      expect(el.getAttribute("data-position")).toBe("center")
      expect(el.getAttribute("data-side")).toBe(
        props.side ?? "bottom"
      )
    })
  }

  it("キーボードが出ていなければ inline の max-height は付かない", () => {
    stubViewport(1024)
    const el = renderFrame({ preset: "mobile-form" })
    expect(el.style.maxHeight).toBe("")
  })

  // zIndex は DialogContent がモーダルスタックの値で上書きするため、
  // 素通しされる別プロパティで「style を丸ごと落としていない」ことを見る。
  it("consumer の style は落とさずに残す", () => {
    stubViewport(1024)
    stubKeyboard(768, 300)
    const el = renderFrame({
      preset: "mobile-form",
      style: { outlineOffset: "3px" },
    } as Partial<FrameProps>)
    expect(el.style.outlineOffset).toBe("3px")
    expect(el.style.maxHeight).toBe("max(0px, calc(100dvh - 600px))")
  })

  it("モバイル幅ではデスクトップ補正は関与しない（シートのまま）", () => {
    stubViewport(390)
    stubKeyboard(768, 300)
    act(() =>
      root.render(
        <ResponsiveDialog open onOpenChange={() => {}} breakpoint="lg">
          <ResponsiveOverlayFrame preset="mobile-form" description="テスト">
            <div>本文</div>
          </ResponsiveOverlayFrame>
        </ResponsiveDialog>
      )
    )
    expect(document.querySelector('[data-slot="dialog-content"]')).toBeNull()
    expect(document.querySelector('[data-slot="sheet-content"]')).not.toBeNull()
  })
})
