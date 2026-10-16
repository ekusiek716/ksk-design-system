import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

// issue #694: Tailwind 標準の scrollbar-none は 4.2 未満の consumer では生成されず、
// Safari 18.2 未満では scrollbar-width が効かない（consumer で「謎の縦線」になった）。
// DS 部品は preset-core が自前で定義する scrollbar-hide（-webkit-scrollbar も隠す）を使う。
const ROOT = join(__dirname, "..")

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(name) && !/\.stories\.tsx$/.test(name)) out.push(p)
  }
  return out
}

describe("横スクロールのスクロールバー非表示（#694）", () => {
  it("DS 部品は scrollbar-none を使わない", () => {
    const offenders = walk(join(ROOT, "src/components")).filter((f) => /\bscrollbar-none\b/.test(readFileSync(f, "utf8")))
    expect(offenders).toEqual([])
  })

  it("preset-core の scrollbar-hide は -webkit-scrollbar も隠す", () => {
    const css = readFileSync(join(ROOT, "src/preset-core.css"), "utf8")
    const block = css.slice(css.indexOf("@utility scrollbar-hide"), css.indexOf("}", css.indexOf("display: none")) + 1)
    expect(block).toContain("scrollbar-width: none")
    expect(block).toContain("&::-webkit-scrollbar")
    expect(block).toContain("display: none")
  })
})
