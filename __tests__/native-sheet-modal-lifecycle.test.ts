import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync("src/native/components/Sheet.tsx", "utf8")

describe("native Sheet snap mode Modal lifecycle (#248)", () => {
  it("Modal表示完了後に入口アニメーションを開始する", () => {
    expect(source).toContain("onShow={handleModalShow}")
    expect(source).toContain("const handleModalShow = () =>")
    expect(source).toMatch(
      /const handleModalShow = \(\) => \{[\s\S]*translateY\.setValue\(panelH\)[\s\S]*moveTo\(initialActive, SNAP_DUR\)/,
    )
  })

  it("onShowやnative animationが完了しなくても初期snapを可視位置へ戻す", () => {
    expect(source).toContain("REVEAL_FALLBACK_DELAY")
    expect(source).toMatch(
      /setTimeout\(\(\) => \{[\s\S]*translateY\.setValue\(initialTranslateY\)[\s\S]*\}, REVEAL_FALLBACK_DELAY\)/,
    )
  })

  it("閉じた後やunmount後に古いfallbackを残さない", () => {
    expect(source).toContain("clearTimeout(revealFallbackRef.current)")
    expect(source).toContain("openRef.current = open")
    expect(source).toMatch(/if \(!openRef\.current\) return/)
  })
})
