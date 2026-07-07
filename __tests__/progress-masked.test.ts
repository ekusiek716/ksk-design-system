import { describe, expect, it } from "vitest"
import { resolveProgressDisplayValue } from "../src/components/ui/progress"

describe("web Progress masked state (#147)", () => {
  it("masked=true が指定されると value を変えても表示値が変わらない（native と同じ固定値）", () => {
    const values = [0, 1, 50, 99, 100, null, undefined]
    const displayed = values.map((v) => resolveProgressDisplayValue(v, true))
    const first = displayed[0]
    for (const d of displayed) {
      expect(d).toBe(first)
    }
  })

  it("masked=false/undefined のときは実 value をそのまま(clampして)使う", () => {
    expect(resolveProgressDisplayValue(50, false)).toBe(50)
    expect(resolveProgressDisplayValue(50, undefined)).toBe(50)
    expect(resolveProgressDisplayValue(120, undefined)).toBe(100)
    expect(resolveProgressDisplayValue(-10, undefined)).toBe(0)
    expect(resolveProgressDisplayValue(null, undefined)).toBe(0)
  })
})
