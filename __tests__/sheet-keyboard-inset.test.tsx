/**
 * Sheet — 仮想キーボード対応（visualViewport インセット計算）
 *
 * `<SheetContent side="bottom" swipeToClose>` は bottom-0 / max-h-[90dvh] で
 * 固定配置されるため、仮想キーボードが開くとシート上端が viewport 外へ抜ける
 * 不具合があった（dvh は layout viewport 基準でキーボードを考慮しないため）。
 *
 * 修正では window.visualViewport から「キーボード上の可視領域」を算出し、
 * シートを持ち上げ（bottom）/ 高さを制限（maxHeight）する。ここではその純粋
 * 計算ロジックを検証する（DOM 非依存・SSR 構成のまま実行できる）。
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { computeVisualViewportInset } from "../src/components/ui/sheet"

describe("computeVisualViewportInset — 仮想キーボード対応", () => {
  it("キーボード非表示（visual == layout）ではインセットなし", () => {
    // 例: layout 800, visual 800, offsetTop 0
    expect(computeVisualViewportInset(800, 800, 0)).toEqual({
      keyboardInset: 0,
      visibleHeight: null,
    })
  })

  it("キーボード表示時はキーボード高さぶん持ち上げ、可視高さで制限する", () => {
    // layout 800, キーボードが 300px ぶん可視領域を奪う → visual 500
    expect(computeVisualViewportInset(800, 500, 0)).toEqual({
      keyboardInset: 300,
      visibleHeight: 500,
    })
  })

  it("ページがスクロール（offsetTop>0）してもキーボード上端を正しく算出する", () => {
    // layout 800, visual 500, ページが 40px 上にスクロール
    // keyboardInset = 800 - 500 - 40 = 260
    expect(computeVisualViewportInset(800, 500, 40)).toEqual({
      keyboardInset: 260,
      visibleHeight: 500,
    })
  })

  it("サブピクセルのインセット（アドレスバー等の揺れ）はキーボード無しとして無視する", () => {
    expect(computeVisualViewportInset(800, 799.4, 0)).toEqual({
      keyboardInset: 0,
      visibleHeight: null,
    })
  })

  it("インセットは負にならない（0 でクランプ）", () => {
    // visual が layout を超える異常系でも負値を返さない
    expect(computeVisualViewportInset(800, 820, 0)).toEqual({
      keyboardInset: 0,
      visibleHeight: null,
    })
  })
})
