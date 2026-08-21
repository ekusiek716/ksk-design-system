import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * SearchBar の accessibility props 対応（issue #465）。
 *
 * SearchBarProps が AccessibilityProps を継承しておらず、
 * accessibilityLabel 等を渡せなかった。RN のレンダリングテスト基盤が
 * リポジトリに無いため、native-chip-a11y と同じソーススキャン方式で
 * 「TextInput へ転送する実装であること」を契約として固定する。
 */
const searchBarSource = readFileSync(
  join(__dirname, "..", "src/native/components/SearchBar.tsx"),
  "utf8",
)

describe("SearchBar の a11y props 対応（#465）", () => {
  it("SearchBarProps が AccessibilityProps を継承している", () => {
    expect(searchBarSource).toContain("export interface SearchBarProps extends AccessibilityProps")
  })

  it("accessibilityLabel を TextInput へ転送し、未指定時は placeholder にフォールバックする", () => {
    expect(searchBarSource).toContain('accessibilityLabel={accessibilityLabel ?? placeholder}')
  })

  it("accessibilityHint / accessibilityRole / accessibilityState を TextInput へ転送する", () => {
    expect(searchBarSource).toContain("accessibilityHint={accessibilityHint}")
    expect(searchBarSource).toContain("accessibilityRole={accessibilityRole}")
    expect(searchBarSource).toContain("accessibilityState={accessibilityState}")
  })

  it("その他の accessibilityProps を rest スプレッドで TextInput へ流す", () => {
    expect(searchBarSource).toContain("{...accessibilityProps}")
  })
})
