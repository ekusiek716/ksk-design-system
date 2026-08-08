import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * Chip / ChipSelector の支援技術向け既定値（issue #311）。
 *
 * role が無いとスクリーンリーダーがチップをただのテキストとして扱い、
 * selected も読み上げられない。RN のレンダリングテスト基盤がリポジトリに
 * 無いため、native-glass-accent-fill と同じソーススキャン方式で
 * 「既定値を持つ実装であること」を契約として固定する。
 */
const chipSource = readFileSync(
  join(__dirname, "..", "src/native/components/Chip.tsx"),
  "utf8",
)

describe("Chip の a11y 既定値（#311）", () => {
  it("既定で accessibilityRole=button を持ち、呼び出し側の明示が優先される", () => {
    expect(chipSource).toContain('accessibilityRole={accessibilityRole ?? "button"}')
  })

  it("selected / disabled を accessibilityState へ反映し、呼び出し側の明示が優先される", () => {
    expect(chipSource).toContain(
      "accessibilityState={{ selected, disabled, ...accessibilityState }}",
    )
  })

  it("removable の×ボタンは role とラベルを既定で持つ（×だけでは読み上げで意味が取れない）", () => {
    expect(chipSource).toContain('accessibilityLabel={removeLabel}')
    // web 版 chip.tsx と同じ既定（「削除: ラベル」/「削除」）を内部計算で持つ
    expect(chipSource).toContain('`削除: ${children}`')
  })

  it("accessibilityRole / accessibilityState を rest スプレッドへ流さず明示的に扱う", () => {
    // rest に残すと Pressable への {...rest} が既定値を上書きできる一方、
    // 既定値の存在保証が実装から読めなくなる。分割代入で明示する。
    expect(chipSource).toMatch(/accessibilityRole,\s*\n\s*accessibilityState,\s*\n\s*\.\.\.rest/)
  })
})
