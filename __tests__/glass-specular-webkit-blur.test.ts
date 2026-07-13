/**
 * Liquid Glass リム blur の Safari(WebKit) 回帰ガード
 *
 * `.glass-specular::after` は conic リムを描く 1px の枠で、その枠だけに
 * `backdrop-filter: blur(4px)` を効かせて「光を導く切断面」を作る。適用域の
 * 限定は mask(exclude) に依存している。
 *
 * ⚠️ 回帰（yokoku-app Safari, 2026-07 / このガードの発端）:
 * WebKit は mask で backdrop-filter のサンプリング域をクリップしない。よって
 * この ::after（z-index:2、コンテンツ z1 の上）の blur(4px) がシート全面に
 * かかり、前景テキスト（Liquid Glass シート内のボタン文字など）を潰す。Blink は
 * mask で適用域も 1px に限定するため出ない、ブラウザ差分バグ。
 *
 * 対策: ::after の backdrop-filter は Chromium 限定の
 * `@supports (-webkit-app-region: none)` ゲート内でのみ供給し、非対応
 * （Safari/Firefox）では conic リムのみに安全劣化させる。conic リム背景自体は
 * WebKit でも mask で正しく 1px に切り取られるので割れない。
 *
 * この契約（base ::after は backdrop-filter を持たない / ゲート内でのみ持つ）が
 * 壊れていないか静的に検証する。DOM 非依存。
 *
 * 実行: npm run test
 */
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(__dirname, "..")
const css = readFileSync(join(ROOT, "src/styles/glass.css"), "utf8")

const GATE = "@supports (-webkit-app-region: none)"
const gateIndex = css.indexOf(GATE)

/** ゲートより前（＝全ブラウザ共通に適用される）の CSS 断片 */
const ungated = gateIndex === -1 ? css : css.slice(0, gateIndex)
/** ゲート以降（＝Chromium 限定で追加適用される）の CSS 断片 */
const gated = gateIndex === -1 ? "" : css.slice(gateIndex)

/** CSS コメント（解説文に "backdrop-filter" の語が含まれるため）を除去する */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "")
}

/** rel 内の `.glass-specular::after { ... }` ルール本体（複数あれば全部）を返す（コメント除去済み） */
function afterRuleBodies(source: string): string[] {
  const clean = stripComments(source)
  const re = /\.glass-specular::after\s*\{([^}]*)\}/g
  const bodies: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(clean)) !== null) bodies.push(m[1])
  return bodies
}

describe("Liquid Glass リム blur の WebKit 回帰ガード", () => {
  it("Chromium 限定ゲート（-webkit-app-region）が存在する", () => {
    expect(gateIndex).toBeGreaterThan(-1)
  })

  it("ゲート外の .glass-specular::after は backdrop-filter を持たない（Safari で全面ぼやけ→前景テキストが潰れる地雷）", () => {
    const bodies = afterRuleBodies(ungated)
    expect(bodies.length).toBeGreaterThan(0)
    for (const body of bodies) {
      expect(
        /backdrop-filter/.test(body),
        `ゲート外の .glass-specular::after に backdrop-filter が復活している。WebKit は mask で適用域を切らないためシート全面がぼやけ前景テキストが潰れる。backdrop-filter は @supports (-webkit-app-region: none) 内でのみ供給すること。`
      ).toBe(false)
    }
  })

  it("Chromium ゲート内で .glass-specular::after に backdrop-filter を供給している（リムの progressive blur は維持）", () => {
    expect(gated).toMatch(/\.glass-specular::after/)
    const bodies = afterRuleBodies(gated)
    expect(bodies.some((b) => /backdrop-filter:\s*blur/.test(b))).toBe(true)
    // -webkit- 先・標準後の宣言順も維持する（consumer minifier dedupe 対策）
    expect(gated).toMatch(/-webkit-backdrop-filter:\s*blur[^;]*;\s*\n?\s*backdrop-filter:\s*blur/)
  })
})
