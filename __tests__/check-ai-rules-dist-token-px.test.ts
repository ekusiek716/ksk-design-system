/**
 * check-ai-rules-dist.mjs の追加検査の回帰テスト:
 * トークンの px 値の突き合わせ / --force の検査対象 / isShipped の否定と .npmignore。
 */
import { describe, expect, it } from "vitest"
import {
  acceptsForceFlag,
  checkAiRulesDist,
  findTokenPxMismatches,
  isShipped,
  parseCssLengths,
  parseNpmignore,
  // @ts-expect-error — .mjs の純関数（型定義なし）
} from "../scripts/check-ai-rules-dist.mjs"

describe("トークンの px 値を CSS の定義と突き合わせる", () => {
  const css = `:root {
  --Radius-Surface: 0.875rem; /* 14px */
  --Radius-Modal: 1.5rem;
  --Radius-Sheet: 2rem;
  --Control-Height-Md: 40px;
}
@media (prefers-reduced-motion: reduce) { :root { --Radius-Surface: 0px; } }`
  const lengths = parseCssLengths([css])

  it("rem と px を px に換算し、最初の定義を採る", () => {
    expect(lengths.get("--Radius-Surface")).toBe(14)
    expect(lengths.get("--Radius-Modal")).toBe(24)
    expect(lengths.get("--Control-Height-Md")).toBe(40)
  })
  it("表・括弧・束ね書きの3形態で食い違いを検出する", () => {
    expect(findTokenPxMismatches("| `--Radius-Surface`（Card） | 8px | Small |", lengths)).toHaveLength(1)
    expect(findTokenPxMismatches("意味トークン `--Radius-Surface`(8) / `--Radius-Modal`(24)", lengths)).toHaveLength(1)
    const bundled = findTokenPxMismatches("`rounded-[var(--Radius-Surface|Modal|Sheet)]`（8/24/32px）", lengths)
    expect(bundled).toHaveLength(1)
    expect(bundled[0].message).toContain("--Radius-Surface")
  })
  it("一致していれば空。CSS に定義の無いトークンは対象外", () => {
    expect(findTokenPxMismatches("| `--Radius-Surface` | 14px |", lengths)).toEqual([])
    expect(findTokenPxMismatches("`rounded-[var(--Radius-Surface|Modal|Sheet)]`（14/24/32px）", lengths)).toEqual([])
    expect(findTokenPxMismatches("`--Unknown-Token`(99)", lengths)).toEqual([])
  })
  it("checkAiRulesDist から TOKEN-PX として報告される", () => {
    const problems = checkAiRulesDist({
      files: ["templates", "contracts"],
      initSource: `const force = args.includes("--force"); { src: "templates/CLAUDE.md" }`,
      templates: {},
      rootDocs: {},
      skillDocs: { "SKILL.md": "`--Radius-Surface`(8)" },
      cssSources: { "radius.css": css },
      exists: () => true,
    })
    expect(problems.map((p: { kind: string }) => p.kind)).toEqual(["TOKEN-PX"])
  })
})

describe("--force の検査は引数処理に当てる", () => {
  it("引用符付きのリテラルがあれば受け付けている", () => {
    expect(acceptsForceFlag(`const force = args.includes("--force")`)).toBe(true)
  })
  it("コメントやヘルプ文だけでは受け付けていない扱い", () => {
    expect(acceptsForceFlag("// npx ksk-ds init --force\nconsole.log(`  npx ksk-ds init --force  上書き`)")).toBe(false)
  })
})

describe("isShipped の否定と .npmignore", () => {
  it("files の ! 否定で除外される（後ろのエントリが優先）", () => {
    expect(isShipped("contracts/internal/a.json", ["contracts", "!contracts/internal"])).toBe(false)
    expect(isShipped("contracts/rules.json", ["contracts", "!contracts/internal"])).toBe(true)
    expect(isShipped("contracts/internal/a.json", ["!contracts/internal", "contracts"])).toBe(true)
  })
  it(".npmignore の行に当たるものは配布されない", () => {
    expect(isShipped("templates/CLAUDE.md", ["templates"], parseNpmignore("# c\ntemplates/CLAUDE.md\n"))).toBe(false)
    expect(isShipped("templates/AGENTS.md", ["templates"], parseNpmignore("templates/CLAUDE.md"))).toBe(true)
  })
})
