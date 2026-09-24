/**
 * Liquid Glass の前景ぼけ回帰ガード（全ブラウザー）
 *
 * `.glass-specular::after` は本文より上に重ねる conic リムの装飾。
 * ここに backdrop-filter を置くと本文もぼかす対象になり、mask(exclude) に
 * よる縁への適用域制限が効かない描画環境では、文字やボタン全体がぼやける。
 *
 * Safari 向けの回避だけではなく、Chromium 向けルールにも禁止を適用する。
 * 背景のガラス効果は素材クラス側で維持し、前景をぼかす装飾だけをなくす。
 * この契約を静的に検証する。実際の文字の鮮明度はブラウザーで別途確認する。
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

describe("Liquid Glass の前景ぼけ回帰ガード", () => {
  it("Chromium 限定ゲート（-webkit-app-region）が存在する", () => {
    expect(gateIndex).toBeGreaterThan(-1)
  })

  it("すべての .glass-specular::after は backdrop-filter を持たない", () => {
    const bodies = afterRuleBodies(css)
    expect(bodies.length).toBeGreaterThan(0)
    for (const body of bodies) {
      expect(
        /backdrop-filter/.test(body),
        `前景より上の .glass-specular::after に backdrop-filter が復活している。マスクで縁に限定される前提に依存せず、ぼかしは本文より下の素材クラスにだけ適用すること。`
      ).toBe(false)
    }
  })

  it("素材本体の背景ぼかし・屈折は Chromium ゲート内で維持する", () => {
    const material = stripComments(gated).match(/\.glass\s*\{([^}]*)\}/)?.[1]
    expect(material).toMatch(/-webkit-backdrop-filter:\s*var\(--glass-blur\) var\(--glass-refract\);\s*backdrop-filter:\s*var\(--glass-blur\) var\(--glass-refract\)/)
  })
})
