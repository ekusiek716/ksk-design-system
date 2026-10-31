import { describe, expect, it } from "vitest"
import { sliderRatio, sliderValueFromX } from "../src/native/slider-value"

/**
 * native Slider の座標 → 値の変換（issue #817）。
 *
 * x は「Slider の外側コンテナ左端からの距離」。つまみ等の子 View を
 * pointerEvents="none" にしてタッチ対象を常にコンテナにそろえているので、
 * nativeEvent.locationX をそのまま渡せる。
 */
describe("sliderValueFromX（#817）", () => {
  const base = { width: 300, min: 0, max: 100, step: 1 }

  it("コンテナ基準の x を値へ変換する（中央は 50）", () => {
    expect(sliderValueFromX({ ...base, x: 150 })).toBe(50)
    expect(sliderValueFromX({ ...base, x: 0 })).toBe(0)
    expect(sliderValueFromX({ ...base, x: 300 })).toBe(100)
  })

  it("トラックの外（負・幅超え）は端へ clamp する", () => {
    expect(sliderValueFromX({ ...base, x: -40 })).toBe(0)
    expect(sliderValueFromX({ ...base, x: 420 })).toBe(100)
  })

  it("step に snap する", () => {
    expect(sliderValueFromX({ ...base, step: 10, x: 140 })).toBe(50)
    expect(sliderValueFromX({ ...base, step: 10, x: 130 })).toBe(40)
    expect(sliderValueFromX({ ...base, step: 25, x: 100 })).toBe(25)
  })

  it("min / max の範囲内に収める", () => {
    expect(sliderValueFromX({ x: 150, width: 300, min: 20, max: 40, step: 1 })).toBe(30)
    expect(sliderValueFromX({ x: 300, width: 300, min: 0, max: 95, step: 10 })).toBe(95)
  })

  it("step=0 は snap しない", () => {
    expect(sliderValueFromX({ ...base, step: 0, x: 100 })).toBeCloseTo(33.333, 2)
  })

  it("幅がまだ測れていない（0）ときは null を返し、値を変えない", () => {
    expect(sliderValueFromX({ ...base, width: 0, x: 10 })).toBeNull()
  })

  it("min === max でも NaN を返さない", () => {
    expect(sliderValueFromX({ x: 120, width: 300, min: 5, max: 5, step: 1 })).toBe(5)
  })
})

describe("sliderRatio（#817）", () => {
  it("値を 0..1 の比率にする", () => {
    expect(sliderRatio({ value: 50, min: 0, max: 100 })).toBe(0.5)
    expect(sliderRatio({ value: -10, min: 0, max: 100 })).toBe(0)
    expect(sliderRatio({ value: 120, min: 0, max: 100 })).toBe(1)
  })

  it("min === max でも NaN を返さない", () => {
    expect(sliderRatio({ value: 5, min: 5, max: 5 })).toBe(0)
  })

  it("つまみ中心の x を逆変換すると元の値に戻る（押しただけでは値が飛ばない）", () => {
    for (const value of [0, 13, 50, 87, 100]) {
      const x = 300 * sliderRatio({ value, min: 0, max: 100 })
      expect(sliderValueFromX({ x, width: 300, min: 0, max: 100, step: 1 })).toBe(value)
    }
  })
})
