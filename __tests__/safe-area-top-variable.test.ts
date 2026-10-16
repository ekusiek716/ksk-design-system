import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

// issue #682: 上端の safe area は --Safe-Area-Inset-Top（= max(--Native-Safe-Area-Inset-Top, env())）で読む。
// WKWebView で env(safe-area-inset-top) が 0 に固着しても、ネイティブの殻が実測値を渡せば DS 部品が追従する。
const ROOT = join(__dirname, "..")

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx|ts|css)$/.test(name) && !/\.stories\.tsx$/.test(name)) out.push(p)
  }
  return out
}

const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")

describe("上端 safe area の受け口（#682）", () => {
  it("product-theme.css が --Safe-Area-Inset-Top をネイティブ値と env() の大きい方で定義する", () => {
    const css = readFileSync(join(ROOT, "src/styles/product-theme.css"), "utf8")
    expect(css).toContain("--Safe-Area-Inset-Top: max(var(--Native-Safe-Area-Inset-Top, 0px), env(safe-area-inset-top, 0px));")
  })

  it("DS の部品・CSS は env(safe-area-inset-top) を直接読まず、変数（env をフォールバックに持つ）経由で読む", () => {
    const files = [...walk(join(ROOT, "src/components")), ...walk(join(ROOT, "src/styles"))].filter(
      (f) => !f.endsWith("product-theme.css") && !f.endsWith("source-safelist.css"),
    )
    const offenders: string[] = []
    for (const f of files) {
      const code = stripComments(readFileSync(f, "utf8"))
      // 変数のフォールバック内（var(--Safe-Area-Inset-Top, env(...))）を除いた素の env() 参照を探す
      const bare = code.replace(/var\(--Safe-Area-Inset-Top,\s*env\(safe-area-inset-top,\s*0px\)\)/g, "")
      if (/env\(safe-area-inset-top/.test(bare)) offenders.push(f.replace(ROOT + "/", ""))
    }
    expect(offenders).toEqual([])
  })
})
