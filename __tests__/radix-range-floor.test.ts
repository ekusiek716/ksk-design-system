/**
 * PR #520 の Codex レビュー指摘: rangeFloor が先頭の数字 3 つを拾うだけだと、
 * `^1.6.1 || ^1.0.0` や `<=1.6.1` のような合法レンジで実際の下限より高い値を
 * 返し、ref churn 安全下限チェック（scripts/check-radix-floor.mjs）が
 * 偽の緑になる。semver.minVersion ベースでレンジ全体の真の最小を返すことを固定する。
 */
import { describe, expect, it } from "vitest"
// @ts-expect-error mjs 直 import（tsconfig の allowJs 外だが vitest は解決できる）
import { rangeFloor, compareVersions, SAFE_FLOORS, DIRECT_DEPENDENCIES } from "../scripts/radix-ref-churn.mjs"

describe("rangeFloor（#516 / PR #520）", () => {
  it("単純レンジは下限を返す", () => {
    expect(rangeFloor("^1.6.1")).toBe("1.6.1")
    expect(rangeFloor(">=1.6.1")).toBe("1.6.1")
    expect(rangeFloor("1.6.1")).toBe("1.6.1")
  })

  it("|| の合併は低い側の下限を返す（先頭の数字を拾うだけでは 1.6.1 になり偽の緑）", () => {
    expect(rangeFloor("^1.6.1 || ^1.0.0")).toBe("1.0.0")
  })

  it("上限だけのレンジは 0.0.0（安全下限違反として検出される）", () => {
    expect(rangeFloor("<=1.6.1")).toBe("0.0.0")
    expect(rangeFloor("*")).toBe("0.0.0")
  })

  it("解釈できないレンジは null（呼び出し側で違反扱い）", () => {
    expect(rangeFloor("garbage")).toBeNull()
  })

  it("現在の package.json の直接依存は SAFE_FLOORS を満たす（推移依存は check-radix-floor.mjs が実解決版で検査）", async () => {
    const { default: pkg } = await import("../package.json")
    for (const name of DIRECT_DEPENDENCIES as string[]) {
      const floor = (SAFE_FLOORS as Record<string, string>)[name]
      const range = (pkg.dependencies as Record<string, string>)[name]
      expect(range, `${name} が dependencies に無い`).toBeTruthy()
      const min = rangeFloor(range)
      expect(min, `${name} のレンジ "${range}" を解釈できない`).toBeTruthy()
      expect(
        compareVersions(min!, floor) >= 0,
        `${name}: レンジ "${range}"（下限 ${min}）が安全下限 ${floor} 未満`,
      ).toBe(true)
    }
  })
})
