import { describe, expect, it } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

// この guardrail（Button aria-pressed toggle 手組み禁止 / 一時的成功通知の
// Banner 化禁止）は、以前は scripts/lint-scratch.sh の独自 grep 判定
// （G1/G2）で検査していたが、issue #389 対応で bin/lint.js +
// contracts/rules.json（P033/P034）と完全重複していたため lint-scratch.sh
// 側は削除した。正本が bin/lint.js に一本化されたので、この回帰テストも
// bin/init.js lint（bin/lint.js のエントリポイント）を叩く形に追従する。
function runLint(source: string) {
  const dir = mkdtempSync(join(tmpdir(), "ksk-ds-lint-"))
  const srcDir = join(dir, "src")
  mkdirSync(srcDir)
  const file = join(srcDir, "Example.tsx")
  writeFileSync(file, source)
  return spawnSync(process.execPath, ["bin/init.js", "lint", file], {
    cwd: process.cwd(),
    encoding: "utf8",
  })
}

describe("DS adoption guardrails", () => {
  it("Button toggle の手組みを PillToggle に誘導する", () => {
    const result = runLint(`
      import { Button } from "ksk-design-system"
      export function Example() {
        return <Button aria-pressed={true}>支出</Button>
      }
    `)
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("P033")
  })

  it("transient success Banner を Toast に誘導する", () => {
    const result = runLint(`
      import { Banner } from "ksk-design-system"
      export function Example() {
        return <Banner variant="success" title="接続が復旧しました" />
      }
    `)
    expect(result.status).toBe(1)
    expect(result.stdout).toContain("P034")
  })

  it("明示的な escape コメントがあれば guardrail を回避できる", () => {
    const result = runLint(`
      // ksk-ds-allow-custom-ui: domain-specific toggle control
      import { Button } from "ksk-design-system"
      export function Example() {
        return <Button aria-pressed={true}>特殊</Button>
      }
    `)
    expect(result.status).toBe(0)
  })
})
