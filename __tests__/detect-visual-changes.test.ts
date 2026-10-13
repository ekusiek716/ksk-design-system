/**
 * 見た目に効く変更の検出（scripts/detect-visual-changes.mjs）の回帰テスト。
 * 「当たるべきものが当たる」だけでなく、「紛らわしいが当たってはいけないもの」を固定する。
 */
import { describe, expect, it } from "vitest"
import {
  buildReport,
  classifyTokenPath,
  diffTokens,
  isScannedFile,
  renderMarkdown,
  scanDiffLines,
  COMMENT_MARKER,
  // @ts-expect-error — .mjs の純関数（型定義なし）
} from "../scripts/detect-visual-changes.mjs"

/** 1ファイル・1行の追加だけの unified diff を作る */
function addedLine(file: string, text: string, line = 10) {
  return [
    `diff --git a/${file} b/${file}`,
    `--- a/${file}`,
    `+++ b/${file}`,
    `@@ -${line},0 +${line},1 @@`,
    `+${text}`,
  ].join("\n")
}

const categoriesOf = (hits: { category: string }[]) => hits.map((h) => h.category)

describe("行の判定（src の差分）", () => {
  it("border を検出する（色の併記があってもなくても）", () => {
    const hits = scanDiffLines(addedLine("src/components/ui/card.tsx", `className="border border-[var(--Border-Low-Emphasis)]"`))
    expect(categoriesOf(hits)).toContain("border")
  })

  it("focus ring / outline を検出する", () => {
    const a = scanDiffLines(addedLine("src/components/ui/button.tsx", `"focus-visible:ring-2 focus-visible:ring-[var(--Focus-High-Emphasis)]"`))
    expect(categoriesOf(a)).toContain("focus-ring")
    const b = scanDiffLines(addedLine("src/components/ui/button.tsx", `"outline-hidden"`))
    expect(categoriesOf(b)).toContain("focus-ring")
  })

  it("shadow / 角丸 / 余白を検出する", () => {
    expect(categoriesOf(scanDiffLines(addedLine("src/components/ui/card.tsx", `"shadow-md"`)))).toContain("shadow")
    expect(categoriesOf(scanDiffLines(addedLine("src/components/ui/card.tsx", `"rounded-xl"`)))).toContain("radius")
    expect(categoriesOf(scanDiffLines(addedLine("src/components/ui/card.tsx", `"px-4 gap-3"`)))).toContain("spacing")
  })

  it("色トークンの参照を検出する", () => {
    const hits = scanDiffLines(addedLine("src/components/ui/card.tsx", `"bg-[var(--Surface-Secondary)]"`))
    expect(categoriesOf(hits)).toContain("color")
  })

  it("border-radius は角丸であって枠線ではない", () => {
    const hits = scanDiffLines(addedLine("src/styles/foo.css", `  border-radius: var(--Radius-Surface);`))
    expect(categoriesOf(hits)).toContain("radius")
    expect(categoriesOf(hits)).not.toContain("border")
  })

  it("別語の一部（string / sharing / orchestra 等）は拾わない", () => {
    const hits = scanDiffLines(addedLine("src/lib/util.ts", `const string = "sharing"; const orchestra = 1`))
    expect(hits).toEqual([])
  })

  it("コメントだけの行は対象外", () => {
    const hits = scanDiffLines(addedLine("src/components/ui/card.tsx", `// border を足す。shadow-md は使わない`))
    expect(hits).toEqual([])
  })

  it("stories・テスト・型定義・src 外は対象外", () => {
    for (const file of [
      "src/components/ui/card.stories.tsx",
      "src/components/ui/card.test.tsx",
      "src/stories/Intro.tsx",
      "src/types.d.ts",
      "docs/guide.md",
      "scripts/foo.mjs",
    ]) {
      expect(scanDiffLines(addedLine(file, `"border shadow-md rounded-xl"`)), file).toEqual([])
      expect(isScannedFile(file), file).toBe(false)
    }
  })

  it("追加行は新ファイル側の行番号を返し、削除行は行番号なし", () => {
    const diff = [
      "diff --git a/src/components/ui/card.tsx b/src/components/ui/card.tsx",
      "--- a/src/components/ui/card.tsx",
      "+++ b/src/components/ui/card.tsx",
      "@@ -4,1 +42,2 @@",
      `-"shadow-sm"`,
      `+"shadow-md"`,
      `+"border"`,
    ].join("\n")
    const hits = scanDiffLines(diff)
    expect(hits.find((h: { sign: string }) => h.sign === "-")?.line).toBeNull()
    expect(hits.filter((h: { sign: string }) => h.sign === "+").map((h: { line: number }) => h.line)).toEqual([42, 43])
  })
})

