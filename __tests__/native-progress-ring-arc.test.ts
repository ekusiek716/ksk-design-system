/**
 * native ProgressRing の円弧ジオメトリ回帰（issue #540）。
 *
 * 旧実装は半円 2 枚の重ね合わせで、角度によらず常に半周の塗りになり、
 * 180 度ちょうど（50%）では塗りが消えていた。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  clampProgressValue,
  getProgressRingGeometry,
  getProgressRingMaskRotations,
  progressRingAngle,
  progressRingPct,
} from "../src/native/progress-ring-geometry"

const nativeSource = readFileSync(
  join(__dirname, "..", "src/native/components/ProgressRing.tsx"),
  "utf8",
)

describe("ProgressRing の角度（#540）", () => {
  it("0/25/50/80/100% が 0/90/180/288/360 度に対応する", () => {
    expect(progressRingAngle(0, 100)).toBe(0)
    expect(progressRingAngle(25, 100)).toBe(90)
    expect(progressRingAngle(50, 100)).toBe(180)
    expect(progressRingAngle(80, 100)).toBeCloseTo(288, 10)
    expect(progressRingAngle(100, 100)).toBe(360)
  })

  it("max≠100 でも割合どおりの角度になる", () => {
    expect(progressRingAngle(4, 5)).toBeCloseTo(288, 10) // exam-kit の 5 問中 4 問
    expect(progressRingAngle(3, 12)).toBe(90)
    expect(progressRingAngle(6, 12)).toBe(180)
  })

  it("範囲外の value は 0〜max にクランプする", () => {
    expect(clampProgressValue(-10, 100)).toBe(0)
    expect(clampProgressValue(140, 100)).toBe(100)
    expect(progressRingAngle(-10, 100)).toBe(0)
    expect(progressRingAngle(140, 100)).toBe(360)
    expect(progressRingPct(-1, 5)).toBe(0)
    expect(progressRingPct(9, 5)).toBe(100)
  })

  it("max<=0 はゼロ除算せず 0 度", () => {
    expect(progressRingAngle(10, 0)).toBe(0)
    expect(progressRingAngle(10, -5)).toBe(0)
  })
})

describe("ProgressRing の strokeDashoffset（#540）", () => {
  const cases = [
    { value: 0, expectedRatio: 1 },
    { value: 25, expectedRatio: 0.75 },
    { value: 50, expectedRatio: 0.5 },
    { value: 80, expectedRatio: 0.2 },
    { value: 100, expectedRatio: 0 },
  ]

  for (const { value, expectedRatio } of cases) {
    it(`${value}% は円周の ${expectedRatio} 倍のオフセット`, () => {
      const g = getProgressRingGeometry(value, 100, 104, 10)
      expect(g.radius).toBe((104 - 10) / 2)
      expect(g.circumference).toBeCloseTo(2 * Math.PI * 47, 10)
      expect(g.dashArray).toBe(g.circumference)
      expect(g.dashOffset).toBeCloseTo(g.circumference * expectedRatio, 10)
    })
  }

  it("strokeWidth が変われば半径・円周も追従する（線はリング内側に収まる）", () => {
    const thin = getProgressRingGeometry(50, 100, 64, 6)
    const thick = getProgressRingGeometry(50, 100, 64, 16)
    expect(thin.radius).toBe(29)
    expect(thick.radius).toBe(24)
    expect(thin.dashOffset).toBeCloseTo(thin.circumference / 2, 10)
    expect(thick.dashOffset).toBeCloseTo(thick.circumference / 2, 10)
    // 半径 + 線の半分 = 外周（size/2）に一致 = はみ出さない
    expect(thin.radius + 6 / 2).toBe(32)
    expect(thick.radius + 16 / 2).toBe(32)
  })

  it("max≠100 / 範囲外 value でもオフセットは 0〜円周に収まる", () => {
    const g = getProgressRingGeometry(4, 5, 104, 10)
    expect(g.dashOffset).toBeCloseTo(g.circumference * 0.2, 10)
    expect(getProgressRingGeometry(-3, 5, 104, 10).dashOffset).toBeCloseTo(g.circumference, 10)
    expect(getProgressRingGeometry(9, 5, 104, 10).dashOffset).toBe(0)
  })
})

describe("ProgressRing の View フォールバック 2 マスク（#540）", () => {
  it("0〜180 度は右半分だけが回り、左は 0 のまま", () => {
    expect(getProgressRingMaskRotations(0, 100)).toEqual({ rightRotation: 0, leftRotation: 0 })
    expect(getProgressRingMaskRotations(25, 100)).toEqual({ rightRotation: 90, leftRotation: 0 })
  })

  it("180 度ちょうどで右が塗り切る（塗りが消えない）", () => {
    expect(getProgressRingMaskRotations(50, 100)).toEqual({ rightRotation: 180, leftRotation: 0 })
  })

  it("180 度超は右を保持したまま左が進む", () => {
    const at80 = getProgressRingMaskRotations(80, 100)
    expect(at80.rightRotation).toBe(180)
    expect(at80.leftRotation).toBeCloseTo(108, 10)

    const at4of5 = getProgressRingMaskRotations(4, 5)
    expect(at4of5.rightRotation).toBe(180)
    expect(at4of5.leftRotation).toBeCloseTo(108, 10)

    expect(getProgressRingMaskRotations(100, 100)).toEqual({
      rightRotation: 180,
      leftRotation: 180,
    })
  })

  it("範囲外 value もクランプされる", () => {
    expect(getProgressRingMaskRotations(-5, 100)).toEqual({ rightRotation: 0, leftRotation: 0 })
    expect(getProgressRingMaskRotations(500, 100)).toEqual({
      rightRotation: 180,
      leftRotation: 180,
    })
  })
})

describe("ProgressRing 実装が旧ロジックを持たない（#540）", () => {
  it("angle > 180 で色付き半円を 2 枚描く旧形が残っていない", () => {
    expect(nativeSource).not.toMatch(/angle > 180 && renderHalfFill/)
    expect(nativeSource).not.toMatch(/renderHalfFill/)
  })

  it("描画はジオメトリの純関数だけを参照する", () => {
    expect(nativeSource).toContain("getProgressRingGeometry")
    expect(nativeSource).toContain("getProgressRingMaskRotations")
  })
})
