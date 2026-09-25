import { describe, expect, it } from "vitest"
import { resolveSheetViewportLayout } from "../src/native/sheet-viewport-layout"
import { resolveBottomSheetTopInset } from "../src/native/safe-area"

describe("native Sheet keyboard working area", () => {
  it("keeps the original snap before layout and after keyboard dismissal", () => {
    for (const measured of [null, 900, 899.5]) {
      const layout = resolveSheetViewportLayout(900, 810, measured, false)
      expect(layout.expandToViewport).toBe(false)
      expect(layout.panelHeight).toBe(810)
    }
  })

  it("keeps the footer and last scroll item above the keyboard even from half snap", () => {
    const layout = resolveSheetViewportLayout(900, 810, 540, true)
    const savedHalfSnapTranslation = (0.9 - 0.5) * 900
    const translation = layout.expandToViewport ? 0 : savedHalfSnapTranslation
    const panelBottom = layout.availableHeight + translation
    expect(panelBottom).toBe(540)
    expect(layout.panelHeight).toBe(540)
    // A ScrollView ending at panelBottom can scroll its footer-padded last item
    // into view. The original half-snap translation would hide 360px again.
    expect(panelBottom).toBeLessThanOrEqual(layout.availableHeight)
    expect(resolveSheetViewportLayout(900, 810, 900, false).expandToViewport).toBe(false)
  })

  it("does not subtract the keyboard twice from Android's resized Modal", () => {
    const layout = resolveSheetViewportLayout(540, 486, 540, true)
    expect(layout.availableHeight).toBe(540)
    expect(layout.panelHeight).toBe(486)
  })

  it("does not expand or disable snap dragging for non-keyboard Modal insets", () => {
    expect(resolveSheetViewportLayout(900, 810, 866, false).expandToViewport).toBe(false)
    expect(resolveSheetViewportLayout(900, 810, 0, true).expandToViewport).toBe(false)
  })

  it("recalculates the notch clearance when the reduced panel reaches the top", () => {
    const layout = resolveSheetViewportLayout(900, 810, 540, true)
    expect(resolveBottomSheetTopInset({ top: 62 }, true, layout.availableHeight, layout.panelHeight)).toBe(62)
    expect(resolveBottomSheetTopInset({ top: 62 }, true, 900, 810)).toBe(0)
  })
})
