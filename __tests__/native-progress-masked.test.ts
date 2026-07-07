import { describe, expect, it } from "vitest"
import {
  MASKED_PROGRESS_PCT,
  resolveProgressPct,
  resolveProgressVariant,
} from "../src/native/progress-logic"

describe("native Progress masked state (#147)", () => {
  it("masked=true が指定されると value/max を変えても描画割合(pct)が変わらない", () => {
    const maskedPcts = [
      resolveProgressPct(0, 100, true),
      resolveProgressPct(1, 100, true),
      resolveProgressPct(50, 100, true),
      resolveProgressPct(99, 100, true),
      resolveProgressPct(100, 100, true),
      resolveProgressPct(7, 12, true),
    ]

    for (const pct of maskedPcts) {
      expect(pct).toBe(MASKED_PROGRESS_PCT)
    }
  })

  it("masked=false/undefined のときは実 value から素直に % を計算する（既存動作の非破壊確認）", () => {
    expect(resolveProgressPct(50, 100, false)).toBe(50)
    expect(resolveProgressPct(50, 100, undefined)).toBe(50)
    expect(resolveProgressPct(120, 100, undefined)).toBe(100) // clamp
    expect(resolveProgressPct(-10, 100, undefined)).toBe(0) // clamp
    expect(resolveProgressPct(10, 0, undefined)).toBe(0) // max=0 のゼロ除算ガード
  })

  it("masked=true のとき autoColor による value 依存の色分岐も無視する（色からの逆算防止）", () => {
    // masked でなければ pct=99 は autoColor既定(cautionFrom=100 未満・warningFrom=80 以上)で warning になる
    expect(resolveProgressVariant(99, "accent", undefined, true, false)).toBe("warning")

    // masked=true なら pct(=固定45%相当の入力を渡しても) autoColor を無視し fallback(tone由来) を返す
    expect(resolveProgressVariant(99, "accent", undefined, true, true)).toBe("default")
    expect(resolveProgressVariant(1, "accent", undefined, true, true)).toBe("default")
    expect(resolveProgressVariant(1, "success", undefined, true, true)).toBe("success")
  })

  it("variant が明示指定されていれば masked/非masked どちらでもその値を優先する", () => {
    expect(resolveProgressVariant(5, "accent", "caution", true, true)).toBe("caution")
    expect(resolveProgressVariant(5, "accent", "caution", true, false)).toBe("caution")
  })
})
