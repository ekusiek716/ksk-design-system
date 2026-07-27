import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { resolveRaisedElevationStyle } from "../src/native/button-elevation"

const source = readFileSync("src/native/components/Button.tsx", "utf8")

const input = {
  bottomBorderWidth: 4,
  offset: 4,
  bottomBorderColor: "#1E40AF",
}

describe("resolveRaisedElevationStyle", () => {
  it("押下前後でレイアウト寸法（下辺の太さ）が変わらない", () => {
    const idle = resolveRaisedElevationStyle({ ...input, pressed: false, disabled: false })
    const pressed = resolveRaisedElevationStyle({ ...input, pressed: true, disabled: false })

    expect(idle.borderBottomWidth).toBe(4)
    expect(pressed.borderBottomWidth).toBe(4)
  })

  it("押下時は下辺の色だけ透明にして沈ませる", () => {
    const pressed = resolveRaisedElevationStyle({ ...input, pressed: true, disabled: false })

    expect(pressed.borderBottomColor).toBe("transparent")
    expect(pressed.transform).toEqual([{ translateY: 4 }])
  })

  it("非押下時は下辺色を出し、translate しない", () => {
    const idle = resolveRaisedElevationStyle({ ...input, pressed: false, disabled: false })

    expect(idle.borderBottomColor).toBe("#1E40AF")
    expect(idle.transform).toEqual([{ translateY: 0 }])
  })

  it("disabled は押下しても沈まない", () => {
    const pressed = resolveRaisedElevationStyle({ ...input, pressed: true, disabled: true })

    expect(pressed.borderBottomColor).toBe("#1E40AF")
    expect(pressed.transform).toEqual([{ translateY: 0 }])
  })

  it("レイアウトを動かすプロパティを一切返さない", () => {
    const pressed = resolveRaisedElevationStyle({ ...input, pressed: true, disabled: false })

    expect(Object.keys(pressed).sort()).toEqual([
      "borderBottomColor",
      "borderBottomWidth",
      "transform",
    ])
  })
})

describe("native Button raised contract", () => {
  it("押下時の高さ補填（marginBottom）を持たない", () => {
    // marginBottom で補填する方式は minHeight で高さが決まるボタンで行を伸ばし、
    // UI 全体が沈む原因になる（exam-kit PrimaryButton と同じ方式に統一）
    expect(source).not.toContain("marginBottom")
  })

  it("raised の押下スタイルは button-elevation.ts に集約する", () => {
    expect(source).toContain("resolveRaisedElevationStyle({")
  })
})
