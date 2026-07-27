import { describe, expect, it } from "vitest"
import {
  CLOSE_DRAG_RATIO,
  RUBBER_MAX,
  resolveDragTranslateY,
  resolveRelease,
  shouldCaptureDrag,
  type SnapGestureConfig,
} from "../src/native/sheet-snap-gesture"

const H = 800
const POINTS = [0.55, 0.92]
const config = (overrides: Partial<SnapGestureConfig> = {}): SnapGestureConfig => ({
  points: POINTS,
  minSnap: POINTS[0],
  maxSnap: POINTS[1],
  panelH: Math.round(H * POINTS[1]),
  H,
  dismissible: true,
  ...overrides,
})

describe("shouldCaptureDrag", () => {
  const base = { active: 0.55, maxSnap: 0.92, scrollTop: 0, animating: false }

  it("snap アニメーション中は受け取らない（開始位置がアニメ途中になりパネルが飛ぶ）", () => {
    expect(shouldCaptureDrag(40, { ...base, animating: true })).toBe(false)
    expect(shouldCaptureDrag(-40, { ...base, animating: true })).toBe(false)
  })

  it("微小な縦移動は受け取らない", () => {
    expect(shouldCaptureDrag(5, base)).toBe(false)
    expect(shouldCaptureDrag(-5, base)).toBe(false)
    expect(shouldCaptureDrag(6, base)).toBe(true)
  })

  it("FULL ではコンテンツ先頭からの下方向のみ受け取る", () => {
    const atFull = { ...base, active: 0.92 }
    expect(shouldCaptureDrag(40, atFull)).toBe(true)
    expect(shouldCaptureDrag(-40, atFull)).toBe(false)
    expect(shouldCaptureDrag(40, { ...atFull, scrollTop: 120 })).toBe(false)
  })

  it("FULL 以外では上下どちらも受け取る", () => {
    expect(shouldCaptureDrag(40, { ...base, scrollTop: 120 })).toBe(true)
    expect(shouldCaptureDrag(-40, base)).toBe(true)
  })
})

describe("resolveDragTranslateY", () => {
  it("フル超え（上方向）はラバーバンドで抑える", () => {
    expect(resolveDragTranslateY(0, -200, config())).toBe(-RUBBER_MAX)
  })

  it("dismissible なら閉じ位置まで引ける", () => {
    const c = config()
    expect(resolveDragTranslateY(0, 300, c)).toBe(300)
    expect(resolveDragTranslateY(0, c.panelH + 400, c)).toBe(c.panelH + RUBBER_MAX)
  })

  it("dismissible=false は minSnap より下へ行かない", () => {
    const c = config({ dismissible: false })
    const minTY = (c.maxSnap - c.minSnap) * c.H
    expect(resolveDragTranslateY(0, minTY + 400, c)).toBe(minTY + RUBBER_MAX)
  })
})

describe("resolveRelease", () => {
  const c = config()
  const minTY = (c.maxSnap - c.minSnap) * c.H

  it("minSnap から閾値以上引いたら閉じる", () => {
    const dy = c.panelH * CLOSE_DRAG_RATIO + 1
    expect(resolveRelease(minTY, dy, c.minSnap, c)).toEqual({ kind: "close" })
  })

  it("閾値未満なら最近接 snap に戻す", () => {
    const dy = c.panelH * CLOSE_DRAG_RATIO - 1
    expect(resolveRelease(minTY, dy, c.minSnap, c)).toEqual({
      kind: "snap",
      snap: c.minSnap,
    })
  })

  it("dismissible=false では下方向にどれだけ引いても閉じない", () => {
    const nonDismissible = config({ dismissible: false })
    expect(
      resolveRelease(minTY, nonDismissible.panelH * 2, nonDismissible.minSnap, nonDismissible),
    ).toEqual({ kind: "snap", snap: nonDismissible.minSnap })
    expect(
      resolveRelease(0, nonDismissible.panelH * 2, nonDismissible.maxSnap, nonDismissible),
    ).toEqual({ kind: "snap", snap: nonDismissible.minSnap })
  })

  it("上方向は 1 段階上の snap へ", () => {
    expect(resolveRelease(minTY, -40, c.minSnap, c)).toEqual({
      kind: "snap",
      snap: c.maxSnap,
    })
  })

  it("FULL からさらに上へ引いたら FULL に戻す", () => {
    expect(resolveRelease(0, -40, c.maxSnap, c)).toEqual({
      kind: "snap",
      snap: c.maxSnap,
    })
  })

  it("FULL から少し下は collapse、大きく引けば close", () => {
    expect(resolveRelease(0, 60, c.maxSnap, c)).toEqual({
      kind: "snap",
      snap: c.minSnap,
    })
    const closeDy = minTY + c.panelH * CLOSE_DRAG_RATIO + 1
    expect(resolveRelease(0, closeDy, c.maxSnap, c)).toEqual({ kind: "close" })
  })

  it("3 点 snap でも最近接に着地する", () => {
    const three = config({ points: [0.4, 0.65, 0.92], minSnap: 0.4 })
    // 0.65 相当の位置で微小移動 → 0.65 に戻る
    const ty = (three.maxSnap - 0.65) * three.H
    expect(resolveRelease(ty, 10, 0.65, three)).toEqual({ kind: "snap", snap: 0.65 })
  })
})