describe("tokens.json の構造比較", () => {
  const base = {
    meta: { version: "1.0.0" },
    colors: {
      primitive: { gray: { "200": "#E4E4E7" } },
      semantic: {
        border: { "low-emphasis": "var(--Primitive-Gray-200)" },
        focus: { "high-emphasis": "var(--Primitive-Brand-500)" },
        text: { "high-emphasis": "var(--Primitive-Gray-700)" },
      },
    },
    shadows: { _doc: "説明", sm: "0 1px 2px #0001" },
    borderRadius: { md: "8px" },
    spacing: { scale: { "1": "4px" } },
    themes: { default: { brand: "#3B82F6" } },
  }
  const clone = () => JSON.parse(JSON.stringify(base))

  it("変更が無ければ空", () => {
    expect(diffTokens(base, clone())).toEqual([])
  })

  it("meta と _doc の変更は無視する", () => {
    const after = clone()
    after.meta.version = "9.9.9"
    after.shadows._doc = "別の説明"
    expect(diffTokens(base, after)).toEqual([])
  })

  it("枠線トークンは値だけが変わっても border に分類する", () => {
    const after = clone()
    after.colors.semantic.border["low-emphasis"] = "var(--Primitive-Gray-400)"
    expect(diffTokens(base, after)).toEqual([{ category: "border", path: "colors.semantic.border.low-emphasis" }])
  })

  it("focus / shadow / 角丸 / 余白 / 色 に分類する", () => {
    const after = clone()
    after.colors.semantic.focus["high-emphasis"] = "var(--Primitive-Brand-700)"
    after.shadows.sm = "0 2px 4px #0002"
    after.borderRadius.md = "12px"
    after.spacing.scale["1"] = "6px"
    after.colors.semantic.text["high-emphasis"] = "var(--Primitive-Gray-900)"
    after.themes.default.brand = "#2563EB"
    expect(categoriesOf(diffTokens(base, after)).sort()).toEqual(["color", "color", "focus-ring", "radius", "shadow", "spacing"])
  })

  it("キーの追加・削除も検出する", () => {
    const after = clone()
    after.shadows.lg = "0 8px 16px #0003"
    expect(diffTokens(base, after)).toEqual([{ category: "shadow", path: "shadows.lg" }])
  })

  it("実際の tokens.json のパスを分類できる", () => {
    expect(classifyTokenPath("colors.semanticDark.border.high-emphasis")).toBe("border")
    expect(classifyTokenPath("colors.semanticDark.focus.high-emphasis")).toBe("focus-ring")
    expect(classifyTokenPath("elevation.raised")).toBe("shadow")
    expect(classifyTokenPath("borderRadiusNative.md")).toBe("radius")
    expect(classifyTokenPath("touchTargets.buttonCTA")).toBeNull()
    expect(classifyTokenPath("typography.body.md")).toBeNull()
  })
})

describe("レポートとコメント", () => {
  it("ヒットが無ければ hit=false で、マーカー付きの解除文を返す", () => {
    const report = buildReport({ tokenHits: [], lineHits: [] })
    expect(report.hit).toBe(false)
    const md = renderMarkdown(report)
    expect(md.startsWith(COMMENT_MARKER)).toBe(true)
    expect(md).toContain("検出されませんでした")
  })

  it("何がどこで変わったかをカテゴリ別に載せ、件数が多いときは省略する", () => {
    const lineHits = Array.from({ length: 8 }, (_, i) => ({
      category: "shadow",
      file: "src/components/ui/card.tsx",
      line: 10 + i,
      sign: "+",
      text: `"shadow-md-${i}"`,
    }))
    const report = buildReport({
      tokenHits: [{ category: "border", path: "colors.semantic.border.low-emphasis" }],
      lineHits,
    })
    expect(report.hit).toBe(true)
    expect(report.categories).toEqual(["border", "shadow"])
    const md = renderMarkdown(report)
    expect(md.startsWith(COMMENT_MARKER)).toBe(true)
    expect(md).toContain("`tokens.json`: `colors.semantic.border.low-emphasis`")
    expect(md).toContain("`src/components/ui/card.tsx:10`")
    expect(md).toContain("ほか 3 行")
  })
})
