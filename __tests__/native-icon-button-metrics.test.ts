import { describe, expect, it } from "vitest"
import {
  effectiveTouchTarget,
  resolveIconButtonMetrics,
  type IconButtonSize,
} from "../src/native/icon-button-metrics"
import { scales } from "../src/tokens/native/scales"

const MIN_TARGET = scales.touchTargets.iconButton.min

describe("native IconButton metrics (#298③)", () => {
  it("全サイズで実効タップ領域が touchTargets.iconButton.min 以上", () => {
    const sizes: IconButtonSize[] = ["sm", "md", "lg"]
    for (const size of sizes) {
      const metrics = resolveIconButtonMetrics(size, MIN_TARGET)
      expect(effectiveTouchTarget(metrics)).toBeGreaterThanOrEqual(MIN_TARGET)
    }
  })

  it("視覚サイズが最小値未満のときだけ hitSlop で補う", () => {
    // sm(36) は 44 に届かないので hitSlop=4 → 実効 44
    expect(resolveIconButtonMetrics("sm", 44)).toEqual({ box: 36, icon: 18, hitSlop: 4 })
    // md(44) / lg(48) は視覚サイズだけで足りるので hitSlop=0
    expect(resolveIconButtonMetrics("md", 44).hitSlop).toBe(0)
    expect(resolveIconButtonMetrics("lg", 44).hitSlop).toBe(0)
  })

  it("端数が出る差分は切り上げる（44 未満に丸め落ちしない）", () => {
    const metrics = resolveIconButtonMetrics("sm", 45) // 差 9 → 4.5 → 5
    expect(metrics.hitSlop).toBe(5)
    expect(effectiveTouchTarget(metrics)).toBeGreaterThanOrEqual(45)
  })

  it("サイズが上がるほど視覚サイズとアイコンも大きくなる", () => {
    const sm = resolveIconButtonMetrics("sm", MIN_TARGET)
    const md = resolveIconButtonMetrics("md", MIN_TARGET)
    const lg = resolveIconButtonMetrics("lg", MIN_TARGET)
    expect(sm.box).toBeLessThan(md.box)
    expect(md.box).toBeLessThan(lg.box)
    expect(sm.icon).toBeLessThan(md.icon)
    expect(md.icon).toBeLessThan(lg.icon)
  })
})
