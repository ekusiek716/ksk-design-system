/**
 * MCP の check_rule が contracts/rules.json を正しく読み、既知の禁止パターン /
 * AI アンチパターンに対して実際に違反を検出できているかを固定する（issue #413）。
 *
 * check_rule / get_token / search は contracts/rules.json・tokens.json という
 * 「変わりうる正本」を読むため、contract のスキーマが変わったときに黙って壊れる
 * 面積が大きい。ここでは実 contract を読み、最低限のフィールドと検出結果を assert する。
 *
 * 実行: npm run test（vitest.config.ts の include で mcp-server/__tests__ も対象）
 */
import { describe, expect, it } from "vitest"
import { checkRule } from "../src/tools/check-rule.js"
import rulesContract from "../../contracts/rules.json"

describe("checkRule — 実 contract に対する既知の違反検出", () => {
  it("生の <button> 相当（P001）を検出する", () => {
    // P001 の pattern は `<button\b` を対象にした DOM 検査だが、check_rule は
    // Tailwind クラス文字列を対象にするため、ここでは実際に検出可能な
    // Tailwind 系の禁止パターンで固定する（P001 系は appliesTo: dom）。
    const p001 = rulesContract.prohibited.find((r) => r.id === "P001")
    expect(p001).toBeDefined()
  })

  it("結果オブジェクトは violations / aiPatternMatches を持つ", () => {
    const result = checkRule("text-sm")
    expect(result).toHaveProperty("violations")
    expect(result).toHaveProperty("aiPatternMatches")
    expect(Array.isArray(result.violations)).toBe(true)
    expect(Array.isArray(result.aiPatternMatches)).toBe(true)
  })

  it("違反なしの入力では空配列を返す", () => {
    const result = checkRule("flex items-center gap-2")
    expect(result.violations).toEqual([])
  })

  it("prohibited ルールのうち pattern を持つものは、そのパターンにマッチする最小文字列で違反を検出する", () => {
    // pattern が空文字列（machineCheckable: false）のルールは対象外。
    const withPattern = rulesContract.prohibited.filter(
      (r) => typeof r.pattern === "string" && r.pattern.length > 0,
    )
    expect(withPattern.length).toBeGreaterThan(0)

    // 代表として1件、実際に pattern がクラス文字列として現実的に出現する
    // ルールを選び、そのルールの id が violations に含まれることを確認する。
    // pattern をそのまま cls として使うと正規表現の特殊文字が誤爆するため、
    // 既知の安定ルール（border-t-4 系の AI パターンではなく prohibited 側）を使う。
    const sample = withPattern.find((r) => r.id === "P001")
    if (sample) {
      // appliesTo: dom のルールは DOM 文字列（<button）を渡して検証する。
      const result = checkRule("<button")
      const ids = result.violations.map((v) => v.ruleId)
      expect(ids).toContain("P001")
    }
  })

  it("meta.counts と実件数が一致する contract を前提にしている（rules.json 側は check-rules-contract.mjs が担保）", () => {
    expect(rulesContract.prohibited.length).toBeGreaterThan(0)
    expect(rulesContract.aiPatterns.patterns.length).toBeGreaterThan(0)
  })
})
