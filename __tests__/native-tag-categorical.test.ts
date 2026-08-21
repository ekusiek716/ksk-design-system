import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { scales } from "../src/tokens/native/scales"

/**
 * Tag の categorical（16色）+ dot の native 移植（issue #445）。
 *
 * categorical のテーマ非依存 hex は `tokens.json` の
 * `colors.semantic.categorical` が正本で、`scripts/generate-platform-tokens.mjs`
 * が `src/tokens/native/scales.ts` の `categorical` へ出力する。web 版
 * （`src/styles/categorical.css` の `--Categorical-*`）と native はこの生成物を
 * 共有するため、ここではハードコード重複を作らず `scales.categorical` を参照し、
 * web の CSS 定義値と一致することだけを固定する。
 */

// web 版 src/styles/categorical.css と同じ 16 件（コピーではなく照合用の固定値）。
const WEB_CATEGORICAL_HEX: Record<string, { base: string; subtle: string; bold: string }> = {
  "1": { base: "#EF4444", subtle: "#FEE2E2", bold: "#B91C1C" },
  "2": { base: "#0EA5E9", subtle: "#E0F2FE", bold: "#0369A1" },
  "3": { base: "#14B8A6", subtle: "#CCFBF1", bold: "#0F766E" },
  "4": { base: "#64748B", subtle: "#F1F5F9", bold: "#334155" },
  "5": { base: "#EAB308", subtle: "#FEF9C3", bold: "#A16207" },
  "6": { base: "#6366F1", subtle: "#E0E7FF", bold: "#4338CA" },
  "7": { base: "#F97316", subtle: "#FFEDD5", bold: "#C2410C" },
  "8": { base: "#06B6D4", subtle: "#CFFAFE", bold: "#0E7490" },
  "9": { base: "#EC4899", subtle: "#FCE7F3", bold: "#BE185D" },
  "10": { base: "#F43F5E", subtle: "#FFE4E6", bold: "#BE123C" },
  "11": { base: "#3B82F6", subtle: "#DBEAFE", bold: "#1D4ED8" },
  "12": { base: "#84CC16", subtle: "#ECFCCB", bold: "#4D7C0F" },
  "13": { base: "#F59E0B", subtle: "#FEF3C7", bold: "#B45309" },
  "14": { base: "#D946EF", subtle: "#FAE8FF", bold: "#A21CAF" },
  "15": { base: "#A855F7", subtle: "#F3E8FF", bold: "#7E22CE" },
  "16": { base: "#8B5CF6", subtle: "#EDE9FE", bold: "#6D28D9" },
}

describe("native scales.categorical が web の16色と一致する（#445）", () => {
  it("16件すべて揃っている", () => {
    expect(Object.keys(scales.categorical)).toHaveLength(16)
  })

  for (const n of Object.keys(WEB_CATEGORICAL_HEX)) {
    it(`Categorical-${n} の base/subtle/bold が web と一致する`, () => {
      const native = scales.categorical[n as keyof typeof scales.categorical]
      expect(native.base).toBe(WEB_CATEGORICAL_HEX[n].base)
      expect(native.subtle).toBe(WEB_CATEGORICAL_HEX[n].subtle)
      expect(native.bold).toBe(WEB_CATEGORICAL_HEX[n].bold)
    })
  }
})

/**
 * RN のレンダリングテスト基盤がリポジトリに無いため、native-chip-a11y と同じ
 * ソーススキャン方式で「categorical/dot が実装に存在し、文字に bold・ドットに
 * base を使う」契約を固定する（CLAUDE.md: 文字に base を使うとコントラスト不足）。
 */
const tagSource = readFileSync(join(__dirname, "..", "src/native/components/Tag.tsx"), "utf8")

describe("native Tag の categorical/dot 実装（#445）", () => {
  it("categorical?: TagCategorical / dot?: boolean を props に持つ", () => {
    expect(tagSource).toMatch(/categorical\?:\s*TagCategorical/)
    expect(tagSource).toMatch(/dot\?:\s*boolean/)
  })

  it("文字色に bold、ドットに base を使う（base を文字に使わない）", () => {
    expect(tagSource).toContain("categoricalColors.bold")
    expect(tagSource).toContain("categoricalColors.base")
  })

  it("categorical は tone/variant の配色より優先される", () => {
    expect(tagSource).toMatch(/categoricalColors\s*\?\s*\{[\s\S]*?\}\s*:\s*variant === "filled"/)
  })

  it("dot は装飾のみでスクリーンリーダーから隠す", () => {
    expect(tagSource).toContain("accessibilityElementsHidden")
    expect(tagSource).toContain('importantForAccessibility="no-hide-descendants"')
  })
})
