import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { buttonVariants } from "../src/lib/server-variants/button-variants"

/**
 * フォーカス表示を全状態で 3:1 以上にする（WCAG 1.4.11）ための回帰固定。
 *
 * - エラー中（aria-invalid）にフォーカスした入力欄は、Focus ではなく不透明な Caution-Base のリング。
 *   旧実装は `aria-invalid:ring-[var(--Caution-Base)]/20` が後勝ちで Focus を上書きし、白の上 1.37:1 だった
 * - Slider のつまみ・CheckboxCard は不透明な Focus リング（旧: Brand / Object-Accent の /20 で 1.33:1）
 * - Button inverse / ghost-inverse は暗い面（Surface-Inverse）前提なので Object-on-Inverse のリング
 *
 * 色の数値（Caution-Base / Object-on-Inverse の対 Surface 比）は scripts/check-contrast.mjs が検査する。
 */
const ROOT = process.cwd()
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8")

const FIELD_FILES = [
  "src/components/ui/input.tsx",
  "src/components/ui/select.tsx",
  "src/components/ui/date-picker.tsx",
  "src/components/ui/time-picker.tsx",
  "src/components/ui/combobox.tsx",
  "src/components/ui/multi-select.tsx",
]

describe("エラー中のフォーカスリング", () => {
  it.each(FIELD_FILES)("%s: aria-invalid:focus-visible で不透明な Caution-Base のリングを出し、半透明の赤を使わない", (file) => {
    const source = read(file)
    expect(source).toContain("aria-invalid:focus-visible:ring-[var(--Caution-Base)]")
    expect(source).toContain("aria-invalid:ring-[var(--Caution-Base)]")
    expect(source).not.toMatch(/ring-\[var\(--Caution-Base\)\]\/\d+/)
  })
})

describe("Slider のつまみ・CheckboxCard のフォーカス", () => {
  it("Slider のつまみは不透明な Focus リング（フォーカス用途の /20 を使わない）", () => {
    const source = read("src/components/ui/slider.tsx")
    expect(source).toContain("focus-visible:ring-[var(--Focus-High-Emphasis)]")
    expect(source).not.toMatch(/focus-visible:ring-\[var\(--[A-Za-z-]+\)\]\/\d+/)
    // 半透明の Brand はホバー・押下のハローだけに残す（フォーカス色を上書きしない）
    expect(source).not.toMatch(/(^|[\s"])ring-\[var\(--Brand-Primary\)\]\/20/)
  })

  it("CheckboxCard は不透明な Focus リングで、選択中の枠から 2px 離す", () => {
    const source = read("src/components/ui/checkbox-card.tsx")
    expect(source).toContain("focus-visible:ring-[var(--Focus-High-Emphasis)]")
    expect(source).toContain("focus-visible:ring-offset-2")
    expect(source).not.toMatch(/focus-visible:ring-\[var\(--[A-Za-z-]+\)\]\/\d+/)
  })
})

describe("Button inverse / ghost-inverse のフォーカスリング", () => {
  it.each(["inverse", "ghost-inverse"] as const)("%s は Object-on-Inverse の不透明リング", (variant) => {
    expect(buttonVariants({ variant })).toContain("focus-visible:ring-[var(--Object-on-Inverse)]")
  })

  it("明るい面に置く variant は Object-on-Inverse を使わない", () => {
    for (const variant of ["default", "secondary", "tertiary", "ghost"] as const) {
      expect(buttonVariants({ variant })).not.toContain("Object-on-Inverse")
    }
  })
})

describe("DS 本体にフォーカス用途の半透明リングを残さない", () => {
  it("src/components・src/lib に focus 系バリアントの ring-[var(--…)]/数字 が無い", () => {
    const files = [
      ...FIELD_FILES,
      "src/components/ui/slider.tsx",
      "src/components/ui/checkbox-card.tsx",
      "src/lib/server-variants/button-variants.ts",
      "src/components/patterns/sidebar-nav.tsx",
    ]
    for (const file of files) {
      expect(read(file), file).not.toMatch(/focus(?:-visible|-within)?:ring-\[var\(--[A-Za-z-]+\)\]\/\d+/)
    }
  })
})
