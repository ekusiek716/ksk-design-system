import { describe, it, expect } from "vitest"
import { computePlatterOffset } from "@/components/patterns/commerce/bottom-tab-bar"

/**
 * BottomTabBar (pill) の選択 platter は nav の絶対配置子 (`absolute left-0 top-0`)
 * なので、原点は nav の padding box。rect 差は border box 基準なので、border を
 * 引かないと border のあるテーマで platter が右下へずれる (#591)。
 *
 * 実測 (belle-todo / DS 2.6.4, 375x812):
 *   nav  x 12,     y 736  (border 1px)
 *   item x 286.75, y 748
 *   旧実装の translate = (274.75, 12) → platter は x 287.75 / y 749 と 1px ずれた
 */
describe("computePlatterOffset", () => {
  const navBox = { left: 12, top: 736 }
  const anchorBox = { left: 286.75, top: 748, width: 67.25, height: 48 }

  it("nav の border 分を引いて padding box 基準の位置を返す", () => {
    const rect = computePlatterOffset(navBox, anchorBox, { left: 1, top: 1 })
    expect(rect).toEqual({ x: 273.75, y: 11, w: 67.25, h: 48 })
  })

  it("border を引いた結果、platter の実位置がアンカーと一致する", () => {
    const border = { left: 1, top: 1 }
    const rect = computePlatterOffset(navBox, anchorBox, border)
    // overlay の実位置 = nav の padding box 原点 + translate
    expect(navBox.left + border.left + rect.x).toBeCloseTo(anchorBox.left, 5)
    expect(navBox.top + border.top + rect.y).toBeCloseTo(anchorBox.top, 5)
  })

  it("border が無いテーマでは rect 差がそのまま使われる", () => {
    const rect = computePlatterOffset(navBox, anchorBox, { left: 0, top: 0 })
    expect(rect).toEqual({ x: 274.75, y: 12, w: 67.25, h: 48 })
  })

  it("幅と高さはアンカーの実寸をそのまま引き継ぐ", () => {
    const rect = computePlatterOffset(navBox, anchorBox, { left: 2, top: 3 })
    expect(rect.w).toBe(anchorBox.width)
    expect(rect.h).toBe(anchorBox.height)
  })
})
