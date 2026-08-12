import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * native Card の角丸（issue #332）。
 *
 * 角丸が borderRadius.lg（8px）固定で、consumer（exam-kit）は全13箇所を
 * style={{ borderRadius: 16 }} で上書きしていた。radius prop を追加し、
 * scales.borderRadius 経由で選べるようにした。
 *
 * - 既定は "lg"（8px）のまま据え置き（後方互換。既定を変えると全 consumer の
 *   カードの見た目が一斉に変わるため）
 * - 値は scales.borderRadius 経由で、生の数値をハードコードしない
 *
 * RN のレンダリングテスト基盤がリポジトリに無いため、native-swipe-row-a11y と
 * 同じソーススキャン方式で契約を固定する。
 */
const cardSource = readFileSync(join(__dirname, "..", "src/native/components/Card.tsx"), "utf8")

describe("native Card の radius prop（#332）", () => {
  it("radius prop の型が lg/xl/2xl の3値である", () => {
    expect(cardSource).toContain('radius?: "lg" | "xl" | "2xl"')
  })

  it("既定値が lg（8px）のまま据え置かれている", () => {
    expect(cardSource).toMatch(/radius = "lg"/)
  })

  it("borderRadius を scales.borderRadius 経由で解決し、生の数値をハードコードしない", () => {
    expect(cardSource).toContain("borderRadius: scales.borderRadius[radius]")
    expect(cardSource).not.toMatch(/borderRadius:\s*(8|12|16)\b/)
  })
})
