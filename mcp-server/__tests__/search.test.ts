/**
 * MCP の search が contracts/components.json・contracts/rules.json・tokens.json
 * を横断して検索できているかを固定する（issue #413）。
 *
 * 4つの検索対象（component / token / rule / ai-pattern）のうち1つでも
 * loader の戻り値の形が変わると黙って結果 0 件になりうるため、
 * 実 contract を対象に「既知のキーワードで各 type が最低1件ヒットする」ことを assert する。
 *
 * 実行: npm run test（vitest.config.ts の include で mcp-server/__tests__ も対象）
 */
import { describe, expect, it } from "vitest"
import { search } from "../src/tools/search.js"

describe("search — 実 contract を横断した検索", () => {
  it("component: 既知のコンポーネント名でヒットする", () => {
    const results = search("Button")
    const hit = results.find((r) => r.type === "component" && r.name === "Button")
    expect(hit).toBeDefined()
  })

  it("token: 既知のトークン名でヒットする", () => {
    const results = search("Surface")
    const hit = results.find((r) => r.type === "token")
    expect(hit).toBeDefined()
  })

  it("rule: 禁止パターンのキーワードでヒットする", () => {
    const results = search("button")
    const hit = results.find((r) => r.type === "rule")
    expect(hit).toBeDefined()
  })

  it("ai-pattern: AI アンチパターンのキーワードでヒットする", () => {
    const results = search("カラーバー")
    const hit = results.find((r) => r.type === "ai-pattern")
    expect(hit).toBeDefined()
    expect(hit?.id).toBe("AI1")
  })

  it("未知のキーワードは空配列を返す", () => {
    const results = search("該当するはずのない文字列xyz123zzz")
    expect(results).toEqual([])
  })

  it("結果は type / data フィールドを必ず持つ", () => {
    const results = search("Button")
    for (const r of results) {
      expect(["component", "token", "rule", "ai-pattern"]).toContain(r.type)
      expect(r.data).toBeDefined()
    }
  })
})
