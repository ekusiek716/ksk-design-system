/**
 * `.glass-specular` の position フォールバックのカスケード契約（issue #481）
 *
 * 背景:
 * glass.css は consumer 側で「非レイヤー CSS」として読まれる。素のままだと
 * unlayered > layered のカスケード規則により、`.glass-specular` に付いた
 * `position: relative` フォールバックが consumer のあらゆる position 指定を
 * 無言で踏み潰す。実害: consumer が Tailwind ではなく独自クラス
 * （`.fab-fixed { position: fixed }`）で配置した FAB が relative に戻され、
 * right/bottom が相対オフセットとして解釈されて画面左下に出た（Tabipal, 2026-08）。
 *
 * 契約（どちらも外さない）:
 * 1. フォールバックは Tailwind 既存の `@layer base` の中にあること
 *    → base < components < utilities < unlayered となり、consumer が独自クラスを
 *      どこに書いても consumer の指定が勝つ（= 尊重される）。新規レイヤー名だと
 *      「初登場＝末尾＝最優先」に積まれ、consumer の @layer components に勝って
 *      しまうので不可。
 * 2. `:not(.fixed):not(.absolute):not(.sticky)` の除外を保つこと
 *    → レイヤー順は consumer のビルド順に依存するため、Tailwind ユーティリティを
 *      尊重する保険。落とすと DS 自身の Sheet（`.fixed`）が壊れる回帰に戻る。
 *
 * className だけを見るテストでは CSS の踏み潰しは落とせないため、CSS の中身を
 * 静的に検査する（`sheet-keyboard-float.test.ts` と同じ方式）。DOM 非依存。
 */
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(__dirname, "..")
const raw = readFileSync(join(ROOT, "src/styles/glass.css"), "utf8")
/** 解説コメントに同じ文字列が出るため、判定前に必ずコメントを落とす */
const css = raw.replace(/\/\*[\s\S]*?\*\//g, "")

const LAYER = "@layer base"

/**
 * `@layer ksk-glass-fallback { ... }` ブロックの中身（波括弧の対応を数えて抽出）。
 * ネストしたルールを含むため、単純な `[^}]*` では取り切れない。
 */
function layerRanges(source: string): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = []
  let from = 0
  for (;;) {
    const head = source.indexOf(LAYER, from)
    if (head === -1) break
    const open = source.indexOf("{", head)
    // `@layer ksk-glass-fallback;`（順序宣言のみ）はブロックを持たない
    const semi = source.indexOf(";", head)
    if (open === -1 || (semi !== -1 && semi < open)) {
      from = head + LAYER.length
      continue
    }
    let depth = 0
    let i = open
    for (; i < source.length; i++) {
      if (source[i] === "{") depth++
      else if (source[i] === "}") {
        depth--
        if (depth === 0) break
      }
    }
    ranges.push({ start: open + 1, end: i })
    from = i + 1
  }
  return ranges
}

const ranges = layerRanges(css)
const inLayer = ranges.map((r) => css.slice(r.start, r.end)).join("\n")
/**
 * レイヤーブロックを取り除いた残り = 非レイヤー（unlayered）として出荷される CSS。
 * 文字列 replace だと同一内容のブロックが 2 つあるとき片方しか消えないため、
 * 位置（オフセット）で切り出す。
 */
const unlayered = (() => {
  let out = ""
  let cursor = 0
  for (const r of ranges) {
    out += css.slice(cursor, r.start)
    cursor = r.end
  }
  return out + css.slice(cursor)
})()

/** `selector { ... }` の宣言本体を全部返す（セレクタ完全一致） */
function bodiesOf(source: string, selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const re = new RegExp(`(^|[};])\\s*${escaped}\\s*\\{([^}]*)\\}`, "g")
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(source)) !== null) out.push(m[2])
  return out
}

describe("glass-specular position fallback cascade (#481)", () => {
  it("フォールバックは @layer base の中にある", () => {
    expect(ranges.length).toBeGreaterThan(0)
    expect(inLayer).toContain(".glass-specular:not(.fixed):not(.absolute):not(.sticky)")
  })

  it("Tailwind ユーティリティの除外を保っている（レイヤー順に依存しない保険）", () => {
    const bodies = bodiesOf(inLayer, ".glass-specular:not(.fixed):not(.absolute):not(.sticky)")
    expect(bodies.length).toBe(1)
    expect(bodies[0]).toMatch(/position:\s*relative/)
  })

  it("子の z-lift フォールバックも同じレイヤーに入っている", () => {
    const bodies = bodiesOf(inLayer, ".glass-specular > *:not(.absolute):not(.fixed):not(.sticky)")
    expect(bodies.length).toBe(1)
    expect(bodies[0]).toMatch(/position:\s*relative/)
    expect(bodies[0]).toMatch(/z-index:\s*1/)
  })

  it("非レイヤー側に .glass-specular の position 宣言が残っていない", () => {
    // `.glass-specular { isolation: isolate; overflow: hidden }` 等、
    // position を持たないベース規則は非レイヤーのままでよい。
    const specularRules = unlayered.match(/\.glass-specular[^{}]*\{[^}]*\}/g) ?? []
    const offenders = specularRules.filter(
      // ::before / ::after の position: absolute は擬似要素自身の配置なので対象外
      (rule) => /(^|[\s;{])position\s*:/.test(rule) && !/::(before|after)/.test(rule)
    )
    expect(offenders).toEqual([])
  })

  it("ベース規則の overflow: hidden は非レイヤーのまま（#337 / #479 の前提）", () => {
    // sheet-keyboard.css の `overflow-y: auto` は「非レイヤー同士の後勝ち」で
    // これを上書きしている。レイヤーへ移すと float-glass がスクロールしなくなる。
    const base = bodiesOf(unlayered, ".glass-specular")
    expect(base.length).toBe(1)
    expect(base[0]).toMatch(/overflow:\s*hidden/)
    expect(base[0]).toMatch(/isolation:\s*isolate/)
    expect(base[0]).not.toMatch(/(^|[\s;])position\s*:/)
  })

  it("新規レイヤー名ではなく Tailwind 既存の base レイヤーを使っている", () => {
    // 新規レイヤー名は「初登場＝末尾＝最優先」に積まれるため、consumer の
    // `@layer components { ... }` に勝ってしまい #481 が直りきらない。
    expect(css).not.toContain("ksk-glass-fallback")
  })
})
