import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * native Avatar の柔軟性（issue #449）。
 *
 * プリセット size のみ・円形固定・fallback が文字列のみ、という API だったため
 * aikoibito の AvatarView（数値サイズ / 角丸 / 決定論グラデ+絵文字のフォールバック /
 * リモート URL）を置き換えられなかった。既定はすべて従来どおりに据え置く。
 *
 * RN のレンダリングテスト基盤がリポジトリに無いため、native-card-radius と
 * 同じソーススキャン方式で契約を固定する。
 */
const source = readFileSync(join(__dirname, "..", "src/native/components/Avatar.tsx"), "utf8")

describe("native Avatar の size（#449）", () => {
  it("プリセットと数値が共存する型である", () => {
    expect(source).toContain("size?: AvatarSize | number")
    expect(source).toContain('typeof size === "number" ? size : sizeMap[size]')
  })

  it("既定は md（40）のまま据え置かれている", () => {
    expect(source).toMatch(/size = "md"/)
  })
})

describe("native Avatar の形状（#449）", () => {
  it("shape が circle / rounded の2値で、既定は circle（従来どおり）", () => {
    expect(source).toContain('export type AvatarShape = "circle" | "rounded"')
    expect(source).toMatch(/shape = "circle"/)
  })

  it("rounded の角丸は scales.borderRadius 経由で、生の数値をハードコードしない", () => {
    expect(source).toContain(
      'shape === "circle" ? dim / 2 : scales.borderRadius[radius]',
    )
    expect(source).toMatch(/radius = "xl"/)
    expect(source).not.toMatch(/borderRadius:\s*(8|12|16)\b/)
  })
})

describe("native Avatar の fallback / source（#449）", () => {
  it("fallback が ReactNode を受け取り、文字列だけ Text で包む", () => {
    expect(source).toContain("fallback?: React.ReactNode")
    expect(source).toContain('typeof fallback === "string" || fallback == null')
  })

  it("文字列 fallback の既定表示は従来どおり ? である", () => {
    expect(source).toContain('{fallback ?? "?"}')
  })

  it("source がリモート URL 文字列を受け取り {uri} に正規化する", () => {
    expect(source).toContain("source?: ImageSourcePropType | string")
    expect(source).toContain('typeof source === "string" ? { uri: source } : source')
  })
})
