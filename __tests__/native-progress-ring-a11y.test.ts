/**
 * native ProgressRing の既定の読み上げ（issue #564）を固定する。
 *
 * 背景: Web は常に `role="progressbar"` + `aria-valuenow/min/max` を持つのに、Native は
 * #559（PR #562）で受け口を用意しただけで既定は無地のまま、「図形＋中央の文字」として
 * 読まれていた。既定で進捗として読ませ、Web と対称にする。
 *
 * 値の算出は react-native 非依存の純関数に切り出してあるのでそのまま検証し、
 * 結線（既定値・優先順・二重読み回避）は RN のレンダリングテスト基盤がリポジトリに無いため
 * native-progress-ring-tone-label と同じソーススキャン方式で固定する。
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  clampProgressValue,
  getProgressRingAccessibilityValue,
} from "../src/native/progress-ring-geometry"

const nativeSource = readFileSync(
  join(__dirname, "..", "src/native/components/ProgressRing.tsx"),
  "utf8",
)

describe("native ProgressRing の accessibilityValue（#564）", () => {
  it("通常値は { min: 0, max, now } になる", () => {
    expect(getProgressRingAccessibilityValue(80, 100)).toEqual({ min: 0, max: 100, now: 80 })
    expect(getProgressRingAccessibilityValue(8, 10)).toEqual({ min: 0, max: 10, now: 8 })
  })

  it("範囲外の value はクランプ後の値になる", () => {
    expect(getProgressRingAccessibilityValue(-5, 100).now).toBe(0)
    expect(getProgressRingAccessibilityValue(140, 100).now).toBe(100)
    expect(getProgressRingAccessibilityValue(30, 10).now).toBe(10)
  })

  it("max が 0 以下・非有限でも値域が壊れない（max>0・now は有限）", () => {
    for (const max of [0, -10, Number.NaN, Number.POSITIVE_INFINITY]) {
      const v = getProgressRingAccessibilityValue(50, max)
      expect(v.min).toBe(0)
      expect(v.max).toBeGreaterThan(0)
      expect(Number.isFinite(v.max)).toBe(true)
      expect(Number.isFinite(v.now)).toBe(true)
      expect(v.now).toBeGreaterThanOrEqual(0)
      expect(v.now).toBeLessThanOrEqual(v.max)
    }
    expect(getProgressRingAccessibilityValue(Number.NaN, 100).now).toBe(0)
  })

  it("now は描画と同じクランプ関数を通る（読み上げと見た目がずれない）", () => {
    for (const [value, max] of [[80, 100], [-5, 100], [140, 100], [8, 10]] as const) {
      expect(getProgressRingAccessibilityValue(value, max).now).toBe(clampProgressValue(value, max))
    }
  })
})

describe("native ProgressRing の既定の読み上げ結線（#564）", () => {
  it("accessibilityRole の既定は progressbar で、利用側指定が優先される", () => {
    expect(nativeSource).toContain('accessibilityRole ?? "progressbar"')
    expect(nativeSource).toContain("accessibilityRole={resolvedAccessibilityRole}")
  })

  it("accessibilityValue の既定はクランプ後の純関数の値で、利用側指定が優先される", () => {
    expect(nativeSource).toContain("accessibilityValue ?? getProgressRingAccessibilityValue(value, max)")
    expect(nativeSource).toContain("accessibilityValue={resolvedAccessibilityValue}")
  })

  it("accessibilityLabel の既定は Web と同じ決め方（文字列 label か「進捗」）", () => {
    expect(nativeSource).toContain('accessibilityLabel ?? (typeof label === "string" ? label : "進捗")')
  })

  it("既定でルートがひとつの読み上げ要素になる（accessible の既定は true）", () => {
    expect(nativeSource).toContain("accessible={accessible ?? true}")
    expect(nativeSource).toContain("const isAccessibleGroup = accessible ?? true")
  })

  it("accessible={false} なら役割・値・名前の既定も付かず、従来どおり外せる", () => {
    // 3 つとも isAccessibleGroup で分岐していること（どれかが素通しだと外せなくなる）。
    for (const prop of [
      "resolvedAccessibilityRole",
      "resolvedAccessibilityValue",
      "resolvedAccessibilityLabel",
    ]) {
      const decl = nativeSource.slice(nativeSource.indexOf(`const ${prop} = `))
      expect(decl.slice(0, 200)).toContain("isAccessibleGroup")
    }
  })

  it("label / showLabel と併用しても二重に読まれない（中央をツリーから隠す）", () => {
    // 役割・値を持つルートの中に「80%」の文字が残ると名前と値で 2 回読まれる。
    expect(nativeSource).toContain("const hideCenterFromA11y = isAccessibleGroup")
    const centerBlock = nativeSource.slice(nativeSource.indexOf("const hideCenterFromA11y"))
    expect(centerBlock).toContain("accessibilityElementsHidden={hideCenterFromA11y || undefined}")
    expect(centerBlock).toContain(
      'importantForAccessibility={hideCenterFromA11y ? "no-hide-descendants" : undefined}',
    )
  })

  it("見た目の分岐は変えない（中央の円板は SVG 時に描かないまま）", () => {
    expect(nativeSource).toContain(
      "const centerBackground = svg ? undefined : (colors?.center ?? theme.surface.primary)",
    )
  })
})
