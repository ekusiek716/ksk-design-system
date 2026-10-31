/**
 * native Progress の既定の読み上げ（issue #796）を固定する。
 *
 * 背景: native の横長 Progress はルート View に役割も値も無く、読み上げで進捗の値が
 * 伝わらなかった（ProgressRing は #564 で対応済み）。既定で progressbar として読ませ、
 * `accessible={false}` で外せるようにする。
 *
 * 値の算出は react-native 非依存の純関数をそのまま検証し、結線（既定値・優先順・
 * accessible={false} の分岐）は native-progress-ring-a11y と同じソーススキャン方式で固定する。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { getProgressAccessibilityValue } from "../src/native/progress-logic"

const nativeSource = readFileSync(join(__dirname, "..", "src/native/components/Progress.tsx"), "utf8")

describe("native Progress の accessibilityValue（#796）", () => {
  it("通常値は { min: 0, max, now } になる", () => {
    expect(getProgressAccessibilityValue(42, 100, false)).toEqual({ min: 0, max: 100, now: 42 })
    expect(getProgressAccessibilityValue(8, 10, undefined)).toEqual({ min: 0, max: 10, now: 8 })
  })

  it("範囲外の value はクランプ後の値になる", () => {
    expect(getProgressAccessibilityValue(-5, 100, false).now).toBe(0)
    expect(getProgressAccessibilityValue(140, 100, false).now).toBe(100)
    expect(getProgressAccessibilityValue(30, 10, false).now).toBe(10)
  })

  it("max が 0 以下・非有限でも値域が壊れない", () => {
    for (const max of [0, -10, Number.NaN, Number.POSITIVE_INFINITY]) {
      const v = getProgressAccessibilityValue(50, max, false)
      expect(v.min).toBe(0)
      expect(v.max).toBeGreaterThan(0)
      expect(Number.isFinite(v.max)).toBe(true)
      expect(Number.isFinite(v.now!)).toBe(true)
      expect(v.now!).toBeGreaterThanOrEqual(0)
      expect(v.now!).toBeLessThanOrEqual(v.max)
    }
    expect(getProgressAccessibilityValue(Number.NaN, 100, false).now).toBe(0)
  })

  it("masked では value / max に依存せず now を含めない（実値の逆算防止 #147）", () => {
    const a = getProgressAccessibilityValue(10, 100, true)
    const b = getProgressAccessibilityValue(95, 12, true)
    expect(a).toEqual(b)
    expect(a).not.toHaveProperty("now")
  })
})

describe("native Progress の既定の読み上げ結線（#796）", () => {
  it("ProgressProps に accessible / accessibilityLabel / accessibilityRole / accessibilityValue の受け口がある", () => {
    for (const prop of ["accessible?:", "accessibilityLabel?:", "accessibilityRole?:", "accessibilityValue?:"]) {
      expect(nativeSource).toContain(prop)
    }
  })

  it("accessible の既定は true で、役割の既定は progressbar（利用側指定が優先）", () => {
    expect(nativeSource).toContain("accessible ?? true")
    expect(nativeSource).toContain('accessibilityRole ?? "progressbar"')
    expect(nativeSource).toContain("accessibilityRole={resolvedAccessibilityRole}")
    expect(nativeSource).toContain("accessibilityValue={resolvedAccessibilityValue}")
    expect(nativeSource).toContain("accessible={isAccessibleGroup}")
  })

  it("値の既定は純関数から作る（masked を渡す）", () => {
    expect(nativeSource).toContain("accessibilityValue ?? getProgressAccessibilityValue(value, max, masked)")
  })

  it("accessible={false} のときは役割・値・名前の既定を付けない", () => {
    expect(nativeSource).toMatch(/isAccessibleGroup\s*\?\s*\(accessibilityRole \?\? "progressbar"\)\s*:\s*accessibilityRole/)
    expect(nativeSource).toMatch(/isAccessibleGroup\s*\?\s*\(accessibilityValue \?\? getProgressAccessibilityValue\(value, max, masked\)\)\s*:\s*accessibilityValue/)
    expect(nativeSource).toMatch(/isAccessibleGroup\s*\?\s*\(accessibilityLabel \?\? "進捗"\)\s*:\s*accessibilityLabel/)
  })
})
