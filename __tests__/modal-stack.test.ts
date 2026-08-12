import { describe, expect, it } from "vitest"
import {
  ALERT_CONTENT_BASE_Z,
  ALERT_OVERLAY_BASE_Z,
  ALERT_STACK_MAX_LEVEL,
  MODAL_CONTENT_BASE_Z,
  MODAL_OVERLAY_BASE_Z,
  MODAL_STACK_MAX_LEVEL,
  alertContentZ,
  alertOverlayZ,
  modalContentZ,
  modalOverlayZ,
  resolveStackedZ,
} from "@/lib/modal-stack"

/**
 * 「後から開いたモーダルが必ず前面」を成立させる z 算出（issue #340）。
 * DOM を伴わない純粋関数レベルの不変条件をここで固定する。
 */
describe("modal-stack の z 算出", () => {
  it("段が上がるほど z が上がる（後から開いた方が前面）", () => {
    expect(modalContentZ(1)).toBeGreaterThan(modalContentZ(0))
    expect(modalContentZ(2)).toBeGreaterThan(modalContentZ(1))
    expect(alertContentZ(1)).toBeGreaterThan(alertContentZ(0))
  })

  it("同じ段では content が自分の scrim より上", () => {
    for (const level of [0, 1, 2, 3]) {
      expect(modalContentZ(level)).toBeGreaterThan(modalOverlayZ(level))
      expect(alertContentZ(level)).toBeGreaterThan(alertOverlayZ(level))
    }
  })

  it("上の段の scrim は下の段の content より上（下のモーダルが暗転する）", () => {
    for (const level of [0, 1, 2]) {
      expect(modalOverlayZ(level + 1)).toBeGreaterThan(modalContentZ(level))
      expect(alertOverlayZ(level + 1)).toBeGreaterThan(alertContentZ(level))
    }
  })

  it("段 0 は従来どおり基底値そのもの（既存 Sheet / Dialog の見た目を変えない）", () => {
    expect(modalOverlayZ(0)).toBe(MODAL_OVERLAY_BASE_Z)
    expect(modalContentZ(0)).toBe(MODAL_CONTENT_BASE_Z)
    expect(alertOverlayZ(0)).toBe(ALERT_OVERLAY_BASE_Z)
    expect(alertContentZ(0)).toBe(ALERT_CONTENT_BASE_Z)
  })

  it("Alert は何段目でも通常モーダルより上（基底が支配的）", () => {
    expect(alertOverlayZ(0)).toBeGreaterThan(modalContentZ(MODAL_STACK_MAX_LEVEL))
  })

  it("上限を超えた段は飽和する（突き抜けるより同段どうしの勝負に戻す）", () => {
    expect(modalContentZ(MODAL_STACK_MAX_LEVEL + 5)).toBe(
      modalContentZ(MODAL_STACK_MAX_LEVEL)
    )
    expect(alertContentZ(ALERT_STACK_MAX_LEVEL + 5)).toBe(
      alertContentZ(ALERT_STACK_MAX_LEVEL)
    )
  })

  it("負の段は 0 として扱う", () => {
    expect(resolveStackedZ(60, -3, 20, 8)).toBe(60)
  })
})
