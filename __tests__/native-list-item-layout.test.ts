import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * native ListItem の align / density / footerSlot（issue #355）。
 *
 * Web 側と同じ語彙を入れつつ、native は既定の見た目（alignItems: "center" /
 * spacing.scale[4] × [3] の padding / 行を包むラッパ無し）を一切変えないことが
 * 最優先。RN のレンダリングテスト基盤がリポジトリに無いため、
 * native-card-radius と同じソーススキャン方式で契約を固定する。
 */
const source = readFileSync(
  join(__dirname, "..", "src/native/components/ListItem.tsx"),
  "utf8",
)

describe("native ListItem の align / density / footerSlot（#355）", () => {
  it("Web と同じ語彙の型を公開している", () => {
    expect(source).toContain('export type ListItemAlign = "start" | "center"')
    expect(source).toContain('export type ListItemDensity = "comfortable" | "compact"')
    expect(source).toContain("footerSlot?: React.ReactNode")
  })

  it("既定値は非破壊側（start / comfortable）に倒してある", () => {
    expect(source).toMatch(/align = "start"/)
    expect(source).toMatch(/density = "comfortable"/)
  })

  it("既定では従来どおり row + alignItems center で、行を包むラッパを増やさない", () => {
    expect(source).toContain('flexDirection: hasFooter ? "column" : "row"')
    expect(source).toContain('alignItems: hasFooter ? "stretch" : "center"')
    // footerSlot が無いときは row をそのまま並べる（中間 View なし）
    expect(source).toMatch(/\) : \(\s*row\s*\)/)
  })

  it("padding は spacing スケール経由で、生の数値をハードコードしない", () => {
    expect(source).toContain(
      "paddingHorizontal: isCompact ? scales.spacing.scale[3] : scales.spacing.scale[4]",
    )
    expect(source).toContain(
      "paddingVertical: isCompact ? scales.spacing.scale[1] : scales.spacing.scale[3]",
    )
  })

  it("align='center' のとき本文列を flex:1 で伸ばさない", () => {
    expect(source).toContain('isCentered ? { gap: 2, alignItems: "center" as const } : { flex: 1, gap: 2 }')
  })
})
