/**
 * Sheet — bottom sheet キーボード追従の snap 除外ロジック（Issue #150）
 *
 * bottom-anchored なシートはキーボード表示時に「持ち上げ（bottom）」と
 * 「高さ制限（maxHeight）」を行うが、snap モード（data-snap-active）のシートは
 * 自前で高さを制御するため max-height 補正の対象外にする必要がある
 * （consumer 側 belle-todo の `:not([data-snap-active])` 分岐と等価）。
 *
 * ここではその純粋な分岐ロジック `resolveBottomSheetKeyboardStyle` を検証する
 * （DOM 非依存・SSR 構成のまま実行できる）。
 *
 * 後半（#811）は jsdom で実際に snap シートを描き、visualViewport を縮めた
 * ときに inline の `bottom` が付くこと（持ち上げ）を確かめる。以前は純関数の
 * snap 分岐が本番コードから呼ばれておらず、snap シートだけ持ち上がらなかった。
 *
 * 実行: npm run test
 *
 * @vitest-environment jsdom
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, it, expect } from "vitest"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  resolveBottomSheetKeyboardStyle,
} from "../src/components/ui/sheet"

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe("resolveBottomSheetKeyboardStyle — キーボード追従と snap 除外", () => {
  it("キーボード非表示（inset<=0）では追従スタイルを付けない", () => {
    expect(resolveBottomSheetKeyboardStyle(0, null, false)).toBeUndefined()
    expect(resolveBottomSheetKeyboardStyle(0, 500, false)).toBeUndefined()
    // 異常系（負の inset）でも undefined
    expect(resolveBottomSheetKeyboardStyle(-10, 500, false)).toBeUndefined()
  })

  it("非 snap では持ち上げ + 可視高さで高さ制限する", () => {
    expect(resolveBottomSheetKeyboardStyle(300, 500, false)).toEqual({
      bottom: 300,
      maxHeight: 500,
    })
  })

  it("snap モードでは持ち上げのみで max-height 補正は行わない", () => {
    // maxHeight を含めない（snap は activeSnapPoint で高さを持つ）
    expect(resolveBottomSheetKeyboardStyle(300, 500, true)).toEqual({
      bottom: 300,
    })
  })

  it("visibleHeight が null のときは maxHeight を省く（既定 max-h に委ねる）", () => {
    expect(resolveBottomSheetKeyboardStyle(300, null, false)).toEqual({
      bottom: 300,
      maxHeight: undefined,
    })
  })
})

describe("snap シートもキーボードの上へ持ち上がる（Issue #811）", () => {
  const originalVV = Object.getOwnPropertyDescriptor(window, "visualViewport")
  const originalInner = window.innerHeight
  let listeners: Array<() => void> = []
  const vv = {
    height: 500,
    offsetTop: 0,
    addEventListener: (_type: string, fn: () => void) => {
      listeners.push(fn)
    },
    removeEventListener: (_type: string, fn: () => void) => {
      listeners = listeners.filter((l) => l !== fn)
    },
  }
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    vv.height = 500
    listeners = []
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 })
    Object.defineProperty(window, "visualViewport", { configurable: true, value: vv })
  })
  afterEach(() => {
    if (root) act(() => root!.unmount())
    root = null
    container?.remove()
    container = null
    document.body.innerHTML = ""
    Object.defineProperty(window, "innerHeight", { configurable: true, value: originalInner })
    if (originalVV) Object.defineProperty(window, "visualViewport", originalVV)
    else delete (window as { visualViewport?: unknown }).visualViewport
  })

  const mount = (snapPoints?: number[]) => {
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
    act(() =>
      root!.render(
        <Sheet open snapPoints={snapPoints}>
          <SheetContent side="bottom">
            <SheetTitle>t</SheetTitle>
            <input />
          </SheetContent>
        </Sheet>
      )
    )
    return document.querySelector<HTMLElement>('[data-slot="sheet-content"]')!
  }
  const fireResize = () => act(() => listeners.forEach((l) => l()))

  it("キーボード表示中（inset 300）は bottom: 300px が付き、maxHeight は付かない", () => {
    const el = mount([0.5, 0.9])
    expect(el.dataset.snapActive).toBe("0.5")
    expect(el.style.bottom).toBe("300px")
    expect(el.style.maxHeight).toBe("")
    // 高さ（maxSnap * 100svh）と translateY は従来どおり
    expect(el.style.height).toBe("90svh")
    expect(el.style.transform).toContain("translate3d")
  })

  it("snapPoints 無しの bottom シートと同じ持ち上げ量になる（対比）", () => {
    const el = mount()
    expect(el.dataset.snapActive).toBeUndefined()
    expect(el.style.bottom).toBe("300px")
  })

  it("キーボードが無いときは bottom を付けない", () => {
    vv.height = 800
    const el = mount([0.5, 0.9])
    expect(el.style.bottom).toBe("")
  })

  it("キーボードを閉じると bottom が外れて元に戻る", () => {
    const el = mount([0.5, 0.9])
    expect(el.style.bottom).toBe("300px")
    vv.height = 800
    fireResize()
    expect(el.style.bottom).toBe("")
  })
})
