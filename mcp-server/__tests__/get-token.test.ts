/**
 * MCP の get_token が tokens.json を正しく読み、既知のカテゴリで
 * 期待どおりのトークンを返せているかを固定する（issue #413）。
 *
 * tokens.json のスキーマ（colors.primitive / colors.semantic / typography /
 * spacing / borderRadius / shadows / touchTargets）が変わると get-token.ts の
 * flatten 系関数が黙って空配列を返すようになるおそれがあるため、
 * 実 tokens.json を対象に最低限のフィールドと非空を assert する。
 *
 * 実行: npm run test（vitest.config.ts の include で mcp-server/__tests__ も対象）
 */
import { describe, expect, it } from "vitest"
import { getToken } from "../src/tools/get-token.js"
import tokensJson from "../../tokens.json"

describe("getToken — 実 tokens.json に対する取得", () => {
  it("color カテゴリは semantic + primitive を合わせて返す", () => {
    const result = getToken("color")
    expect(result.category).toBe("color")
    expect(result.count).toBeGreaterThan(0)
    expect(result.tokens.length).toBe(result.count)
    for (const token of result.tokens) {
      expect(typeof token.name).toBe("string")
      expect(typeof token.value).toBe("string")
      expect(token.name.length).toBeGreaterThan(0)
    }
  })

  it("semantic カテゴリのトークン名は var(--...) 形式", () => {
    const result = getToken("semantic")
    expect(result.tokens.length).toBeGreaterThan(0)
    for (const token of result.tokens) {
      expect(token.name).toMatch(/^var\(--/)
    }
  })

  it("primitive カテゴリのトークン名は --Primitive- 形式", () => {
    const result = getToken("primitive")
    expect(result.tokens.length).toBeGreaterThan(0)
    for (const token of result.tokens) {
      expect(token.name).toMatch(/^--Primitive-/)
    }
  })

  it("typography カテゴリは tokens.json の typography セクションと同じ件数を返す", () => {
    const result = getToken("typography")
    // typography は heading/body/label 以外にも display/caption 等のグループを持つ
    const expected = Object.values(tokensJson.typography).reduce(
      (n, group) => n + (typeof group === "object" && group !== null ? Object.keys(group).length : 0),
      0,
    )
    expect(result.tokens.length).toBe(expected)
  })

  it("spacing カテゴリは tokens.json の spacing.scale と同じ件数を返す", () => {
    const result = getToken("spacing")
    expect(result.tokens.length).toBe(tokensJson.spacing.scale.length)
  })

  it("未知のカテゴリはキーワード検索として全カテゴリ横断でフィルタする", () => {
    const result = getToken("brand")
    expect(result.category).toBe("search: brand")
    expect(result.tokens.length).toBeGreaterThan(0)
  })
})
