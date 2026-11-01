import { describe, expect, it } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

/**
 * issue #830: 淡いブランド面（Brand-Ultra-Light / Surface-Accent-Primary-Light）の上に載せる文字は
 * `Text-Accent-Primary` を使う。ダークの `Brand-Primary`（Brand-400）は塗り・ボタン面の色で、
 * Brand-900 の面の上では 4.07:1 と AA(4.5) を割る。ダークの Text-Accent-Primary は Brand-300 で通る。
 * ライトはどちらも Brand-600 なので見た目は変わらない。
 *
 * 判定単位は文字列リテラル 1 つ（同じ className 文字列に面と文字が同居するか）。
 * `hover:` 等の前置きは区別せず、同居していたら失敗にする。
 */
const SURFACES = ["bg-[var(--Brand-Ultra-Light)]", "bg-[var(--Surface-Accent-Primary-Light)]"]
const BAD_TEXT = ["text-[var(--Brand-Primary)]"]

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(name) && !/\.(stories|test)\.tsx?$/.test(name)) out.push(p)
  }
  return out
}

describe("淡いブランド面の上の文字（issue #830）", () => {
  it("同じ className 文字列に淡いブランド面と text-[var(--Brand-Primary)] を同居させない", () => {
    const offenders: string[] = []
    for (const file of walk(join(__dirname, "..", "src", "components"))) {
      const source = readFileSync(file, "utf8")
      for (const m of source.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)) {
        const literal = m[2]
        if (SURFACES.some((s) => literal.includes(s)) && BAD_TEXT.some((t) => literal.includes(t))) {
          offenders.push(`${file}: ${literal.slice(0, 120)}`)
        }
      }
    }
    expect(offenders, "淡いブランド面の上の文字は text-[var(--Text-Accent-Primary)] にする").toEqual([])
  })
})
