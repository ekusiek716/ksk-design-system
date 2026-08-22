import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

// issue #463 の回帰テスト。
// contracts/rules.json の P020.excludeLines は正規表現エスケープ済みの
// "shadow-\\[" だったため、bin/lint.js の literal 文字列比較（line.includes）
// と一度も一致せず、DS 公式のシャドウトークン shadow-[var(--shadow-md)] を
// 使っている行が誤検知されていた（belle-todo 実測 9 件）。literal 化で再発防止する。

function runKskLint(source: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-p020-exclude-"))
  const srcDir = join(dir, "src")
  mkdirSync(srcDir)
  const file = join(srcDir, "Example.tsx")
  writeFileSync(file, source)
  const result = spawnSync(process.execPath, ["bin/init.js", "lint", file, "--format", "json"], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
  return (JSON.parse(result.stdout).results as { ruleId: string; line: number }[]).map(
    (finding) => finding.ruleId,
  )
}

describe("issue #463: P020 excludeLines の literal 化", () => {
  it("DS 公式のシャドウトークン shadow-[var(--shadow-md)] は P020 で誤検知しない", () => {
    const ids = runKskLint(`
      export function Example() {
        return <div className="shadow-[var(--shadow-md)]">card</div>
      }
    `)
    expect(ids).not.toContain("P020")
  })

  it("DS 定義外の shadow-md 直書きは引き続き検出する", () => {
    const ids = runKskLint(`
      export function Example() {
        return <div className="shadow-md">card</div>
      }
    `)
    expect(ids).toContain("P020")
  })
})
